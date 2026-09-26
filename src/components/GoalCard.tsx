import React from 'react';
import { 
  Laptop, 
  ShieldCheck, 
  GraduationCap, 
  Plane, 
  HeartPulse, 
  User, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Plus 
} from 'lucide-react';
import { Goal, GoalPurpose } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface GoalCardProps {
  goal: Goal;
  currencySymbol?: string;
  isDark?: boolean;
  onViewDetails: (goal: Goal) => void;
  onQuickDeposit: (goal: Goal) => void;
  onTriggerAI: (goal: Goal) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  currencySymbol = '₹',
  isDark = false,
  onViewDetails,
  onQuickDeposit,
  onTriggerAI,
}) => {
  const getPurposeIcon = (purpose: GoalPurpose) => {
    switch (purpose) {
      case 'Electronics':
        return <Laptop className="w-4 h-4 text-slate-700 dark:text-slate-300" />;
      case 'Emergency':
        return <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Education':
        return <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'Travel':
        return <Plane className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
      case 'Health':
        return <HeartPulse className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'Personal':
        return <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Target className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (goal.status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'Approaching Deadline':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 px-2 py-0.5 rounded-md">
            <Clock className="w-3.5 h-3.5" />
            Approaching ({goal.daysRemaining}d left)
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 dark:bg-red-950/60 dark:text-red-300 px-2 py-0.5 rounded-md">
            <AlertTriangle className="w-3.5 h-3.5" />
            Overdue
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 dark:bg-slate-700/60 dark:text-slate-300 px-2 py-0.5 rounded-md">
            Active
          </span>
        );
    }
  };

  return (
    <div
      className={`group relative flex flex-col justify-between p-6 rounded-2xl border transition-all duration-200 hover:shadow-md ${
        goal.status === 'Overdue'
          ? isDark
            ? 'bg-slate-800/90 border-red-900/50 hover:border-red-700/60'
            : 'bg-white border-red-200 hover:border-red-300'
          : isDark
          ? 'bg-slate-800/90 border-slate-700/70 hover:border-slate-600'
          : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
      }`}
    >
      <div>
        {/* Header: Purpose & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDark ? 'bg-slate-700/70' : 'bg-slate-100'
            }`}>
              {getPurposeIcon(goal.purpose)}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {goal.purpose}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {goal.aiInsights && goal.aiInsights.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTriggerAI(goal);
                }}
                title="AI Guidance available - click to view"
                className="p-1 rounded-md text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            )}
            {getStatusBadge()}
          </div>
        </div>

        {/* Goal Title */}
        <h4 className={`text-base font-semibold tracking-tight ${
          isDark ? 'text-slate-100' : 'text-slate-900'
        }`}>
          {goal.name}
        </h4>

        {/* Primary Amount Display */}
        <div className="mt-2.5 flex items-baseline justify-between">
          <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {formatCurrency(goal.currentSavings, currencySymbol)}
            <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-1">
              / {formatCurrency(goal.targetAmount, currencySymbol)}
            </span>
          </span>
          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            {goal.progressPercentage}%
          </span>
        </div>

        {/* Emerald Progress Bar */}
        <div className={`w-full h-2 rounded-full mt-2.5 overflow-hidden ${
          isDark ? 'bg-slate-700' : 'bg-slate-100'
        }`}>
          <div
            style={{ width: `${goal.progressPercentage}%` }}
            className={`h-full rounded-full transition-all duration-500 ${
              goal.status === 'Overdue'
                ? 'bg-amber-500'
                : goal.progressPercentage >= 100
                ? 'bg-emerald-500'
                : 'bg-emerald-600'
            }`}
          />
        </div>

        {/* Clean Meta Details */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Remaining</span>
            <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              {goal.remainingAmount > 0 
                ? formatCurrency(goal.remainingAmount, currencySymbol) 
                : 'Fully funded'}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Deadline</span>
            <span className={`font-medium ${
              goal.status === 'Overdue' ? 'text-red-600 dark:text-red-400' : isDark ? 'text-slate-200' : 'text-slate-700'
            }`}>
              {formatDate(goal.deadline)}
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
        <button
          onClick={() => onQuickDeposit(goal)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            isDark 
              ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' 
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Plus className="w-3.5 h-3.5 text-emerald-600" />
          Add Money
        </button>

        <button
          onClick={() => onViewDetails(goal)}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
