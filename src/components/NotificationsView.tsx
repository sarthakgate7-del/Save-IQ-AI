import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Play, 
  Mail, 
  Trash2, 
  CheckCheck,
  ArrowRight
} from 'lucide-react';
import { AppNotification, Goal } from '../types';
import { EmailPreviewModal } from './EmailPreviewModal';

interface NotificationsViewProps {
  notifications: AppNotification[];
  goals: Goal[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
  onRunAudit: () => void;
  onSelectGoal: (goalId: string) => void;
  isAuditing?: boolean;
  currencySymbol?: string;
  userEmail?: string;
  isDark?: boolean;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  goals,
  onMarkAllAsRead,
  onClearNotifications,
  onRunAudit,
  onSelectGoal,
  isAuditing = false,
  currencySymbol = '₹',
  userEmail = 'harshharade007@gmail.com',
  isDark = false,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'email'>('all');
  const [previewNotification, setPreviewNotification] = useState<AppNotification | null>(null);

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'email') return n.emailSent;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'goal_completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'deadline_approaching':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'goal_overdue':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'ai_insight':
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const selectedGoalForEmail = previewNotification && previewNotification.goalId 
    ? goals.find(g => g.id === previewNotification.goalId) 
    : undefined;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Daily Audit Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated alerts triggered by your daily savings audit & Apps Script scheduler.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onRunAudit}
            disabled={isAuditing}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs ${
              isAuditing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Running Daily Audit...' : 'Run Daily Audit'}
          </button>

          {notifications.length > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className={`p-2 rounded-xl border text-xs font-medium transition-colors ${
                isDark 
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={onClearNotifications}
              className={`p-2 rounded-xl border text-xs font-medium text-red-500 transition-colors ${
                isDark 
                  ? 'border-slate-700 hover:bg-slate-800' 
                  : 'border-slate-200 hover:bg-slate-100'
              }`}
              title="Clear all notifications"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filter === 'all'
              ? 'bg-emerald-600 text-white shadow-xs'
              : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filter === 'unread'
              ? 'bg-emerald-600 text-white shadow-xs'
              : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('email')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filter === 'email'
              ? 'bg-emerald-600 text-white shadow-xs'
              : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          Email Reminders ({notifications.filter(n => n.emailSent).length})
        </button>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${
          isDark ? 'border-slate-800 bg-slate-800/30 text-slate-400' : 'border-slate-200 bg-slate-50/50 text-slate-500'
        }`}>
          <Bell className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">No notifications here</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Run the daily audit or continue tracking goals to receive timely deadline notices and milestones.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !item.read
                  ? isDark
                    ? 'bg-slate-800/90 border-slate-700 shadow-sm'
                    : 'bg-white border-slate-200 shadow-xs ring-1 ring-emerald-500/10'
                  : isDark
                  ? 'bg-slate-800/40 border-slate-800/80 text-slate-400'
                  : 'bg-slate-50/70 border-slate-100 text-slate-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === 'goal_completed'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60'
                    : item.type === 'goal_overdue'
                    ? 'bg-red-50 dark:bg-red-950/60'
                    : item.type === 'deadline_approaching'
                    ? 'bg-amber-50 dark:bg-amber-950/60'
                    : 'bg-indigo-50 dark:bg-indigo-950/60'
                }`}>
                  {getIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-bold ${
                      !item.read 
                        ? isDark ? 'text-white' : 'text-slate-900' 
                        : isDark ? 'text-slate-300' : 'text-slate-700'
                    }`}>
                      {item.title}
                    </h4>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {item.goalName}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                    <span>{item.date}</span>
                    {item.emailSent && (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Mail className="w-3 h-3" />
                        Email reminder sent
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                {item.emailSent && (
                  <button
                    onClick={() => setPreviewNotification(item)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      isDark
                        ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    Preview Email
                  </button>
                )}

                {item.goalId && (
                  <button
                    onClick={() => onSelectGoal(item.goalId!)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                  >
                    View Goal
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Email Preview Modal */}
      <EmailPreviewModal
        notification={previewNotification}
        goal={selectedGoalForEmail}
        isOpen={!!previewNotification}
        onClose={() => setPreviewNotification(null)}
        currencySymbol={currencySymbol}
        recipientEmail={userEmail}
        isDark={isDark}
      />
    </div>
  );
};
