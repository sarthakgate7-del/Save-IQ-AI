import { Goal, AppNotification, UserProfile } from '../types';
import { calculateDaysRemaining, calculateGoalStatus } from '../utils/formatters';

export const INITIAL_USER: UserProfile = {
  name: 'Harsh Harade',
  email: 'harshharade007@gmail.com',
  currency: 'INR',
  currencySymbol: '₹',
  emailAlertsEnabled: true,
  deadlineRemindersEnabled: true,
  completionAlertsEnabled: true,
  aiInsightsEnabled: true,
  theme: 'light',
  googleSheetsUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit',
};

const rawGoals: Array<Omit<Goal, 'daysRemaining' | 'remainingAmount' | 'progressPercentage' | 'status'>> = [
  {
    id: 'goal-1',
    name: 'Laptop Purchase',
    targetAmount: 60000,
    initialSavings: 15000,
    currentSavings: 35000,
    deadline: '2026-12-15',
    purpose: 'Electronics',
    emailAlerts: true,
    createdAt: '2026-07-01T10:00:00.000Z',
    updatedAt: '2026-09-24T14:30:00.000Z',
    contributions: [
      { id: 'c-1', amount: 15000, date: '2026-07-01', note: 'Initial deposit' },
      { id: 'c-2', amount: 10000, date: '2026-08-01', note: 'July monthly savings' },
      { id: 'c-3', amount: 10000, date: '2026-09-01', note: 'August salary allocation' },
    ],
    aiInsights: [
      {
        id: 'ai-1',
        date: '2026-09-24T14:30:00.000Z',
        provider: 'SaveIQ AI',
        summary: "You are 58% of the way toward your laptop goal. You're making solid headway with ₹25,000 remaining.",
        suggestedPace: 'Approximately ₹313/day (₹2,190/week)',
        actionableTip: 'Saving ₹500 more per week could help you reach your laptop target 2 weeks ahead of the December deadline.',
        riskAssessment: 'Steady Progress',
        encouragement: 'Consistent weekly deposits are compounding quickly. Stay focused on your tech upgrade!',
      },
    ],
  },
  {
    id: 'goal-2',
    name: 'Emergency Fund',
    targetAmount: 50000,
    initialSavings: 20000,
    currentSavings: 50000,
    deadline: '2026-11-01',
    purpose: 'Emergency',
    emailAlerts: true,
    createdAt: '2026-04-10T08:00:00.000Z',
    updatedAt: '2026-09-20T11:00:00.000Z',
    contributions: [
      { id: 'c-4', amount: 20000, date: '2026-04-10', note: 'Initial safety buffer' },
      { id: 'c-5', amount: 15000, date: '2026-06-15', note: 'Bonus contribution' },
      { id: 'c-6', amount: 15000, date: '2026-09-20', note: 'Final milestone reached!' },
    ],
    aiInsights: [
      {
        id: 'ai-2',
        date: '2026-09-20T11:00:00.000Z',
        provider: 'SaveIQ AI',
        summary: 'Target achieved! Your full 3-month emergency safety cushion is completely secured.',
        suggestedPace: 'Goal Completed',
        actionableTip: 'Keep these funds parked in a liquid sweep-in bank account to generate 6-7% interest with zero penalty on instant withdrawals.',
        riskAssessment: 'Goal Completed',
        encouragement: 'Phenomenal financial discipline. Having an emergency reserve gives you true peace of mind.',
      },
    ],
  },
  {
    id: 'goal-3',
    name: 'Cloud Certification Exam',
    targetAmount: 15000,
    initialSavings: 5000,
    currentSavings: 15000,
    deadline: '2026-08-30',
    purpose: 'Education',
    emailAlerts: true,
    createdAt: '2026-05-01T09:00:00.000Z',
    updatedAt: '2026-08-25T16:00:00.000Z',
    contributions: [
      { id: 'c-7', amount: 5000, date: '2026-05-01', note: 'Course prep deposit' },
      { id: 'c-8', amount: 10000, date: '2026-08-25', note: 'Exam voucher fee collected' },
    ],
  },
  {
    id: 'goal-4',
    name: 'Vacation Plan',
    targetAmount: 40000,
    initialSavings: 5000,
    currentSavings: 18000,
    deadline: '2026-09-15', // Past date -> Overdue
    purpose: 'Travel',
    emailAlerts: true,
    createdAt: '2026-06-01T12:00:00.000Z',
    updatedAt: '2026-09-16T09:00:00.000Z',
    contributions: [
      { id: 'c-9', amount: 5000, date: '2026-06-01', note: 'Trip seed money' },
      { id: 'c-10', amount: 13000, date: '2026-08-10', note: 'Hotel booking allocation' },
    ],
    aiInsights: [
      {
        id: 'ai-3',
        date: '2026-09-16T09:00:00.000Z',
        provider: 'SaveIQ AI',
        summary: 'Your Vacation Plan deadline passed on 15 Sep with ₹22,000 remaining to reach the full target.',
        suggestedPace: 'Extend deadline by 45 days to save ₹488/day',
        actionableTip: 'Review trip dates for off-peak alternatives or adjust non-essential itinerary costs to match your current ₹18,000 budget.',
        riskAssessment: 'Overdue - Needs Revision',
        encouragement: 'No worries—deadlines can be rescheduled. Calibrating your timeline is part of healthy budgeting.',
      },
    ],
  },
  {
    id: 'goal-5',
    name: 'Health & Wellness Buffer',
    targetAmount: 20000,
    initialSavings: 4000,
    currentSavings: 14000,
    deadline: '2026-10-05', // ~9 days away -> Approaching Deadline
    purpose: 'Health',
    emailAlerts: true,
    createdAt: '2026-07-15T10:00:00.000Z',
    updatedAt: '2026-09-22T17:00:00.000Z',
    contributions: [
      { id: 'c-11', amount: 4000, date: '2026-07-15', note: 'Annual checkup fund' },
      { id: 'c-12', amount: 10000, date: '2026-09-22', note: 'Dental plan allocation' },
    ],
  },
  {
    id: 'goal-6',
    name: 'Home Office Ergonomic Setup',
    targetAmount: 25000,
    initialSavings: 2500,
    currentSavings: 10500,
    deadline: '2027-02-28',
    purpose: 'Personal',
    emailAlerts: true,
    createdAt: '2026-08-01T11:00:00.000Z',
    updatedAt: '2026-09-25T10:00:00.000Z',
    contributions: [
      { id: 'c-13', amount: 2500, date: '2026-08-01', note: 'Ergo chair research deposit' },
      { id: 'c-14', amount: 8000, date: '2026-09-25', note: 'Monitor arm + desk fund' },
    ],
  },
];

export const INITIAL_GOALS: Goal[] = rawGoals.map(g => {
  const daysRemaining = calculateDaysRemaining(g.deadline);
  const remainingAmount = Math.max(0, g.targetAmount - g.currentSavings);
  const progressPercentage = Math.min(100, Math.round((g.currentSavings / g.targetAmount) * 100));
  const status = calculateGoalStatus(g.targetAmount, g.currentSavings, g.deadline);

  return {
    ...g,
    daysRemaining,
    remainingAmount,
    progressPercentage,
    status,
  };
});

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    goalId: 'goal-4',
    goalName: 'Vacation Plan',
    type: 'goal_overdue',
    title: 'Goal Overdue',
    message: 'Vacation Plan has passed its deadline (15 Sep 2026) with ₹22,000 remaining. Review your timeline or update target.',
    date: '1 day ago',
    read: false,
    emailSent: true,
  },
  {
    id: 'notif-2',
    goalId: 'goal-5',
    goalName: 'Health & Wellness Buffer',
    type: 'deadline_approaching',
    title: 'Goal Deadline Approaching',
    message: 'Health & Wellness Buffer deadline is approaching in 9 days. You are 70% complete with ₹6,000 remaining.',
    date: '2 days ago',
    read: false,
    emailSent: true,
  },
  {
    id: 'notif-3',
    goalId: 'goal-2',
    goalName: 'Emergency Fund',
    type: 'goal_completed',
    title: 'Goal Completed! 🎉',
    message: 'Congratulations! You reached your ₹50,000 Emergency Fund target.',
    date: '5 days ago',
    read: true,
    emailSent: true,
  },
  {
    id: 'notif-4',
    goalId: 'goal-1',
    goalName: 'Laptop Purchase',
    type: 'ai_insight',
    title: 'New AI Insight Available',
    message: 'SaveIQ AI analyzed your saving velocity for Laptop Purchase: saving ₹500 more per week will hit target early.',
    date: '6 days ago',
    read: true,
    emailSent: false,
  },
];
