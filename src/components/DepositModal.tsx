import React, { useState } from 'react';
import { X, Plus, PiggyBank, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Goal } from '../types';
import { formatCurrency } from '../utils/formatters';

interface DepositModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (goalId: string, amount: number, note: string) => void;
  currencySymbol?: string;
  isDark?: boolean;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  goal,
  isOpen,
  onClose,
  onDeposit,
  currencySymbol = '₹',
  isDark = false,
}) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !goal) return null;

  const presets = [500, 1000, 2500, 5000];

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a positive contribution amount.');
      return;
    }

    const newSavings = goal.currentSavings + val;
    if (newSavings >= goal.targetAmount) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#16A34A', '#6366F1', '#F59E0B', '#10B981'],
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }
    }

    onDeposit(goal.id, val, note.trim() || 'Savings deposit');
    setAmount('');
    setNote('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-md rounded-2xl border p-6 shadow-xl transition-all ${
          isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600">
              <PiggyBank className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">Add Savings</h3>
              <p className="text-xs text-slate-400">{goal.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Goal context info */}
        <div className={`mt-4 p-3 rounded-xl border flex items-center justify-between text-xs ${
          isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-slate-50 border-slate-100'
        }`}>
          <div>
            <span className="text-slate-400 block">Current Saved</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(goal.currentSavings, currencySymbol)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block">Remaining</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {formatCurrency(goal.remainingAmount, currencySymbol)}
            </span>
          </div>
        </div>

        <form onSubmit={handleDeposit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Deposit Amount ({currencySymbol})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-medium text-slate-400">
                {currencySymbol}
              </span>
              <input
                type="number"
                min="1"
                step="any"
                placeholder="1,000"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (error) setError('');
                }}
                className={`w-full pl-8 pr-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                  error
                    ? 'border-red-400 bg-red-50/20'
                    : isDark
                    ? 'border-slate-700 bg-slate-900/60 focus:border-emerald-500'
                    : 'border-slate-200 bg-slate-50/50 focus:border-emerald-600'
                }`}
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-2 mt-2.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset.toString())}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                    isDark
                      ? 'border-slate-700 bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  +{formatCurrency(preset, currencySymbol)}
                </button>
              ))}
              {goal.remainingAmount > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(goal.remainingAmount.toString())}
                  className="text-xs px-2.5 py-1 rounded-lg border font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                >
                  Pay Remaining
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Contribution Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Monthly salary savings, Freelance bonus"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs transition-colors focus:outline-hidden ${
                isDark
                  ? 'border-slate-700 bg-slate-900/60 focus:border-emerald-500'
                  : 'border-slate-200 bg-slate-50/50 focus:border-emerald-600'
              }`}
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              Confirm Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
