import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Target, 
  ShieldCheck, 
  TrendingUp, 
  Bell, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Wallet, 
  Laptop, 
  FileSpreadsheet, 
  Zap,
  ChevronDown,
  ChevronUp,
  PiggyBank,
  Check,
  Calculator,
  Database,
  Mail,
  HelpCircle,
  Users,
  Compass,
  Lock
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface LandingPageProps {
  onGetStarted: () => void;
  onLoginClick: () => void;
  onQuickCreateGoal?: (name: string, target: number, deadlineMonths: number) => void;
  currencySymbol?: string;
  isDark?: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLoginClick,
  onQuickCreateGoal,
  currencySymbol = '₹',
  isDark = false,
}) => {
  // Interactive Calculator State
  const [calcGoalName, setCalcGoalName] = useState('MacBook Pro M4');
  const [calcTarget, setCalcTarget] = useState(90000);
  const [calcMonths, setCalcMonths] = useState(6);
  const [calcCategory, setCalcCategory] = useState('Electronics');

  // FAQ open states
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calculations for live interactive calculator
  const daysTotal = Math.max(1, calcMonths * 30);
  const dailyPace = Math.ceil(calcTarget / daysTotal);
  const weeklyPace = dailyPace * 7;
  const monthlyPace = Math.ceil(calcTarget / calcMonths);

  const handleLaunchWithCalculatedGoal = () => {
    if (onQuickCreateGoal) {
      onQuickCreateGoal(calcGoalName, calcTarget, calcMonths);
    } else {
      onGetStarted();
    }
  };

  const faqs = [
    {
      q: 'How does SaveIQ use Google Sheets for data storage?',
      a: 'SaveIQ treats Google Sheets as a transparent, private, and portable cloud database. Every savings goal maps directly to 16 standardized columns (Goal ID, Target, Current Savings, Deadline, Alerts status, etc.). You always own 100% of your financial records.'
    },
    {
      q: 'How does the AI Financial Insights engine work?',
      a: 'SaveIQ utilizes Groq AI (Llama 3.3) and Google Gemini to evaluate your goal velocity, remaining timeline, and savings amount. It calculates realistic daily and weekly pacing figures, checks overdue risk, and delivers actionable behavioral guidance without making false investment promises.'
    },
    {
      q: 'What is the Google Apps Script Daily Goal Audit?',
      a: 'A time-driven Google Apps Script cron trigger runs automatically every morning at 08:00 AM. It audits all goals in your spreadsheet, calculates days remaining, detects approaching deadlines or overdue statuses, and dispatches automated email reminders if alerts are enabled.'
    },
    {
      q: 'Can I customize the currency and savings categories?',
      a: 'Yes! SaveIQ natively supports Indian Rupee (₹ INR), US Dollar ($ USD), Euro (€ EUR), and British Pound (£ GBP). You can categorize goals across Emergency Funds, Education, Electronics, Travel, Health, Personal, and more.'
    },
    {
      q: 'Is my financial data secure?',
      a: 'SaveIQ adheres to strict security best practices. API keys are handled securely via backend proxy routes and are never leaked to client bundles. We do not ask for bank login passwords or credentials.'
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>SaveIQ · The Intelligent Savings Tracker</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] font-heading">
                Save Smarter. <br />
                <span className="text-emerald-600 dark:text-emerald-500">Reach Your Goals</span> Faster.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                SaveIQ uses AI-powered insights and intelligent reminders to help you build better saving habits and achieve your financial goals.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <button
                  onClick={onGetStarted}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-all shadow-md hover:shadow-lg"
                >
                  <span>Start Saving →</span>
                </button>

                <button
                  onClick={() => scrollToSection('calculator')}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-xl text-sm font-semibold border transition-all ${
                    isDark
                      ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs'
                  }`}
                >
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  Try Savings Calculator
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Google Apps Script Audits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Google Sheets Sync</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Groq & Gemini AI Engine</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Modern Fintech Dashboard Mockup (Section 8) */}
            <div className="lg:col-span-6 flex justify-center">
              <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl relative transition-all ${
                isDark 
                  ? 'bg-slate-800/90 border-slate-700/80 backdrop-blur-md' 
                  : 'bg-white border-slate-200/80 shadow-slate-200/50'
              }`}>
                {/* Header Mockup */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold block text-slate-900 dark:text-white">SaveIQ Live Dashboard</span>
                      <span className="text-[10px] text-slate-400">Personal Savings Portfolio</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                {/* 3 Metric Summary Display (Section 8) */}
                <div className="grid grid-cols-3 gap-2.5 my-4">
                  <div className={`p-3 rounded-xl border ${
                    isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <span className="text-[10px] text-slate-400 block font-medium">Total Savings</span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      {formatCurrency(42500, currencySymbol)}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <span className="text-[10px] text-slate-400 block font-medium">Active Goals</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
                      4
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border ${
                    isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'
                  }`}>
                    <span className="text-[10px] text-slate-400 block font-medium">Completed</span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      2
                    </span>
                  </div>
                </div>

                {/* Circular Progress & Overall Bar (Section 8) */}
                <div className={`p-4 rounded-xl border flex items-center gap-4 ${
                  isDark ? 'bg-slate-900/40 border-slate-700' : 'bg-slate-50/70 border-slate-100'
                }`}>
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke={isDark ? '#334155' : '#e2e8f0'} strokeWidth="3.5" />
                      <circle
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke="#16A34A"
                        strokeWidth="3.5"
                        strokeDasharray="88 88"
                        strokeDashoffset="28"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-xs font-bold text-slate-900 dark:text-white">68%</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Overall Progress</span>
                      <span className="font-bold text-emerald-600">68% Complete</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      You are making steady progress toward your 2026 targets.
                    </p>
                  </div>
                </div>

                {/* AI Recommendation Card (Section 8) */}
                <div className={`mt-4 p-4 rounded-xl border transition-all ${
                  isDark ? 'bg-slate-900/60 border-indigo-900/60' : 'bg-indigo-50/60 border-indigo-100'
                }`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                        AI Insight
                      </span>
                    </div>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                      Groq AI Guidance
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    "You are {formatCurrency(7500, currencySymbol)} away from reaching your laptop goal. Saving {formatCurrency(500, currencySymbol)} more per week could help you reach it earlier."
                  </p>
                </div>

                {/* Upcoming Deadline Pill */}
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Next Deadline: Laptop Purchase (15 Dec 2026)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">80 days left</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE SAVINGS PACING CALCULATOR */}
      <section id="calculator" className={`py-16 border-t ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100/60 border-slate-200'
      }`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Interactive Tool
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading mt-1">
              Calculate Your Savings Timeline
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              See how SaveIQ breaks down large financial goals into manageable daily and weekly paces.
            </p>
          </div>

          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
            isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-white border-slate-200'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Goal Name
                  </label>
                  <input
                    type="text"
                    value={calcGoalName}
                    onChange={(e) => setCalcGoalName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-hidden ${
                      isDark ? 'border-slate-700 bg-slate-900/60 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Target Amount ({currencySymbol})
                    </label>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(calcTarget, currencySymbol)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="5000"
                    value={calcTarget}
                    onChange={(e) => setCalcTarget(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>{formatCurrency(5000, currencySymbol)}</span>
                    <span>{formatCurrency(250000, currencySymbol)}</span>
                    <span>{formatCurrency(500000, currencySymbol)}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Timeline in Months
                    </label>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {calcMonths} Months (~{calcMonths * 30} days)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="24"
                    step="1"
                    value={calcMonths}
                    onChange={(e) => setCalcMonths(Number(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>1 mo</span>
                    <span>6 mos</span>
                    <span>12 mos</span>
                    <span>24 mos</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Purpose Category
                  </label>
                  <select
                    value={calcCategory}
                    onChange={(e) => setCalcCategory(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-hidden ${
                      isDark ? 'border-slate-700 bg-slate-900/60 text-white' : 'border-slate-200 bg-slate-50 text-slate-900'
                    }`}
                  >
                    <option value="Electronics">Electronics & Tech</option>
                    <option value="Emergency">Emergency Buffer</option>
                    <option value="Education">Education & Courses</option>
                    <option value="Travel">Vacation & Travel</option>
                    <option value="Health">Health & Wellness</option>
                    <option value="Personal">Personal Milestone</option>
                  </select>
                </div>
              </div>

              {/* Real-time Calculation Result */}
              <div className={`p-6 rounded-2xl border space-y-4 ${
                isDark ? 'bg-slate-900/60 border-indigo-900/40' : 'bg-emerald-50/50 border-emerald-100'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold">SaveIQ Pacing Analysis</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100/60 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Feasible
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <span className="text-[10px] text-slate-400 block">Daily</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      {formatCurrency(dailyPace, currencySymbol)}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <span className="text-[10px] text-slate-400 block">Weekly</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                      {formatCurrency(weeklyPace, currencySymbol)}
                    </span>
                  </div>

                  <div className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                    <span className="text-[10px] text-slate-400 block">Monthly</span>
                    <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                      {formatCurrency(monthlyPace, currencySymbol)}
                    </span>
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <span className="font-semibold text-emerald-600 block mb-1">
                    AI Behavioral Recommendation:
                  </span>
                  "By setting aside {formatCurrency(weeklyPace, currencySymbol)} every week into a designated {calcCategory.toLowerCase()} fund, you will comfortably reach {formatCurrency(calcTarget, currencySymbol)} in {calcMonths} months without disrupting daily expenses."
                </div>

                <button
                  onClick={onGetStarted}
                  className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Track This in SaveIQ Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIX CORE FEATURES SECTION (Section 9) */}
      <section id="features" className={`py-20 border-t ${
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading mt-1">
              Everything You Need to Save Smarter
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3">
              A comprehensive suite of personal finance tools engineered to keep you accountable, focused, and in control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Smart Savings Goals */}
            <div className={`p-6 rounded-2xl border transition-all hover:shadow-md ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/50 border-slate-100 shadow-xs'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">1. Smart Savings Goals</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Create personalized goals with target amounts, initial contributions, clear deadlines, categorizations, and automated email alerts.
              </p>
            </div>

            {/* 2. AI Financial Insights */}
            <div className={`p-6 rounded-2xl border transition-all hover:shadow-md ${
              isDark ? 'bg-slate-800 border-indigo-950' : 'bg-indigo-50/20 border-indigo-100 shadow-xs'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2 text-indigo-950 dark:text-indigo-200">2. AI Financial Insights</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Get personalized recommendations based on current savings, target amount, remaining balance, days remaining, and historical velocity.
              </p>
            </div>

            {/* 3. Automated Alerts */}
            <div className={`p-6 rounded-2xl border transition-all hover:shadow-md ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/50 border-slate-100 shadow-xs'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 mb-4">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">3. Automated Alerts</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Receive email notifications when your deadline is approaching, when a goal becomes overdue, or when progress requires your attention.
              </p>
            </div>

            {/* 4. Financial Dashboard */}
            <div className={`p-6 rounded-2xl border transition-all hover:shadow-md ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/50 border-slate-100 shadow-xs'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">4. Financial Dashboard</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Monitor total goals, total savings, active goals, completed milestones, and overdue alerts at a single glance with intuitive charts.
              </p>
            </div>

            {/* 5. Progress Tracking */}
            <div className={`p-6 rounded-2xl border transition-all hover:shadow-md ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/50 border-slate-100 shadow-xs'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">5. Progress Tracking</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                See each goal's amount saved, target amount, percentage completed, remaining balance, and days remaining with detailed timeline logs.
              </p>
            </div>

            {/* 6. Saving Discipline */}
            <div className={`p-6 rounded-2xl border transition-all hover:shadow-md ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50/50 border-slate-100 shadow-xs'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-2">6. Saving Discipline</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                AI recommendations and automated reminders encourage you to stay consistent, avoid lifestyle inflation, and build lasting financial confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS (Section 10) */}
      <section id="how-it-works" className={`py-20 border-t ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Step by Step
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-heading mt-1">
              How SaveIQ Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3">
              A simple four-step process connecting intelligent tracking with automated peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className={`p-6 rounded-2xl border relative flex flex-col justify-between ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/70 shadow-xs'
            }`}>
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase block mb-3">
                  Step 1
                </span>
                <h3 className="text-base font-bold mb-2">Create Your Goal</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Enter your financial goal, target amount, initial savings, and target deadline date.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span>Setup & Target</span>
                <Target className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-6 rounded-2xl border relative flex flex-col justify-between ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/70 shadow-xs'
            }`}>
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase block mb-3">
                  Step 2
                </span>
                <h3 className="text-base font-bold mb-2">Track Your Progress</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Record savings contributions regularly and monitor visual progress bars and milestone indicators.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span>Visual Analytics</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
            </div>

            {/* Step 3 */}
            <div className={`p-6 rounded-2xl border relative flex flex-col justify-between ${
              isDark ? 'bg-slate-800 border-indigo-900/60' : 'bg-white border-indigo-100 shadow-xs'
            }`}>
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase block mb-3">
                  Step 3
                </span>
                <h3 className="text-base font-bold mb-2 text-indigo-950 dark:text-indigo-200">Get AI Guidance</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Groq AI & Gemini analyze your velocity and calculate realistic daily/weekly saving paces.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span>Intelligent Pacing</span>
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>
            </div>

            {/* Step 4 */}
            <div className={`p-6 rounded-2xl border relative flex flex-col justify-between ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200/70 shadow-xs'
            }`}>
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase block mb-3">
                  Step 4
                </span>
                <h3 className="text-base font-bold mb-2">Stay on Track</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Receive automated deadline alerts and audit notifications powered by Google Apps Script triggers.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span>Email Automation</span>
                <Bell className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SYSTEM ARCHITECTURE: GOOGLE SHEETS & GROQ AI */}
      <section className={`py-16 border-t ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Under The Hood
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight font-heading mt-1">
              Google Apps Script + Groq AI Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              How SaveIQ connects private Google Sheets storage, time-triggered audits, and generative AI guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 mb-3">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">Google Sheets Database</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Stores your 16 standard goal columns. Completely transparent, cloud-synced, and portable. No proprietary database lock-in.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">Apps Script Daily Cron</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Runs automatically every day at 08:00 AM. Verifies deadlines, updates overdue statuses, and triggers HTML emails via MailApp.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border ${
              isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold mb-1">Groq & Gemini AI Engine</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Evaluates savings velocity, days remaining, and calculates achievable pacing with realistic habit advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className={`py-16 border-t ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/80'
      }`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all ${
                    isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold focus:outline-hidden"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className={`py-16 border-t ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
      }`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className={`p-8 sm:p-12 rounded-3xl border ${
            isDark 
              ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700' 
              : 'bg-gradient-to-b from-emerald-50/50 to-white border-emerald-100'
          }`}>
            <h2 className="text-3xl font-extrabold tracking-tight font-heading mb-3">
              Ready to reach your financial goals?
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-6">
              Launch the SaveIQ dashboard right now. Track active milestones, get intelligent pacing guidance, and watch your discipline compound.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <span>Launch SaveIQ Dashboard →</span>
              </button>
              <button
                onClick={onLoginClick}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER (Section 45) */}
      <footer className={`py-12 border-t ${
        isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100/60 border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs">
                  S
                </div>
                <span className="font-bold text-base text-slate-900 dark:text-white">SaveIQ</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Save smarter. Reach your goals faster.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-medium">
              <button onClick={() => scrollToSection('features')} className="hover:text-emerald-600 transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="hover:text-emerald-600 transition-colors">
                How It Works
              </button>
              <button onClick={() => scrollToSection('calculator')} className="hover:text-emerald-600 transition-colors">
                Savings Calculator
              </button>
              <button onClick={onGetStarted} className="hover:text-emerald-600 transition-colors">
                Dashboard
              </button>
              <span className="hover:text-emerald-600 transition-colors cursor-pointer">
                Privacy
              </span>
              <span className="hover:text-emerald-600 transition-colors cursor-pointer">
                Terms
              </span>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
            <p>© 2026 SaveIQ. All rights reserved.</p>
            <p>Designed for disciplined savings with Google Sheets & Groq / Gemini AI integration.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
