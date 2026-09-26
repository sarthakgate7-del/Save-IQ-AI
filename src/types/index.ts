export type GoalPurpose = 
  | 'Emergency'
  | 'Education'
  | 'Electronics'
  | 'Travel'
  | 'Health'
  | 'Personal'
  | 'Other';

export type GoalStatus = 'Active' | 'Completed' | 'Approaching Deadline' | 'Overdue';

export interface Contribution {
  id: string;
  amount: number;
  date: string;
  note: string;
}

export interface AIInsight {
  id: string;
  date: string;
  provider: string;
  summary: string;
  suggestedPace: string;
  actionableTip: string;
  riskAssessment: string;
  encouragement: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  initialSavings: number;
  currentSavings: number;
  remainingAmount: number;
  deadline: string; // YYYY-MM-DD
  purpose: GoalPurpose;
  emailAlerts: boolean;
  status: GoalStatus;
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
  daysRemaining: number;
  lastReminderSent?: string;
  contributions: Contribution[];
  aiInsights?: AIInsight[];
}

export type NotificationType = 
  | 'deadline_approaching' 
  | 'goal_completed' 
  | 'goal_overdue' 
  | 'ai_insight' 
  | 'system';

export interface AppNotification {
  id: string;
  goalId?: string;
  goalName: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  emailSent?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  currency: string;
  currencySymbol: string;
  emailAlertsEnabled: boolean;
  deadlineRemindersEnabled: boolean;
  completionAlertsEnabled: boolean;
  aiInsightsEnabled: boolean;
  theme: 'light' | 'dark';
  groqApiKey?: string;
  googleSheetsUrl?: string;
}
