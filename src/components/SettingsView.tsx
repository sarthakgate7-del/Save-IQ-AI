import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Moon, 
  Sun, 
  Key, 
  FileSpreadsheet, 
  RotateCcw, 
  LogOut, 
  Check, 
  Save, 
  ShieldCheck 
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onResetData: () => void;
  onLogout: () => void;
  isDark?: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onResetData,
  onLogout,
  isDark = false,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [currencySymbol, setCurrencySymbol] = useState(user.currencySymbol);
  const [groqKey, setGroqKey] = useState(user.groqApiKey || '');
  const [sheetsUrl, setSheetsUrl] = useState(user.googleSheetsUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: name.trim(),
      email: email.trim(),
      currencySymbol,
      groqApiKey: groqKey.trim() || undefined,
      googleSheetsUrl: sheetsUrl.trim() || undefined,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal profile, notification triggers, and API integrations.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* 1. Profile Information */}
        <div className={`p-6 rounded-2xl border ${
          isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/80">
            <User className="w-4 h-4 text-emerald-600" />
            <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Profile Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                  isDark ? 'border-slate-700 bg-slate-900/60 text-white' : 'border-slate-200 bg-white text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                  isDark ? 'border-slate-700 bg-slate-900/60 text-white' : 'border-slate-200 bg-white text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Preferred Currency Symbol
              </label>
              <select
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-hidden ${
                  isDark ? 'border-slate-700 bg-slate-900/60 text-white' : 'border-slate-200 bg-white text-slate-900'
                }`}
              >
                <option value="₹">₹ (Indian Rupee - INR)</option>
                <option value="$">$ (US Dollar - USD)</option>
                <option value="€">€ (Euro - EUR)</option>
                <option value="£">£ (British Pound - GBP)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. Notification Preferences */}
        <div className={`p-6 rounded-2xl border ${
          isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/80">
            <Bell className="w-4 h-4 text-emerald-600" />
            <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Email Alerts
                </span>
                <span className="text-[11px] text-slate-400">
                  Allow automated daily audit emails sent to your inbox.
                </span>
              </div>
              <input
                type="checkbox"
                checked={user.emailAlertsEnabled}
                onChange={(e) => onUpdateUser({ emailAlertsEnabled: e.target.checked })}
                className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Deadline Reminders
                </span>
                <span className="text-[11px] text-slate-400">
                  Alert me when a goal is within 14 days of its target date.
                </span>
              </div>
              <input
                type="checkbox"
                checked={user.deadlineRemindersEnabled}
                onChange={(e) => onUpdateUser({ deadlineRemindersEnabled: e.target.checked })}
                className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  Goal Completion Celebrations
                </span>
                <span className="text-[11px] text-slate-400">
                  Celebrate and log completed goals immediately.
                </span>
              </div>
              <input
                type="checkbox"
                checked={user.completionAlertsEnabled}
                onChange={(e) => onUpdateUser({ completionAlertsEnabled: e.target.checked })}
                className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                  AI Financial Guidance Alerts
                </span>
                <span className="text-[11px] text-slate-400">
                  Receive intelligent suggestions when velocity slows down.
                </span>
              </div>
              <input
                type="checkbox"
                checked={user.aiInsightsEnabled}
                onChange={(e) => onUpdateUser({ aiInsightsEnabled: e.target.checked })}
                className="w-4 h-4 text-emerald-600 accent-emerald-600 rounded"
              />
            </div>
          </div>
        </div>

        {/* 3. Appearance (Light / Dark Mode) */}
        <div className={`p-6 rounded-2xl border ${
          isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/80">
            {isDark ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Appearance
            </h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                Dashboard Theme
              </span>
              <span className="text-[11px] text-slate-400">
                Switch between crisp financial light mode and minimal dark mode.
              </span>
            </div>
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl">
              <button
                type="button"
                onClick={() => onUpdateUser({ theme: 'light' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  user.theme === 'light'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                Light
              </button>
              <button
                type="button"
                onClick={() => onUpdateUser({ theme: 'dark' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  user.theme === 'dark'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                Dark
              </button>
            </div>
          </div>
        </div>

        {/* 4. Integrations & Security (Groq & Google Sheets) */}
        <div className={`p-6 rounded-2xl border ${
          isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/80">
            <Key className="w-4 h-4 text-indigo-600" />
            <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Integrations & Security
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Custom Groq API Key (Optional)
              </label>
              <p className="text-[11px] text-slate-400 mb-2">
                SaveIQ automatically uses server-side Gemini 3.8 Flash by default. Enter your own Groq key if you prefer Llama 3.3 models.
              </p>
              <input
                type="password"
                placeholder="gsk_..."
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-hidden ${
                  isDark ? 'border-slate-700 bg-slate-900/60 text-white' : 'border-slate-200 bg-white text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Google Sheets Spreadsheet URL
              </label>
              <input
                type="url"
                value={sheetsUrl}
                onChange={(e) => setSheetsUrl(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-hidden ${
                  isDark ? 'border-slate-700 bg-slate-900/60 text-white' : 'border-slate-200 bg-white text-slate-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold animate-in fade-in">
              <Check className="w-4 h-4" />
              Settings saved successfully!
            </span>
          )}
          <div className="ml-auto">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </div>
      </form>

      {/* Danger Zone / Reset */}
      <div className={`p-6 rounded-2xl border ${
        isDark ? 'border-red-900/40 bg-red-950/10' : 'border-red-100 bg-red-50/30'
      }`}>
        <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">
          Data Management & Session
        </h3>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Reset to default demo data or log out of your session.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onResetData}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Data
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 dark:bg-red-950/60 hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
