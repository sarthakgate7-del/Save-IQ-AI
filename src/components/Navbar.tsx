import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Wallet, 
  Bell, 
  Plus, 
  Sun, 
  Moon, 
  User, 
  Settings as SettingsIcon, 
  LogOut, 
  FileSpreadsheet, 
  Check, 
  ChevronDown, 
  ExternalLink,
  Target,
  BarChart2,
  Menu,
  X
} from 'lucide-react';
import { UserProfile, AppNotification } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'goals' | 'ai-insights' | 'notifications' | 'sheets' | 'settings';
  onNavigate: (view: 'landing' | 'dashboard' | 'goals' | 'ai-insights' | 'notifications' | 'sheets' | 'settings') => void;
  user: UserProfile;
  notifications: AppNotification[];
  onCreateGoalClick: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
  onToggleTheme: () => void;
  isDark?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  user,
  notifications,
  onCreateGoalClick,
  onLoginClick,
  onLogout,
  onToggleTheme,
  isDark = false,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isLanding = currentView === 'landing';

  return (
    <nav className={`sticky top-0 z-40 w-full transition-colors border-b backdrop-blur-md ${
      isDark 
        ? 'bg-slate-900/90 border-slate-800 text-white' 
        : 'bg-white/90 border-slate-200/80 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo with Wallet + Sparkle */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate(isLanding ? 'landing' : 'dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden group"
            >
              <div className="relative w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
                <Wallet className="w-4 h-4" />
                <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1" />
              </div>
              <span className="text-lg font-extrabold tracking-tight font-heading">
                Save<span className="text-emerald-600 dark:text-emerald-400">IQ</span>
              </span>
            </button>

            {/* Navigation Links for App Mode */}
            {!isLanding && (
              <div className="hidden md:flex items-center gap-1 text-xs font-semibold">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  Dashboard
                </button>

                <button
                  onClick={() => onNavigate('ai-insights')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    currentView === 'ai-insights'
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  AI Insights
                </button>

                <button
                  onClick={() => onNavigate('notifications')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    currentView === 'notifications'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  Notifications
                  {unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => onNavigate('sheets')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                    currentView === 'sheets'
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  Google Sheets Sync
                </button>
              </div>
            )}

            {/* Navigation Links for Landing Mode */}
            {isLanding && (
              <div className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Home
                </button>
                <a
                  href="#features"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Features
                </a>
                <a
                  href="#calculator"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-emerald-600 dark:text-emerald-400"
                >
                  Savings Calculator
                </a>
                <a
                  href="#how-it-works"
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  How It Works
                </a>
                <button
                  onClick={() => onNavigate('sheets')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>Google Sheets Architecture</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border transition-colors ${
                isDark 
                  ? 'border-slate-700 bg-slate-800 text-amber-400 hover:bg-slate-700' 
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isLanding ? (
              /* Landing Mode Buttons */
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={onLoginClick}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isDark
                      ? 'border-slate-700 hover:bg-slate-800 text-slate-200'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  Get Started →
                </button>
              </div>
            ) : (
              /* App Mode Controls */
              <div className="flex items-center gap-2.5">
                {/* Switch to Landing Page preview */}
                <button
                  onClick={() => onNavigate('landing')}
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 px-2.5 py-1.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                  title="View Landing Page"
                >
                  <span>Landing Page</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                {/* + Create New Goal */}
                <button
                  onClick={onCreateGoalClick}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Goal</span>
                </button>

                {/* Notification Bell */}
                <button
                  onClick={() => onNavigate('notifications')}
                  className={`relative p-2 rounded-xl border transition-colors ${
                    isDark 
                      ? 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700' 
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* User Profile Dropdown (Section 11) */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-hidden"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold hidden md:inline text-slate-800 dark:text-slate-200">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileOpen && (
                    <div className={`absolute right-0 mt-2 w-52 rounded-2xl border py-2 shadow-xl z-50 animate-in fade-in duration-150 ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}>
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 text-xs">
                        <span className="font-bold block truncate">{user.name}</span>
                        <span className="text-slate-400 text-[11px] block truncate">{user.email}</span>
                      </div>

                      <div className="p-1 space-y-0.5 text-xs">
                        <button
                          onClick={() => {
                            onNavigate('dashboard');
                            setProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors"
                        >
                          <Target className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Dashboard</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('settings');
                            setProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors"
                        >
                          <SettingsIcon className="w-3.5 h-3.5 text-slate-500" />
                          <span>Settings & Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('sheets');
                            setProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-left transition-colors"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                          <span>Google Sheets Sync</span>
                        </button>
                      </div>

                      <div className="p-1 pt-1 border-t border-slate-100 dark:border-slate-700">
                        <button
                          onClick={() => {
                            onLogout();
                            setProfileOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/60 text-red-600 text-xs text-left transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <button
              onClick={() => {
                onNavigate(isLanding ? 'landing' : 'dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isLanding ? 'Landing Home' : 'Dashboard'}
            </button>

            {!isLanding && (
              <>
                <button
                  onClick={() => {
                    onNavigate('ai-insights');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  AI Insights
                </button>
                <button
                  onClick={() => {
                    onNavigate('notifications');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                >
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    onNavigate('sheets');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Google Sheets Sync
                </button>
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Settings
                </button>
                <button
                  onClick={() => {
                    onCreateGoalClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                >
                  + Create New Goal
                </button>
              </>
            )}

            {isLanding && (
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onNavigate('dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                >
                  Launch Dashboard
                </button>
                <button
                  onClick={() => {
                    onLoginClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
