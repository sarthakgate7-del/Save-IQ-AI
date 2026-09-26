import React, { useState } from 'react';
import { X, Calendar, DollarSign, Target, Bell, AlertCircle } from 'lucide-react';
import { Goal, GoalPurpose } from '../types';
import { calculateDaysRemaining, calculateGoalStatus } from '../utils/formatters';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newGoal: Goal) => void;
  currencySymbol?: string;
  userEmail?: string;
  isDark?: boolean;
}

export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currencySymbol = '₹',
  userEmail = 'harshharade007@gmail.com',
  isDark = false,
}) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [initialSavings, setInitialSavings] = useState('');
  const [deadline, setDeadline] = useState('');
  const [purpose, setPurpose] = useState<GoalPurpose>('Personal');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [customEmail, setCustomEmail] = useState(userEmail);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  // Minimum date allowed: tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!name.trim()) {
      errs.name = 'Please give your goal a name.';
    }

    const target = parseFloat(targetAmount);
    if (!targetAmount || isNaN(target) || target <= 0) {
      errs.targetAmount = 'Please enter a valid target amount greater than zero.';
    }

    const initial = initialSavings ? parseFloat(initialSavings) : 0;
    if (isNaN(initial) || initial < 0) {
      errs.initialSavings = 'Initial savings cannot be negative.';
    } else if (target && initial > target) {
      errs.initialSavings = 'Initial savings cannot be greater than the target amount.';
    }

    if (!deadline) {
      errs.deadline = 'Please choose a target deadline.';
    } else {
      const selected = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected <= today) {
        errs.deadline = 'Please select a future date.';
      }
    }

    if (emailAlerts && (!customEmail || !customEmail.includes('@'))) {
      errs.email = 'Please provide a valid email address for notifications.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const target = parseFloat(targetAmount);
    const initial = initialSavings ? parseFloat(initialSavings) : 0;
    const daysRemaining = calculateDaysRemaining(deadline);
    const remainingAmount = Math.max(0, target - initial);
    const progressPercentage = Math.min(100, Math.round((initial / target) * 100));
    const status = calculateGoalStatus(target, initial, deadline);

    const nowIso = new Date().toISOString();
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      name: name.trim(),
      targetAmount: target,
      initialSavings: initial,
      currentSavings: initial,
      remainingAmount,
      deadline,
      purpose,
      emailAlerts,
      status,
      progressPercentage,
      daysRemaining,
      createdAt: nowIso,
      updatedAt: nowIso,
      contributions: initial > 0 ? [
        {
          id: `c-${Date.now()}`,
          amount: initial,
          date: nowIso.split('T')[0],
          note: 'Initial deposit',
        }
      ] : [],
    };

    onSave(newGoal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-lg rounded-2xl border p-6 md:p-8 shadow-xl transition-all ${
          isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Create a New Savings Goal</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Set a target and let SaveIQ help you stay on track.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Goal Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Goal Name
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Emergency Fund or Laptop Purchase"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                  errors.name
                    ? 'border-red-400 bg-red-50/20'
                    : isDark
                    ? 'border-slate-700 bg-slate-900/60 focus:border-emerald-500'
                    : 'border-slate-200 bg-slate-50/50 focus:border-emerald-600'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Amount Fields: Target & Initial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Amount ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-medium text-slate-400">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  placeholder="50,000"
                  min="1"
                  step="any"
                  value={targetAmount}
                  onChange={(e) => {
                    setTargetAmount(e.target.value);
                    if (errors.targetAmount) setErrors({ ...errors, targetAmount: '' });
                  }}
                  className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                    errors.targetAmount
                      ? 'border-red-400 bg-red-50/20'
                      : isDark
                      ? 'border-slate-700 bg-slate-900/60 focus:border-emerald-500'
                      : 'border-slate-200 bg-slate-50/50 focus:border-emerald-600'
                  }`}
                />
              </div>
              {errors.targetAmount && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.targetAmount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Initial Savings ({currencySymbol})
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-medium text-slate-400">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  placeholder="5,000"
                  min="0"
                  step="any"
                  value={initialSavings}
                  onChange={(e) => {
                    setInitialSavings(e.target.value);
                    if (errors.initialSavings) setErrors({ ...errors, initialSavings: '' });
                  }}
                  className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                    errors.initialSavings
                      ? 'border-red-400 bg-red-50/20'
                      : isDark
                      ? 'border-slate-700 bg-slate-900/60 focus:border-emerald-500'
                      : 'border-slate-200 bg-slate-50/50 focus:border-emerald-600'
                  }`}
                />
              </div>
              {errors.initialSavings && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.initialSavings}
                </p>
              )}
            </div>
          </div>

          {/* Deadline & Purpose */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Deadline
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={minDateStr}
                  value={deadline}
                  onChange={(e) => {
                    setDeadline(e.target.value);
                    if (errors.deadline) setErrors({ ...errors, deadline: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                    errors.deadline
                      ? 'border-red-400 bg-red-50/20'
                      : isDark
                      ? 'border-slate-700 bg-slate-900/60 focus:border-emerald-500'
                      : 'border-slate-200 bg-slate-50/50 focus:border-emerald-600'
                  }`}
                />
              </div>
              {errors.deadline && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.deadline}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Purpose
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as GoalPurpose)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                  isDark
                    ? 'border-slate-700 bg-slate-900/60 text-white focus:border-emerald-500'
                    : 'border-slate-200 bg-slate-50/50 text-slate-900 focus:border-emerald-600'
                }`}
              >
                <option value="Emergency">Emergency Fund</option>
                <option value="Education">Education</option>
                <option value="Electronics">Electronics</option>
                <option value="Travel">Travel</option>
                <option value="Health">Health & Wellness</option>
                <option value="Personal">Personal</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Email Alerts Toggle */}
          <div className={`p-4 rounded-xl border ${
            isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-slate-50/60 border-slate-100'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Enable email reminders
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Receive reminders when your goal deadline is approaching.
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {emailAlerts && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Recipient Email
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={`w-full px-3 py-1.5 rounded-lg border text-xs ${
                    errors.email ? 'border-red-400' : isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-white'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
                isDark 
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-700' 
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
