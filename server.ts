import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// AI Savings Insight endpoint
app.post('/api/ai/insight', async (req, res) => {
  try {
    const { goal, groqApiKey } = req.body;

    if (!goal || !goal.name) {
      return res.status(400).json({ error: 'Goal data is required' });
    }

    const {
      name,
      targetAmount,
      currentSavings,
      remainingAmount,
      deadline,
      daysRemaining,
      progressPercentage,
      purpose,
      currencySymbol = '₹'
    } = goal;

    // Groq API integration if key provided by user in settings
    if (groqApiKey && typeof groqApiKey === 'string' && groqApiKey.trim().length > 0) {
      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqApiKey.trim()}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              {
                role: 'system',
                content: `You are SaveIQ Financial Advisor AI, a helpful, encouraging, and highly analytical personal finance coach. 
Give concise, realistic, disciplined financial guidance for achieving savings goals. 
Do not promise financial returns or give legal/tax advice. 
Format your response as a valid JSON object matching this structure:
{
  "summary": "Brief 1-2 sentence overview of their current progress",
  "suggestedPace": "e.g., Save ₹350 per day or ₹2,450 per week",
  "actionableTip": "A specific practical habit or behavioral step to accelerate savings for this category",
  "riskAssessment": "Low / Moderate / Needs Attention based on days left vs remaining amount",
  "encouragement": "A warm, motivating one-liner"
}`
              },
              {
                role: 'user',
                content: `Goal: ${name}
Target: ${currencySymbol}${targetAmount.toLocaleString()}
Current Savings: ${currencySymbol}${currentSavings.toLocaleString()} (${progressPercentage}%)
Remaining: ${currencySymbol}${remainingAmount.toLocaleString()}
Days Remaining: ${daysRemaining} days (Deadline: ${deadline})
Purpose: ${purpose}
Provide personalized guidance.`
              }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
            max_tokens: 500,
          })
        });

        if (groqResponse.ok) {
          const groqData = await groqResponse.json();
          const parsed = JSON.parse(groqData.choices[0].message.content);
          return res.json({
            provider: 'Groq (Llama 3.3)',
            ...parsed,
          });
        }
      } catch (groqErr) {
        console.warn('Groq API call failed, falling back to Gemini:', groqErr);
      }
    }

    // Default to Gemini API via @google/genai SDK
    if (aiClient) {
      try {
        const prompt = `You are SaveIQ Financial Advisor AI, a friendly, disciplined personal finance coach.
Provide a concise financial insight for this savings goal:
- Goal: "${name}"
- Purpose: ${purpose}
- Target: ${currencySymbol}${targetAmount.toLocaleString()}
- Saved: ${currencySymbol}${currentSavings.toLocaleString()} (${progressPercentage}%)
- Remaining: ${currencySymbol}${remainingAmount.toLocaleString()}
- Days Remaining: ${daysRemaining} days (Target Deadline: ${deadline})

Return ONLY a valid JSON object with these keys:
{
  "summary": "1-2 sentence clear assessment of their progress and velocity",
  "suggestedPace": "Clear pacing calculation, e.g., Approx ${currencySymbol}${Math.ceil(remainingAmount / Math.max(daysRemaining, 1))}/day or weekly figure",
  "actionableTip": "1 practical actionable tactic (e.g. cutting micro-subscriptions, meal planning, dedicated auto-transfer)",
  "riskAssessment": "${daysRemaining <= 0 && remainingAmount > 0 ? 'Overdue - Needs Revision' : daysRemaining < 14 ? 'Urgent Deadline' : progressPercentage >= 80 ? 'On Track to Finish Early' : 'Steady Progress'}",
  "encouragement": "A disciplined, positive motivational remark without unrealistic financial claims"
}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text;
        if (text) {
          const parsed = JSON.parse(text);
          return res.json({
            provider: 'SaveIQ AI (Gemini 3.8 Flash)',
            ...parsed,
          });
        }
      } catch (geminiErr) {
        console.warn('Gemini API call error:', geminiErr);
      }
    }

    // Smart Heuristic Fallback
    const dailyPace = daysRemaining > 0 ? Math.ceil(remainingAmount / daysRemaining) : remainingAmount;
    const weeklyPace = dailyPace * 7;
    const isCompleted = remainingAmount <= 0;
    const isOverdue = daysRemaining <= 0 && !isCompleted;
    const isUrgent = daysRemaining <= 14 && !isCompleted;

    let summary = `You are ${progressPercentage}% of the way toward your ${name} goal.`;
    if (isCompleted) {
      summary = `Incredible work! You've completely reached your target for ${name}.`;
    } else if (isOverdue) {
      summary = `The target deadline for ${name} has passed. Re-aligning your schedule will get you back in control.`;
    } else if (progressPercentage >= 60) {
      summary = `You're over halfway to your goal with ${currencySymbol}${remainingAmount.toLocaleString()} remaining. Consistent deposits will secure the finish line.`;
    }

    let actionableTip = `Automate a weekly transfer of ${currencySymbol}${weeklyPace.toLocaleString()} to a dedicated savings pot on your payday.`;
    if (purpose === 'Electronics') {
      actionableTip = `Keep an eye out for seasonal sales or refurbished deals which could lower the required ${currencySymbol}${targetAmount.toLocaleString()} target.`;
    } else if (purpose === 'Emergency') {
      actionableTip = `Keep these funds in a high-yield liquid account so they earn interest while remaining easily accessible for urgent needs.`;
    } else if (purpose === 'Travel') {
      actionableTip = `Lock in ticket alerts and off-peak travel slots early to avoid budget creep as your deadline nears.`;
    }

    return res.json({
      provider: 'SaveIQ Intelligence Engine',
      summary,
      suggestedPace: isCompleted ? 'Goal Completed' : `Approximately ${currencySymbol}${dailyPace.toLocaleString()}/day (${currencySymbol}${weeklyPace.toLocaleString()}/week)`,
      actionableTip,
      riskAssessment: isCompleted ? 'Goal Completed' : isOverdue ? 'Overdue' : isUrgent ? 'Approaching Deadline' : 'On Track',
      encouragement: isCompleted 
        ? 'Outstanding discipline! Celebrate this milestone and consider locking in your next goal.' 
        : 'Small, consistent contributions compound faster than sporadic large deposits. Keep going!',
    });

  } catch (error) {
    console.error('AI Insight Error:', error);
    res.status(500).json({ error: 'Failed to generate financial insight' });
  }
});

// Daily Audit Simulation Endpoint (mimicking Google Apps Script daily audit)
app.post('/api/audit', (req, res) => {
  const { goals } = req.body;
  if (!Array.isArray(goals)) {
    return res.status(400).json({ error: 'Goals array is required' });
  }

  const now = new Date();
  const auditedGoals = goals.map(goal => {
    const deadlineDate = new Date(goal.deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const remainingAmount = Math.max(0, goal.targetAmount - goal.currentSavings);
    const progressPercentage = Math.min(100, Math.round((goal.currentSavings / goal.targetAmount) * 100));

    let status = goal.status;
    let alertRequired = false;
    let alertType: 'deadline_approaching' | 'goal_completed' | 'goal_overdue' | null = null;

    if (goal.currentSavings >= goal.targetAmount) {
      status = 'Completed';
      if (goal.status !== 'Completed') {
        alertRequired = true;
        alertType = 'goal_completed';
      }
    } else if (daysRemaining < 0) {
      status = 'Overdue';
      alertRequired = true;
      alertType = 'goal_overdue';
    } else if (daysRemaining <= 7) {
      status = 'Approaching Deadline';
      alertRequired = true;
      alertType = 'deadline_approaching';
    } else {
      status = 'Active';
    }

    return {
      ...goal,
      daysRemaining,
      remainingAmount,
      progressPercentage,
      status,
      alertRequired,
      alertType,
      lastAudited: now.toISOString(),
    };
  });

  const alerts = auditedGoals
    .filter(g => g.alertRequired && g.emailAlerts)
    .map(g => ({
      goalId: g.id,
      goalName: g.name,
      type: g.alertType,
      daysRemaining: g.daysRemaining,
      remainingAmount: g.remainingAmount,
      timestamp: new Date().toISOString(),
      emailSentTo: g.email || 'harshharade007@gmail.com',
    }));

  res.json({
    status: 'success',
    auditTimestamp: now.toISOString(),
    totalGoalsAudited: auditedGoals.length,
    alertsGenerated: alerts.length,
    goals: auditedGoals,
    alerts,
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const htmlPath = path.resolve(__dirname, 'index.html');
        if (fs.existsSync(htmlPath)) {
          let template = fs.readFileSync(htmlPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          return res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
        }
      } catch (e) {
        return next(e);
      }
      next();
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SaveIQ Server running on port ${PORT}`);
  });
}

startServer();
