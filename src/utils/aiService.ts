import { Goal, AIInsight } from '../types';

export async function fetchAIInsight(
  goal: Goal,
  currencySymbol = '₹',
  groqApiKey?: string
): Promise<AIInsight> {
  try {
    const res = await fetch('/api/ai/insight', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        goal: {
          name: goal.name,
          targetAmount: goal.targetAmount,
          currentSavings: goal.currentSavings,
          remainingAmount: goal.remainingAmount,
          deadline: goal.deadline,
          daysRemaining: goal.daysRemaining,
          progressPercentage: goal.progressPercentage,
          purpose: goal.purpose,
          currencySymbol,
        },
        groqApiKey: groqApiKey || undefined,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        id: `ai-${Date.now()}`,
        date: new Date().toISOString(),
        provider: data.provider || 'SaveIQ AI Engine',
        summary: data.summary,
        suggestedPace: data.suggestedPace,
        actionableTip: data.actionableTip,
        riskAssessment: data.riskAssessment,
        encouragement: data.encouragement,
      };
    }
  } catch (error) {
    console.warn('API call to /api/ai/insight failed, using client heuristic engine:', error);
  }

  // Client-side fallback if offline
  const days = Math.max(1, goal.daysRemaining);
  const remaining = Math.max(0, goal.targetAmount - goal.currentSavings);
  const daily = Math.ceil(remaining / days);
  const weekly = daily * 7;
  const isCompleted = remaining <= 0;
  const isOverdue = goal.daysRemaining < 0;

  return {
    id: `ai-${Date.now()}`,
    date: new Date().toISOString(),
    provider: 'SaveIQ Intelligent Model',
    summary: isCompleted
      ? `Phenomenal milestone! You have fully achieved the ${goal.name} goal.`
      : isOverdue
      ? `The target deadline for ${goal.name} has passed. Re-aligning your timeline can get you back on track.`
      : `You're currently ${goal.progressPercentage}% toward your ${goal.name} target with ${currencySymbol}${remaining.toLocaleString()} remaining.`,
    suggestedPace: isCompleted
      ? 'Goal 100% Completed'
      : isOverdue
      ? `Recommended restart: ${currencySymbol}${Math.ceil(remaining / 30)}/day over 30 days`
      : `Approximately ${currencySymbol}${daily.toLocaleString()}/day (${currencySymbol}${weekly.toLocaleString()}/week)`,
    actionableTip: isCompleted
      ? 'Direct the amount you used to allocate to this goal into your next priority fund.'
      : `Automate a weekly deposit of ${currencySymbol}${weekly.toLocaleString()} directly to your ${goal.purpose.toLowerCase()} bucket on payday.`,
    riskAssessment: isCompleted
      ? 'Goal Completed'
      : isOverdue
      ? 'Overdue - Needs Revision'
      : goal.daysRemaining <= 14
      ? 'Approaching Deadline'
      : 'Steady Progress',
    encouragement: isCompleted
      ? 'Take a moment to celebrate your discipline!'
      : 'Consistency beats intensity. Every small transfer brings your vision closer to reality.',
  };
}
