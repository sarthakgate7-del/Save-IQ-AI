import React, { useState, useEffect } from 'react';
import { Goal, UserProfile, AppNotification, AIInsight } from './types';
import { INITIAL_GOALS, INITIAL_USER, INITIAL_NOTIFICATIONS } from './data/initialData';
import { calculateDaysRemaining, calculateGoalStatus } from './utils/formatters';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { CreateGoalModal } from './components/CreateGoalModal';
import { DepositModal } from './components/DepositModal';
import { GoalDetailsModal } from './components/GoalDetailsModal';
import { AIInsightsView } from './components/AIInsightsView';
import { NotificationsView } from './components/NotificationsView';
import { GoogleSheetsView } from './components/GoogleSheetsView';
import { SettingsView } from './components/SettingsView';
import { AuthModal } from './components/AuthModal';

export default function App() {
  // Load initial data from localStorage if present
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const saved = localStorage.getItem('saveiq_goals');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved goals:', e);
    }
    return INITIAL_GOALS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('saveiq_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved user:', e);
    }
    return INITIAL_USER;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('saveiq_notifs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved notifications:', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Current view state - Default to public website
  const [currentView, setCurrentView] = useState<
    'landing' | 'dashboard' | 'goals' | 'ai-insights' | 'notifications' | 'sheets' | 'settings'
  >('landing');

  // Modals state
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedGoalForDetails, setSelectedGoalForDetails] = useState<Goal | null>(null);
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState<Goal | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('saveiq_goals', JSON.stringify(goals));
    } catch (e) {
      console.error(e);
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem('saveiq_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('saveiq_notifs', JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  // Dark mode class sync
  useEffect(() => {
    if (user.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user.theme]);

  // Keep details modal synchronized if goals update
  useEffect(() => {
    if (selectedGoalForDetails) {
      const updated = goals.find(g => g.id === selectedGoalForDetails.id);
      if (updated) {
        setSelectedGoalForDetails(updated);
      }
    }
  }, [goals]);

  // Handle Goal Creation
  const handleSaveGoal = (newGoal: Goal) => {
    setGoals(prev => [newGoal, ...prev]);

    // Create notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      goalId: newGoal.id,
      goalName: newGoal.name,
      type: 'system',
      title: 'New Goal Created',
      message: `You started tracking "${newGoal.name}" with a target of ${user.currencySymbol}${newGoal.targetAmount.toLocaleString()}.`,
      date: 'Just now',
      read: false,
      emailSent: newGoal.emailAlerts,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Handle Deposit
  const handleDeposit = (goalId: string, amount: number, note: string) => {
    setGoals(prev =>
      prev.map(goal => {
        if (goal.id !== goalId) return goal;

        const newSavings = goal.currentSavings + amount;
        const remainingAmount = Math.max(0, goal.targetAmount - newSavings);
        const progressPercentage = Math.min(100, Math.round((newSavings / goal.targetAmount) * 100));
        const status = calculateGoalStatus(goal.targetAmount, newSavings, goal.deadline);

        const newContribution = {
          id: `c-${Date.now()}`,
          amount,
          date: new Date().toISOString().split('T')[0],
          note,
        };

        // If goal just reached 100%, trigger completion alert
        if (newSavings >= goal.targetAmount && goal.currentSavings < goal.targetAmount) {
          const compNotif: AppNotification = {
            id: `notif-${Date.now()}`,
            goalId: goal.id,
            goalName: goal.name,
            type: 'goal_completed',
            title: 'Goal Completed! 🎉',
            message: `Congratulations! You reached 100% of your target for ${goal.name}.`,
            date: 'Just now',
            read: false,
            emailSent: goal.emailAlerts,
          };
          setNotifications(nPrev => [compNotif, ...nPrev]);
        }

        return {
          ...goal,
          currentSavings: newSavings,
          remainingAmount,
          progressPercentage,
          status,
          updatedAt: new Date().toISOString(),
          contributions: [newContribution, ...goal.contributions],
        };
      })
    );
  };

  // Handle Delete Goal
  const handleDeleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
    if (selectedGoalForDetails?.id === goalId) {
      setSelectedGoalForDetails(null);
    }
  };

  // Handle AI Insight Update
  const handleUpdateGoalAI = (goalId: string, insight: AIInsight) => {
    setGoals(prev =>
      prev.map(goal => {
        if (goal.id !== goalId) return goal;
        const currentInsights = goal.aiInsights || [];
        return {
          ...goal,
          aiInsights: [...currentInsights, insight],
        };
      })
    );

    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const aiNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        goalId: goal.id,
        goalName: goal.name,
        type: 'ai_insight',
        title: 'New AI Guidance Generated',
        message: `SaveIQ AI formulated new saving paces and habit recommendations for ${goal.name}.`,
        date: 'Just now',
        read: false,
        emailSent: false,
      };
      setNotifications(prev => [aiNotif, ...prev]);
    }
  };

  // Run Daily Audit (Simulates Google Apps Script Daily Cron - Section 26)
  const handleRunDailyAudit = async () => {
    setIsAuditing(true);

    try {
      // Call server backend if available
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goals }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.goals && Array.isArray(data.goals)) {
          setGoals(data.goals);
        }

        if (data.alerts && Array.isArray(data.alerts) && data.alerts.length > 0) {
          const generatedNotifs: AppNotification[] = data.alerts.map((a: any) => ({
            id: `notif-audit-${Date.now()}-${a.goalId}`,
            goalId: a.goalId,
            goalName: a.goalName,
            type: a.type,
            title: a.type === 'goal_overdue' 
              ? 'Goal Overdue ⚠️' 
              : a.type === 'goal_completed' 
              ? 'Goal Completed! 🎉' 
              : 'Goal Deadline Approaching ⏰',
            message: a.type === 'goal_overdue'
              ? `${a.goalName} deadline has passed with ${user.currencySymbol}${a.remainingAmount.toLocaleString()} remaining.`
              : a.type === 'goal_completed'
              ? `Milestone reached for ${a.goalName}!`
              : `${a.goalName} has ${a.daysRemaining} days remaining before deadline.`,
            date: 'Today (Apps Script Audit)',
            read: false,
            emailSent: true,
          }));

          setNotifications(prev => [...generatedNotifs, ...prev]);
        }
      } else {
        throw new Error('Server audit responded with non-200');
      }
    } catch (err) {
      // Client-side fallback audit
      const updated = goals.map(g => {
        const days = calculateDaysRemaining(g.deadline);
        const rem = Math.max(0, g.targetAmount - g.currentSavings);
        const pct = Math.min(100, Math.round((g.currentSavings / g.targetAmount) * 100));
        const status = calculateGoalStatus(g.targetAmount, g.currentSavings, g.deadline);
        return {
          ...g,
          daysRemaining: days,
          remainingAmount: rem,
          progressPercentage: pct,
          status,
          updatedAt: new Date().toISOString(),
        };
      });
      setGoals(updated);
    } finally {
      setIsAuditing(false);
    }
  };

  // Reset Demo Data
  const handleResetData = () => {
    if (window.confirm('Reset all goals and notifications to original demo data?')) {
      setGoals(INITIAL_GOALS);
      setUser(INITIAL_USER);
      setNotifications(INITIAL_NOTIFICATIONS);
      localStorage.removeItem('saveiq_goals');
      localStorage.removeItem('saveiq_user');
      localStorage.removeItem('saveiq_notifs');
    }
  };

  const isDark = user.theme === 'dark';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Universal Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        notifications={notifications}
        onCreateGoalClick={() => setIsCreateGoalOpen(true)}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          setCurrentView('landing');
        }}
        onToggleTheme={() => {
          setUser(prev => ({
            ...prev,
            theme: prev.theme === 'dark' ? 'light' : 'dark',
          }));
        }}
        isDark={isDark}
      />

      {/* Main Screen Content */}
      <main className="flex-1">
        {currentView === 'landing' ? (
          <LandingPage
            onGetStarted={() => setCurrentView('dashboard')}
            onLoginClick={() => setIsAuthModalOpen(true)}
            onQuickCreateGoal={(name, target, deadlineMonths) => {
              const futureDate = new Date();
              futureDate.setMonth(futureDate.getMonth() + deadlineMonths);
              const deadlineStr = futureDate.toISOString().split('T')[0];
              const newGoal: Goal = {
                id: `goal-${Date.now()}`,
                name,
                targetAmount: target,
                initialSavings: 0,
                currentSavings: 0,
                remainingAmount: target,
                deadline: deadlineStr,
                purpose: 'Electronics',
                emailAlerts: true,
                status: 'Active',
                progressPercentage: 0,
                daysRemaining: deadlineMonths * 30,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                contributions: [],
              };
              handleSaveGoal(newGoal);
              setCurrentView('dashboard');
            }}
            currencySymbol={user.currencySymbol}
            isDark={isDark}
          />
        ) : (
          <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Top switcher banner to return to Website */}
            <div className="mb-6 flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="font-semibold">SaveIQ Financial Dashboard</span>
                <span className="hidden sm:inline text-slate-400">·</span>
                <span className="hidden sm:inline text-slate-500 dark:text-slate-400">Simulating live savings tracker</span>
              </div>
              <button
                onClick={() => setCurrentView('landing')}
                className="font-semibold text-emerald-700 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-100 hover:underline flex items-center gap-1"
              >
                <span>← Back to SaveIQ Website</span>
              </button>
            </div>
            {currentView === 'dashboard' && (
              <Dashboard
                goals={goals}
                user={user}
                onCreateGoalClick={() => setIsCreateGoalOpen(true)}
                onViewDetails={(goal) => setSelectedGoalForDetails(goal)}
                onQuickDeposit={(goal) => setSelectedGoalForDeposit(goal)}
                onTriggerAI={(goal) => {
                  setSelectedGoalForDetails(goal);
                }}
                onRunAudit={handleRunDailyAudit}
                isAuditing={isAuditing}
                currencySymbol={user.currencySymbol}
                isDark={isDark}
              />
            )}

            {currentView === 'ai-insights' && (
              <AIInsightsView
                goals={goals}
                onUpdateGoalAI={handleUpdateGoalAI}
                onSelectGoal={(goalId) => {
                  const targetGoal = goals.find(g => g.id === goalId);
                  if (targetGoal) {
                    setSelectedGoalForDetails(targetGoal);
                  }
                }}
                currencySymbol={user.currencySymbol}
                groqApiKey={user.groqApiKey}
                isDark={isDark}
              />
            )}

            {currentView === 'notifications' && (
              <NotificationsView
                notifications={notifications}
                goals={goals}
                onMarkAllAsRead={() => {
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                }}
                onClearNotifications={() => {
                  setNotifications([]);
                }}
                onRunAudit={handleRunDailyAudit}
                onSelectGoal={(goalId) => {
                  const targetGoal = goals.find(g => g.id === goalId);
                  if (targetGoal) {
                    setSelectedGoalForDetails(targetGoal);
                  }
                }}
                isAuditing={isAuditing}
                currencySymbol={user.currencySymbol}
                userEmail={user.email}
                isDark={isDark}
              />
            )}

            {currentView === 'sheets' && (
              <GoogleSheetsView
                goals={goals}
                user={user}
                currencySymbol={user.currencySymbol}
                onRunAudit={handleRunDailyAudit}
                isAuditing={isAuditing}
                isDark={isDark}
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                user={user}
                onUpdateUser={(updated) => {
                  setUser(prev => ({ ...prev, ...updated }));
                }}
                onResetData={handleResetData}
                onLogout={() => {
                  setCurrentView('landing');
                }}
                isDark={isDark}
              />
            )}
          </div>
        )}
      </main>

      {/* Modals & Dialogs */}
      <CreateGoalModal
        isOpen={isCreateGoalOpen}
        onClose={() => setIsCreateGoalOpen(false)}
        onSave={handleSaveGoal}
        currencySymbol={user.currencySymbol}
        userEmail={user.email}
        isDark={isDark}
      />

      <DepositModal
        goal={selectedGoalForDeposit}
        isOpen={!!selectedGoalForDeposit}
        onClose={() => setSelectedGoalForDeposit(null)}
        onDeposit={handleDeposit}
        currencySymbol={user.currencySymbol}
        isDark={isDark}
      />

      <GoalDetailsModal
        goal={selectedGoalForDetails}
        isOpen={!!selectedGoalForDetails}
        onClose={() => setSelectedGoalForDetails(null)}
        onQuickDeposit={(goal) => setSelectedGoalForDeposit(goal)}
        onDeleteGoal={handleDeleteGoal}
        onUpdateGoalAI={handleUpdateGoalAI}
        currencySymbol={user.currencySymbol}
        groqApiKey={user.groqApiKey}
        isDark={isDark}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(updatedUser) => {
          setUser(prev => ({ ...prev, ...updatedUser }));
          setCurrentView('dashboard');
        }}
        isDark={isDark}
      />
    </div>
  );
}
