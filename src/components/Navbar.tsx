import React from 'react';
import { UserProfile, SubscriptionPlanId } from '../types';
import { ShieldCheck, Crown, Zap, User, Lock, Sparkles, TrendingUp, Calendar, AlertCircle, Globe } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  user: UserProfile;
  onOpenSubscribe: (planId?: SubscriptionPlanId) => void;
  onOpenAuth: () => void;
  onOpenDisclaimer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  user,
  onOpenSubscribe,
  onOpenAuth,
  onOpenDisclaimer,
}) => {
  const isVip = user.currentPlan === 'vip-monthly';
  const isSubscribed = user.currentPlan !== 'free';

  const planBadges: Record<SubscriptionPlanId, { label: string; color: string; icon: React.ReactNode }> = {
    free: {
      label: 'Free Guest',
      color: 'bg-slate-800 text-slate-300 border-slate-700',
      icon: <Lock className="w-3 h-3 text-slate-400" />,
    },
    weekly: {
      label: 'Weekly Pass',
      color: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60',
      icon: <Zap className="w-3 h-3 text-emerald-400" />,
    },
    monthly: {
      label: 'Monthly Pro',
      color: 'bg-blue-950/80 text-blue-300 border-blue-700/60',
      icon: <ShieldCheck className="w-3 h-3 text-blue-400" />,
    },
    'vip-monthly': {
      label: 'VIP Elite Member',
      color: 'bg-amber-950/90 text-amber-300 border-amber-600/70 shadow-sm shadow-amber-500/10',
      icon: <Crown className="w-3 h-3 text-amber-400" />,
    },
  };

  const currentBadge = planBadges[user.currentPlan];

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('website')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 font-bold shadow-md shadow-emerald-500/20">
              <span className="text-xl font-extrabold tracking-tighter">PM</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-white font-sans">
                  Predict Mind <span className="text-emerald-400">AI</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  v4.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Quantitative Football Intelligence & 14+ Markets
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/80">
            <button
              id="nav-tab-website"
              onClick={() => onTabChange('website')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'website'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              Website Portal
            </button>

            <button
              id="nav-tab-fixtures"
              onClick={() => onTabChange('fixtures')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'fixtures'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              App Terminal & Tips
            </button>

            <button
              id="nav-tab-vip"
              onClick={() => onTabChange('vip')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'vip'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-400" />
              VIP Vault
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                Elite
              </span>
            </button>

            <button
              id="nav-tab-track-record"
              onClick={() => onTabChange('track-record')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'track-record'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Track Record
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1 rounded">
                79% Win
              </span>
            </button>

            <button
              id="nav-tab-pricing"
              onClick={() => onTabChange('pricing')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'pricing'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Subscription Plans
            </button>

            <button
              id="nav-tab-dashboard"
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <User className="w-4 h-4" />
              My Account
            </button>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Tier Chip */}
            <div
              onClick={() => onTabChange('dashboard')}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all hover:scale-102 ${currentBadge.color}`}
              title="Click to view subscription details"
            >
              {currentBadge.icon}
              <span>{currentBadge.label}</span>
            </div>

            {/* Subscribe / Upgrade CTA Button */}
            {!isVip ? (
              <button
                id="btn-nav-upgrade"
                onClick={() => onOpenSubscribe()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Crown className="w-4 h-4" />
                <span className="whitespace-nowrap">
                  {isSubscribed ? 'Upgrade to VIP' : 'Subscribe via Paystack'}
                </span>
              </button>
            ) : (
              <button
                id="btn-nav-vip-active"
                onClick={() => onTabChange('vip')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">VIP Active</span>
              </button>
            )}

            {/* Account / User Button */}
            <button
              id="btn-user-profile"
              onClick={onOpenAuth}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
              title="User Account"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2.5 gap-2 border-t border-slate-800/60 no-scrollbar">
          <button
            onClick={() => onTabChange('website')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'website'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                : 'text-slate-300 bg-slate-900/60'
            }`}
          >
            🌐 Website
          </button>
          <button
            onClick={() => onTabChange('fixtures')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'fixtures'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 bg-slate-900/60'
            }`}
          >
            ⚽ App & Tips
          </button>
          <button
            onClick={() => onTabChange('vip')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-1 ${
              currentTab === 'vip'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-amber-400 bg-amber-950/40 border border-amber-800/40'
            }`}
          >
            <Crown className="w-3 h-3" /> VIP Vault
          </button>
          <button
            onClick={() => onTabChange('track-record')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'track-record'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 bg-slate-900/60'
            }`}
          >
            📊 Track Record
          </button>
          <button
            onClick={() => onTabChange('pricing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'pricing'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 bg-slate-900/60'
            }`}
          >
            💎 Pricing
          </button>
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              currentTab === 'dashboard'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-300 bg-slate-900/60'
            }`}
          >
            ⚙️ Account
          </button>
        </div>
      </div>
    </header>
  );
};
