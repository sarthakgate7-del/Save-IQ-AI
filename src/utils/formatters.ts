import { Goal, GoalStatus } from '../types';

export function calculateDaysRemaining(deadlineStr: string): number {
  if (!deadlineStr) return 0;
  const deadline = new Date(deadlineStr);
  // Compare with start of today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateGoalStatus(target: number, current: number, deadlineStr: string): GoalStatus {
  if (current >= target) {
    return 'Completed';
  }
  const days = calculateDaysRemaining(deadlineStr);
  if (days < 0) {
    return 'Overdue';
  }
  if (days <= 14) {
    return 'Approaching Deadline';
  }
  return 'Active';
}

export function formatCurrency(amount: number, symbol = '₹'): string {
  if (isNaN(amount)) return `${symbol}0`;
  return `${symbol}${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export function calculateMetrics(goals: Goal[]) {
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const overdueGoals = goals.filter(g => g.status === 'Overdue').length;
  const activeGoals = goals.filter(g => g.status === 'Active' || g.status === 'Approaching Deadline').length;

  const totalSaved = goals.reduce((acc, g) => acc + g.currentSavings, 0);
  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalRemaining = Math.max(0, totalTarget - totalSaved);
  const overallProgress = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  return {
    totalGoals,
    completedGoals,
    overdueGoals,
    activeGoals,
    totalSaved,
    totalTarget,
    totalRemaining,
    overallProgress,
  };
}
