import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  RefreshCw,
  TrendingUp,
  History,
  Target
} from 'lucide-react';
import { Goal, AIInsight } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { fetchAIInsight } from '../utils/aiService';

interface GoalDetailsModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onQuickDeposit: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
  onUpdateGoalAI: (goalId: string, insight: AIInsight) => void;
  currencySymbol?: string;
  groqApiKey?: string;
  isDark?: boolean;
}

export const GoalDetailsModal: React.FC<GoalDetailsModalProps> = ({
  goal,
  isOpen,
  onClose,
  onQuickDeposit,
  onDeleteGoal,
  onUpdateGoalAI,
  currencySymbol = '₹',
  groqApiKey,
  isDark = false,
}) => {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!isOpen || !goal) return null;

  const latestInsight = goal.aiInsights && goal.aiInsights.length > 0 
    ? goal.aiInsights[goal.aiInsights.length - 1] 
    : null;

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    try {
      const insight = await fetchAIInsight(goal, currencySymbol, groqApiKey);
      onUpdateGoalAI(goal.id, insight);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Circular progress calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (goal.progressPercentage / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6 md:p-8 shadow-2xl transition-all ${
          isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {goal.purpose}
              </span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                goal.status === 'Completed'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : goal.status === 'Overdue'
                  ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                  : goal.status === 'Approaching Deadline'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
              }`}>
                {goal.status}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{goal.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Circular Progress & Stat Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6 items-center">
          {/* Circular Indicator */}
          <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 130 130">
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  stroke={isDark ? '#334155' : '#f1f5f9'}
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="65"
                  cy="65"
                  r={radius}
                  stroke="#16A34A"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  {goal.progressPercentage}%
                </span>
                <span className="text-[11px] font-medium text-slate-400">Complete</span>
              </div>
            </div>
          </div>

          {/* Core Metrics */}
          <div className="sm:col-span-2 grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
              <span className="text-xs text-slate-400 block">Total Saved</span>
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                {formatCurrency(goal.currentSavings, currencySymbol)}
              </span>
              <span className="text-[11px] text-slate-500">
                Target: {formatCurrency(goal.targetAmount, currencySymbol)}
              </span>
            </div>

            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
              <span className="text-xs text-slate-400 block">Remaining Amount</span>
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 block">
                {formatCurrency(goal.remainingAmount, currencySymbol)}
              </span>
              <span className="text-[11px] text-slate-500">
                {goal.remainingAmount <= 0 ? 'Goal reached!' : 'Needed to finish'}
              </span>
            </div>

            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
              <span className="text-xs text-slate-400 block">Target Deadline</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 block">
                {formatDate(goal.deadline)}
              </span>
              <span className={`text-[11px] font-medium ${
                goal.daysRemaining < 0 ? 'text-red-500' : goal.daysRemaining <= 14 ? 'text-amber-500' : 'text-slate-500'
              }`}>
                {goal.daysRemaining < 0 
                  ? `${Math.abs(goal.daysRemaining)} days overdue` 
                  : `${goal.daysRemaining} days remaining`}
              </span>
            </div>

            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
              <span className="text-xs text-slate-400 block">Suggested Pace</span>
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1 block">
                {goal.remainingAmount <= 0 
                  ? 'Completed' 
                  : goal.daysRemaining > 0 
                  ? `${formatCurrency(Math.ceil(goal.remainingAmount / goal.daysRemaining), currencySymbol)}/day`
                  : 'Needs re-schedule'}
              </span>
              <span className="text-[11px] text-slate-500">
                {goal.daysRemaining > 0 ? `~${formatCurrency(Math.ceil((goal.remainingAmount / goal.daysRemaining) * 7), currencySymbol)}/week` : 'Review timeline'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Deposit & Actions Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 my-4">
          <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Ready to boost this goal? Add your latest savings instantly.</span>
          </div>
          <button
            onClick={() => onQuickDeposit(goal)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Savings Deposit
          </button>
        </div>

        {/* AI Financial Insights Section */}
        <div className={`my-6 p-6 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-900/60 border-indigo-900/50' : 'bg-indigo-50/40 border-indigo-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  SaveIQ AI Insight
                </h3>
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  {latestInsight?.provider || 'AI Financial Coach'}
                </span>
              </div>
            </div>

            <button
              onClick={handleGenerateAI}
              disabled={isGeneratingAI}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isGeneratingAI
                  ? 'opacity-60 cursor-not-allowed bg-indigo-100 text-indigo-700'
                  : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-slate-700'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              {isGeneratingAI ? 'Analyzing...' : latestInsight ? 'Regenerate Insight' : 'Generate New Insight'}
            </button>
          </div>

          {/* AI Content */}
          {isGeneratingAI ? (
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <Sparkles className="w-8 h-8 text-indigo-500 animate-pulse mb-2" />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Analyzing your savings pace, goal velocity, and deadline proximity...
              </p>
            </div>
          ) : latestInsight ? (
            <div className="space-y-3">
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                {latestInsight.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className={`p-3 rounded-xl border text-xs ${
                  isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-indigo-100/80'
                }`}>
                  <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                    Suggested Saving Pace
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    {latestInsight.suggestedPace}
                  </p>
                </div>

                <div className={`p-3 rounded-xl border text-xs ${
                  isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-indigo-100/80'
                }`}>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                    Actionable Habit Tip
                  </span>
                  <p className="text-slate-800 dark:text-slate-200">
                    {latestInsight.actionableTip}
                  </p>
                </div>
              </div>

              {latestInsight.encouragement && (
                <p className="text-xs italic text-slate-500 dark:text-slate-400 pt-1">
                  "{latestInsight.encouragement}"
                </p>
              )}
            </div>
          ) : (
            <div className="py-3 text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Get tailored pacing suggestions and behavioral habit recommendations.
              </p>
              <button
                onClick={handleGenerateAI}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Generate AI Insight
              </button>
            </div>
          )}

          {/* AI Disclaimer */}
          <div className="mt-4 pt-3 border-t border-indigo-100/60 dark:border-indigo-900/40">
            <p className="text-[10px] text-slate-400 leading-normal">
              AI-generated guidance is for informational purposes and should not be considered professional financial advice.
            </p>
          </div>
        </div>

        {/* Deposit Contribution History */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-400" />
              Contribution History ({goal.contributions.length})
            </h4>
          </div>

          {goal.contributions.length === 0 ? (
            <div className={`p-4 rounded-xl text-center text-xs text-slate-400 border ${
              isDark ? 'border-slate-700' : 'border-slate-100'
            }`}>
              No deposits recorded yet. Click "Add Savings Deposit" above.
            </div>
          ) : (
            <div className={`divide-y rounded-xl border overflow-hidden ${
              isDark ? 'divide-slate-700 border-slate-700' : 'divide-slate-100 border-slate-100'
            }`}>
              {goal.contributions.map((c) => (
                <div key={c.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                      {c.note || 'Savings Deposit'}
                    </span>
                    <span className="text-[11px] text-slate-400">{formatDate(c.date)}</span>
                  </div>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    +{formatCurrency(c.amount, currencySymbol)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Delete / Close */}
        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          {showConfirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-500 font-medium">Delete this goal?</span>
              <button
                onClick={() => {
                  onDeleteGoal(goal.id);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Goal
            </button>
          )}

          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
