import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Code, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  RefreshCw, 
  Play, 
  Database 
} from 'lucide-react';
import { Goal, UserProfile } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface GoogleSheetsViewProps {
  goals: Goal[];
  user: UserProfile;
  currencySymbol?: string;
  onRunAudit: () => void;
  isAuditing?: boolean;
  isDark?: boolean;
}

export const GoogleSheetsView: React.FC<GoogleSheetsViewProps> = ({
  goals,
  user,
  currencySymbol = '₹',
  onRunAudit,
  isAuditing = false,
  isDark = false,
}) => {
  const [activeTab, setActiveTab] = useState<'sheet' | 'script'>('sheet');
  const [copied, setCopied] = useState(false);

  const appsScriptCode = `/**
 * SaveIQ – Google Apps Script Daily Goal Audit & Email Reminders
 * Triggers every morning at 08:00 AM to check deadlines and send automated alerts.
 */

function runDailySavingsAudit() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Goals");
  if (!sheet) return;
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const now = new Date();
  
  // Headers index
  const GOAL_ID_IDX = 0;
  const USER_NAME_IDX = 1;
  const EMAIL_IDX = 2;
  const GOAL_NAME_IDX = 3;
  const TARGET_IDX = 4;
  const CURRENT_IDX = 6;
  const DEADLINE_IDX = 8;
  const STATUS_IDX = 10;
  const EMAIL_ALERTS_IDX = 12;
  const LAST_REMINDER_IDX = 13;
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const goalName = row[GOAL_NAME_IDX];
    const targetAmount = Number(row[TARGET_IDX]);
    const currentSavings = Number(row[CURRENT_IDX]);
    const deadline = new Date(row[DEADLINE_IDX]);
    const emailAlerts = row[EMAIL_ALERTS_IDX];
    const userEmail = row[EMAIL_IDX];
    const userName = row[USER_NAME_IDX];
    
    const remainingAmount = Math.max(0, targetAmount - currentSavings);
    const progressPct = Math.round((currentSavings / targetAmount) * 100);
    const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    // Check alert conditions
    if (emailAlerts && userEmail) {
      if (currentSavings >= targetAmount) {
        sendEmailAlert(userEmail, userName, goalName, "Goal Completed! 🎉", 
          \`Congratulations! You have reached 100% of your target for \${goalName}.\`);
        sheet.getRange(i + 1, STATUS_IDX + 1).setValue("Completed");
      } else if (diffDays < 0) {
        sendEmailAlert(userEmail, userName, goalName, "Goal Overdue ⚠️", 
          \`Your deadline for \${goalName} passed \${Math.abs(diffDays)} days ago with \${remainingAmount} remaining.\`);
        sheet.getRange(i + 1, STATUS_IDX + 1).setValue("Overdue");
      } else if (diffDays <= 7) {
        sendEmailAlert(userEmail, userName, goalName, "Goal Deadline Approaching ⏰", 
          \`You have \${diffDays} days left to save \${remainingAmount} for \${goalName}.\`);
        sheet.getRange(i + 1, STATUS_IDX + 1).setValue("Approaching Deadline");
      }
      sheet.getRange(i + 1, LAST_REMINDER_IDX + 1).setValue(now.toISOString());
    }
  }
}

function sendEmailAlert(toEmail, userName, goalName, subject, bodyMessage) {
  MailApp.sendEmail({
    to: toEmail,
    subject: \`SaveIQ Alert: \${subject} - \${goalName}\`,
    htmlBody: \`
      <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #16A34A; margin-top: 0;">SaveIQ Savings Tracker</h2>
        <p>Hi \${userName},</p>
        <p>\${bodyMessage}</p>
        <p style="margin-top: 24px;">
          <a href="https://saveiq.app" style="background: #16A34A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Open SaveIQ Dashboard
          </a>
        </p>
      </div>\`
  });
}`;

  const copyScript = () => {
    navigator.clipboard.writeText(appsScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCSV = () => {
    const headers = [
      'Goal ID',
      'User Name',
      'Email',
      'Goal Name',
      'Target Amount',
      'Initial Savings',
      'Current Savings',
      'Remaining Amount',
      'Deadline',
      'Purpose',
      'Status',
      'Progress Percentage',
      'Email Alerts',
      'Last Reminder Sent',
      'Created Date',
      'Updated Date',
    ];

    const rows = goals.map(g => [
      g.id,
      user.name,
      user.email,
      `"${g.name.replace(/"/g, '""')}"`,
      g.targetAmount,
      g.initialSavings,
      g.currentSavings,
      g.remainingAmount,
      g.deadline,
      g.purpose,
      g.status,
      `${g.progressPercentage}%`,
      g.emailAlerts ? 'TRUE' : 'FALSE',
      g.lastReminderSent || new Date().toISOString().split('T')[0],
      g.createdAt.split('T')[0],
      g.updatedAt.split('T')[0],
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SaveIQ_Goals_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Google Sheets & Automation
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Backend data structure and automated Google Apps Script cron triggers for daily audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRunAudit}
            disabled={isAuditing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Play className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            {isAuditing ? 'Auditing Goals...' : 'Simulate Apps Script Audit'}
          </button>
          <button
            onClick={exportCSV}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
              isDark ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('sheet')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'sheet'
              ? 'bg-emerald-600 text-white shadow-xs'
              : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          Google Sheets Database Table (16 Columns)
        </button>
        <button
          onClick={() => setActiveTab('script')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'script'
              ? 'bg-emerald-600 text-white shadow-xs'
              : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-600 hover:text-slate-900 bg-slate-100'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          Google Apps Script Automation Code
        </button>
      </div>

      {/* Content */}
      {activeTab === 'sheet' ? (
        <div className={`p-4 sm:p-6 rounded-2xl border ${
          isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Synchronized Sheet Data
              </h3>
              <p className="text-xs text-slate-400">
                All {goals.length} financial goals mapped to the 16 Google Sheets database fields.
              </p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              Live Synced
            </span>
          </div>

          {/* Interactive Responsive Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className={`bg-slate-100 dark:bg-slate-900/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b ${
                isDark ? 'border-slate-700' : 'border-slate-200'
              }`}>
                <tr>
                  <th className="py-2.5 px-3">Goal ID</th>
                  <th className="py-2.5 px-3">Goal Name</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">Current</th>
                  <th className="py-2.5 px-3">Remaining</th>
                  <th className="py-2.5 px-3">Progress</th>
                  <th className="py-2.5 px-3">Deadline</th>
                  <th className="py-2.5 px-3">Purpose</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Email Alerts</th>
                  <th className="py-2.5 px-3">User Email</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-700' : 'divide-slate-200'}`}>
                {goals.map((g) => (
                  <tr key={g.id} className={isDark ? 'hover:bg-slate-700/40' : 'hover:bg-slate-50'}>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{g.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">{g.name}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {formatCurrency(g.targetAmount, currencySymbol)}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(g.currentSavings, currencySymbol)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                      {formatCurrency(g.remainingAmount, currencySymbol)}
                    </td>
                    <td className="py-2.5 px-3 font-medium">{g.progressPercentage}%</td>
                    <td className="py-2.5 px-3 text-slate-500">{formatDate(g.deadline)}</td>
                    <td className="py-2.5 px-3 text-slate-500">{g.purpose}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        g.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : g.status === 'Overdue'
                          ? 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                          : g.status === 'Approaching Deadline'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {g.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {g.emailAlerts ? (
                        <span className="text-emerald-600 font-medium">Enabled</span>
                      ) : (
                        <span className="text-slate-400">Disabled</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className={`p-6 rounded-2xl border ${
          isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Google Apps Script Daily Automation
              </h3>
              <p className="text-xs text-slate-400">
                Deploy this script as a time-driven trigger in Google Sheets to automate daily checks and email dispatches.
              </p>
            </div>
            <button
              onClick={copyScript}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Apps Script'}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 max-h-96">
            <code>{appsScriptCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
