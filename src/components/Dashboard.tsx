import React, { useState } from 'react';
import { 
  Target, 
  Wallet, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Search, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { Goal, UserProfile } from '../types';
import { calculateMetrics, formatCurrency } from '../utils/formatters';
import { GoalCard } from './GoalCard';
import { AnalyticsCharts } from './AnalyticsCharts';

interface DashboardProps {
  goals: Goal[];
  user: UserProfile;
  onCreateGoalClick: () => void;
  onViewDetails: (goal: Goal) => void;
  onQuickDeposit: (goal: Goal) => void;
  onTriggerAI: (goal: Goal) => void;
  onRunAudit: () => void;
  isAuditing?: boolean;
  currencySymbol?: string;
  isDark?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  goals,
  user,
  onCreateGoalClick,
  onViewDetails,
  onQuickDeposit,
  onTriggerAI,
  onRunAudit,
  isAuditing = false,
  currencySymbol = '₹',
  isDark = false,
}) => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Completed' | 'Overdue'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const metrics = calculateMetrics(goals);

  // Filtered goals
  const filteredGoals = goals.filter(g => {
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = g.name.toLowerCase().includes(q);
      const matchPurpose = g.purpose.toLowerCase().includes(q);
      if (!matchName && !matchPurpose) return false;
    }

    // Status filter
    if (filter === 'Active') {
      return g.status === 'Active' || g.status === 'Approaching Deadline';
    }
    if (filter === 'Completed') {
      return g.status === 'Completed';
    }
    if (filter === 'Overdue') {
      return g.status === 'Overdue';
    }
    return true;
  });

  // Check for overdue goals to display alert banner (Section 37)
  const firstOverdueGoal = goals.find(g => g.status === 'Overdue');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Header (Section 12) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-heading ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Good morning, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's how your savings are progressing today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRunAudit}
            disabled={isAuditing}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              isDark
                ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs'
            } ${isAuditing ? 'opacity-60 cursor-not-allowed' : ''}`}
            title="Simulate daily Google Apps Script audit and deadline checks"
          >
            <Play className={`w-3.5 h-3.5 text-emerald-600 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Auditing...' : 'Daily Audit'}</span>
          </button>

          <button
            onClick={onCreateGoalClick}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Goal</span>
          </button>
        </div>
      </div>

      {/* Overdue Alert Banner if present (Section 37) */}
      {firstOverdueGoal && (
        <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isDark 
            ? 'bg-red-950/20 border-red-900/40 text-red-200' 
            : 'bg-red-50/80 border-red-200 text-red-900'
        }`}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/80 flex items-center justify-center shrink-0 text-red-600 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold">Goal Needs Attention</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Your <span className="font-semibold text-slate-800 dark:text-white">{firstOverdueGoal.name}</span> deadline has passed and the target of {formatCurrency(firstOverdueGoal.targetAmount, currencySymbol)} has not yet been reached.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={() => onTriggerAI(firstOverdueGoal)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Get AI Insight
            </button>
            <button
              onClick={() => onViewDetails(firstOverdueGoal)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300 transition-colors"
            >
              Review Goal
            </button>
          </div>
        </div>
      )}

      {/* 2. 4 Dashboard Summary Cards (Section 13) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* TOTAL GOALS */}
        <div className={`p-6 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Goals
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-slate-700/70 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}>
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {metrics.totalGoals}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-normal">
            {metrics.completedGoals} completed
          </div>
        </div>

        {/* TOTAL SAVINGS */}
        <div className={`p-6 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Savings
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(metrics.totalSaved, currencySymbol)}
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">
            +8.4% this month
          </div>
        </div>

        {/* ACTIVE GOALS */}
        <div className={`p-6 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Goals
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-slate-700/70 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}>
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {metrics.activeGoals}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-normal">
            Currently in progress
          </div>
        </div>

        {/* OVERDUE GOALS (Red warning styling only for this card - Section 13) */}
        <div className={`p-6 rounded-2xl border transition-all ${
          metrics.overdueGoals > 0
            ? isDark
              ? 'bg-red-950/20 border-red-900/60'
              : 'bg-red-50/50 border-red-200'
            : isDark
            ? 'bg-slate-800/80 border-slate-700/80'
            : 'bg-white border-slate-100 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xs font-semibold uppercase tracking-wider ${
              metrics.overdueGoals > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-500'
            }`}>
              Overdue Goals
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              metrics.overdueGoals > 0
                ? 'bg-red-100 dark:bg-red-900/60 text-red-600 dark:text-red-300'
                : isDark ? 'bg-slate-700/70 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-3xl font-extrabold ${
            metrics.overdueGoals > 0 ? 'text-red-600 dark:text-red-400' : isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {metrics.overdueGoals}
          </div>
          <div className={`text-xs mt-1 ${
            metrics.overdueGoals > 0 ? 'text-red-600 dark:text-red-400 font-medium' : 'text-slate-500'
          }`}>
            {metrics.overdueGoals > 0 ? 'Needs attention' : 'All goals on track'}
          </div>
        </div>
      </div>

      {/* 3. Overall Savings Progress Card (Section 14) */}
      <div className={`p-6 sm:p-8 rounded-2xl border transition-all ${
        isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-100 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Overall Savings Progress
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Portfolio progress across all active and completed goals
            </p>
          </div>
          <div className="text-left sm:text-right">
            <span className={`text-xl sm:text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {formatCurrency(metrics.totalSaved, currencySymbol)}
              <span className="text-sm font-normal text-slate-400 ml-1.5">
                / {formatCurrency(metrics.totalTarget, currencySymbol)}
              </span>
            </span>
          </div>
        </div>

        {/* Smooth Emerald Progress Bar */}
        <div className={`w-full h-3 rounded-full overflow-hidden ${
          isDark ? 'bg-slate-700' : 'bg-slate-100'
        }`}>
          <div
            style={{ width: `${metrics.overallProgress}%` }}
            className="h-full bg-emerald-600 rounded-full transition-all duration-700"
          />
        </div>

        {/* Below progress details (Section 14) */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {metrics.overallProgress}% Completed
            </span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {formatCurrency(metrics.totalRemaining, currencySymbol)} remaining
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 italic">
            You're making steady progress toward your goals.
          </p>
        </div>
      </div>

      {/* 4. Analytics Section (Section 29) */}
      <AnalyticsCharts
        goals={goals}
        currencySymbol={currencySymbol}
        isDark={isDark}
      />

      {/* 5. Savings Goals Section (Section 15) */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Your Savings Goals
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click any goal to view deposit breakdown, pacing, and AI recommendations.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search goals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full sm:w-48 pl-8 pr-3 py-2 rounded-xl border text-xs focus:outline-hidden ${
                  isDark
                    ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500'
                    : 'border-slate-200 bg-white text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Filter Buttons */}
            <div className={`flex items-center p-1 rounded-xl border ${
              isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-100'
            }`}>
              {(['All', 'Active', 'Completed', 'Overdue'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === tab
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isDark
                      ? 'text-slate-400 hover:text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Goals Grid or Empty State (Section 35) */}
        {filteredGoals.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border ${
            isDark ? 'border-slate-800 bg-slate-800/40' : 'border-slate-200 bg-white'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 mx-auto mb-3">
              <Target className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Start Your First Savings Goal
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-5">
              {searchQuery
                ? `No goals matched "${searchQuery}". Clear your search or create a new goal.`
                : "You haven't created any savings goals yet. Create your first goal and start tracking your progress."}
            </p>
            <button
              onClick={onCreateGoalClick}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              + Create Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                currencySymbol={currencySymbol}
                isDark={isDark}
                onViewDetails={onViewDetails}
                onQuickDeposit={onQuickDeposit}
                onTriggerAI={onTriggerAI}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
