import React, { useState } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  TrendingUp, 
  Target, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Calendar,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { Goal, AIInsight } from '../types';
import { formatCurrency } from '../utils/formatters';
import { fetchAIInsight } from '../utils/aiService';

interface AIInsightsViewProps {
  goals: Goal[];
  onUpdateGoalAI: (goalId: string, insight: AIInsight) => void;
  onSelectGoal: (goalId: string) => void;
  currencySymbol?: string;
  groqApiKey?: string;
  isDark?: boolean;
}

export const AIInsightsView: React.FC<AIInsightsViewProps> = ({
  goals,
  onUpdateGoalAI,
  onSelectGoal,
  currencySymbol = '₹',
  groqApiKey,
  isDark = false,
}) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string>(goals[0]?.id || '');
  const [loading, setLoading] = useState(false);

  const selectedGoal = goals.find(g => g.id === selectedGoalId) || goals[0];

  const handleGenerate = async () => {
    if (!selectedGoal) return;
    setLoading(true);
    try {
      const insight = await fetchAIInsight(selectedGoal, currencySymbol, groqApiKey);
      onUpdateGoalAI(selectedGoal.id, insight);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const latestInsight = selectedGoal?.aiInsights && selectedGoal.aiInsights.length > 0
    ? selectedGoal.aiInsights[selectedGoal.aiInsights.length - 1]
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              AI Financial Insights
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Personalized guidance and discipline pacing powered by SaveIQ's intelligence engine.
          </p>
        </div>

        {selectedGoal && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-xs ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Analyzing your savings goal...' : latestInsight ? 'Regenerate Insight' : 'Generate New Insight'}
          </button>
        )}
      </div>

      {/* Goal Selector Tabs */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Select Goal to Analyze
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {goals.map((g) => {
            const isSelected = g.id === selectedGoalId;
            return (
              <button
                key={g.id}
                onClick={() => setSelectedGoalId(g.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {g.name} ({g.progressPercentage}%)
              </button>
            );
          })}
        </div>
      </div>

      {selectedGoal ? (
        <div className="space-y-6">
          {/* Main AI Card */}
          <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
            isDark ? 'bg-slate-800/90 border-indigo-900/60 shadow-lg' : 'bg-white border-indigo-100 shadow-sm'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-indigo-100/60 dark:border-indigo-900/40">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {selectedGoal.name} Analysis
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {latestInsight?.provider || 'SaveIQ Intelligence Engine'}
              </span>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 mb-3 animate-pulse">
                  <Sparkles className="w-6 h-6 animate-spin" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Analyzing your savings goal...
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Evaluating remaining amount, timeline deadline, and daily velocity...
                </p>
              </div>
            ) : latestInsight ? (
              <div className="mt-5 space-y-6">
                {/* Executive Summary */}
                <div className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  {latestInsight.summary}
                </div>

                {/* 4 Analytics Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className={`p-3.5 rounded-xl border text-xs ${
                    isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <span className="text-slate-400 block text-[11px]">Progress</span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      {selectedGoal.progressPercentage}%
                    </span>
                  </div>

                  <div className={`p-3.5 rounded-xl border text-xs ${
                    isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <span className="text-slate-400 block text-[11px]">Remaining</span>
                    <span className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">
                      {formatCurrency(selectedGoal.remainingAmount, currencySymbol)}
                    </span>
                  </div>

                  <div className={`p-3.5 rounded-xl border text-xs ${
                    isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <span className="text-slate-400 block text-[11px]">Days Remaining</span>
                    <span className={`text-base font-bold mt-0.5 block ${
                      selectedGoal.daysRemaining < 0 ? 'text-red-500' : 'text-slate-900 dark:text-slate-100'
                    }`}>
                      {selectedGoal.daysRemaining < 0 ? `${Math.abs(selectedGoal.daysRemaining)}d overdue` : `${selectedGoal.daysRemaining} days`}
                    </span>
                  </div>

                  <div className={`p-3.5 rounded-xl border text-xs ${
                    isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <span className="text-slate-400 block text-[11px]">Suggested Pace</span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block truncate">
                      {latestInsight.suggestedPace.split('(')[0]}
                    </span>
                  </div>
                </div>

                {/* Practical Guidance & Actionable Advice */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl border ${
                    isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-emerald-50/40 border-emerald-100'
                  }`}>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-1">
                      <Lightbulb className="w-4 h-4 text-emerald-600" />
                      Suggested Actionable Habit
                    </div>
                    <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      {latestInsight.actionableTip}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border ${
                    isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-indigo-50/40 border-indigo-100'
                  }`}>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-800 dark:text-indigo-300 mb-1">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      Pacing Schedule & Risk State
                    </div>
                    <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      Status: <span className="font-semibold">{latestInsight.riskAssessment}</span>. 
                      Pacing: {latestInsight.suggestedPace}.
                    </p>
                  </div>
                </div>

                {latestInsight.encouragement && (
                  <div className={`p-4 rounded-xl border-l-4 border-indigo-500 ${
                    isDark ? 'bg-slate-900/40 text-slate-300' : 'bg-slate-50 text-slate-700'
                  } text-xs italic`}>
                    "{latestInsight.encouragement}"
                  </div>
                )}

                {/* AI Disclaimer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
                  <p className="text-[11px] text-slate-400">
                    AI-generated guidance is for informational purposes and should not be considered professional financial advice.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-xs text-slate-500 mb-3">
                  No analysis generated yet for this goal.
                </p>
                <button
                  onClick={handleGenerate}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <Sparkles className="w-4 h-4" />
                  Analyze Goal with AI
                </button>
              </div>
            )}
          </div>

          {/* Quick jump to goal details */}
          <div className="flex justify-end">
            <button
              onClick={() => onSelectGoal(selectedGoal.id)}
              className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Open {selectedGoal.name} Goal Details
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
