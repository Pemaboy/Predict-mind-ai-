/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MOCK_FIXTURES } from './data/mockFootballData';
import { FootballFixture, UserProfile, SubscriptionPlanId } from './types';
import { getStoredUser, saveStoredUser } from './utils/storage';
import { Navbar } from './components/Navbar';
import { FixtureCard } from './components/FixtureCard';
import { MatchDetailModal } from './components/MatchDetailModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { VipSection } from './components/VipSection';
import { TrackRecordView } from './components/TrackRecordView';
import { SubscriptionView } from './components/SubscriptionView';
import { DashboardView } from './components/DashboardView';
import { WebsiteView } from './components/WebsiteView';
import { AuthModal } from './components/AuthModal';
import { DisclaimerModal } from './components/DisclaimerModal';
import { 
  Sparkles, Filter, Search, Crown, ShieldCheck, 
  Calendar, ArrowRight, Zap, TrendingUp, AlertTriangle, 
  CheckCircle2, Lock 
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile>(getStoredUser());
  const [currentTab, setCurrentTab] = useState<string>('website');
  
  // Modals state
  const [selectedFixture, setSelectedFixture] = useState<FootballFixture | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [initialPlanForSubscribe, setInitialPlanForSubscribe] = useState<SubscriptionPlanId>('monthly');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);

  // Fixtures filters
  const [selectedLeague, setSelectedLeague] = useState<string>('All');
  const [selectedMarket, setSelectedMarket] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync user state to storage whenever updated
  const handleUpdateUser = (updated: UserProfile) => {
    setUser(updated);
    saveStoredUser(updated);
  };

  const handleOpenSubscribe = (planId: SubscriptionPlanId = 'monthly') => {
    setInitialPlanForSubscribe(planId);
    setIsSubscribeModalOpen(true);
  };

  const handleOpenDetailModal = (fixture: FootballFixture) => {
    setSelectedFixture(fixture);
    setIsDetailModalOpen(true);
  };

  // Filter fixtures
  const leagues = [
    'All',
    'Premier League',
    'UEFA Champions League',
    'La Liga',
    'Serie A',
    'Bundesliga',
    'Nigeria Premier Football League (NPFL)',
  ];

  const markets = [
    'All',
    '1X2',
    'Over/Under',
    'BTTS',
    'Double Chance',
  ];

  const filteredFixtures = MOCK_FIXTURES.filter((fix) => {
    if (selectedLeague !== 'All' && fix.league !== selectedLeague) return false;
    if (selectedMarket !== 'All' && fix.aiPrediction.market !== selectedMarket) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = `${fix.homeTeam.name} vs ${fix.awayTeam.name}`.toLowerCase();
      const leagueName = fix.league.toLowerCase();
      if (!matchName.includes(q) && !leagueName.includes(q)) return false;
    }
    return true;
  });

  const isVip = user.currentPlan === 'vip-monthly';
  const isSubscribed = user.currentPlan !== 'free';

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        user={user}
        onOpenSubscribe={handleOpenSubscribe}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        
        {/* Free Tier Callout Banner (only if user has not subscribed) */}
        {!isSubscribed && currentTab === 'fixtures' && (
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-[#0F172A] border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-white text-base sm:text-lg">
                    Unlock Full AI Football Predictions
                  </h3>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Paystack
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Get instant access to all upcoming league fixtures, xG models, BTTS forecasts, and verified banker tips starting at just ₦5,000.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => handleOpenSubscribe('weekly')}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700"
              >
                Weekly (₦5k)
              </button>
              <button
                onClick={() => handleOpenSubscribe('monthly')}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Subscribe (₦10k)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 0: PUBLIC PRESENTATION WEBSITE PORTAL */}
        {currentTab === 'website' && (
          <WebsiteView
            onLaunchApp={() => setCurrentTab('fixtures')}
            onOpenSubscribe={handleOpenSubscribe}
            onOpenVip={() => setCurrentTab('vip')}
            onOpenTrackRecord={() => setCurrentTab('track-record')}
          />
        )}

        {/* TAB 1: FIXTURES & PREDICTIONS */}
        {currentTab === 'fixtures' && (
          <div className="space-y-6">
            
            {/* Fixtures Subtitle & Quick Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Upcoming Fixtures & AI Insights</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-slate-700">
                    {filteredFixtures.length} Matches
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Statistical probabilities calculated via machine learning & multi-season team analytics.
                </p>
              </div>

              {/* Quick Trust Pill */}
              <div 
                onClick={() => setCurrentTab('track-record')}
                className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs cursor-pointer hover:border-slate-700 transition-all shrink-0"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-slate-300">Verified Model Win Rate:</span>
                <span className="font-bold text-emerald-400 font-mono">79.2%</span>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
              {/* Search and Market row */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search team or competition..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Market Quick Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
                  <span className="text-xs text-slate-400 font-semibold shrink-0 mr-1">Market:</span>
                  {markets.map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMarket(m)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                        selectedMarket === m
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                          : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* League Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800/80 no-scrollbar">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="text-xs text-slate-400 font-semibold shrink-0">League:</span>
                {leagues.map((l) => (
                  <button
                    key={l}
                    onClick={() => setSelectedLeague(l)}
                    className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                      selectedLeague === l
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                        : 'bg-slate-950/60 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {l === 'Nigeria Premier Football League (NPFL)' ? 'NPFL' : l}
                  </button>
                ))}
              </div>
            </div>

            {/* Fixtures Grid */}
            {filteredFixtures.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
                <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white">No fixtures match your search</h4>
                <p className="text-xs text-slate-400 mt-1">Try switching league or clearing search terms.</p>
                <button
                  onClick={() => {
                    setSelectedLeague('All');
                    setSelectedMarket('All');
                    setSearchQuery('');
                  }}
                  className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold rounded-xl"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredFixtures.map((fixture) => (
                  <FixtureCard
                    key={fixture.id}
                    fixture={fixture}
                    user={user}
                    onOpenModal={handleOpenDetailModal}
                    onOpenSubscribe={handleOpenSubscribe}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VIP SECTION */}
        {currentTab === 'vip' && (
          <VipSection
            fixtures={MOCK_FIXTURES}
            user={user}
            onOpenSubscribe={handleOpenSubscribe}
            onOpenModal={handleOpenDetailModal}
          />
        )}

        {/* TAB 3: TRACK RECORD */}
        {currentTab === 'track-record' && (
          <TrackRecordView />
        )}

        {/* TAB 4: PRICING & SUBSCRIPTIONS */}
        {currentTab === 'pricing' && (
          <SubscriptionView
            user={user}
            onOpenSubscribe={handleOpenSubscribe}
          />
        )}

        {/* TAB 5: DASHBOARD & USER ACCOUNT */}
        {currentTab === 'dashboard' && (
          <DashboardView
            user={user}
            onUpdateUser={handleUpdateUser}
            onOpenSubscribe={handleOpenSubscribe}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-950/80 border-t border-slate-800/80 mt-12 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base">
                Predict Mind <span className="text-emerald-400">AI</span>
              </span>
              <span className="text-slate-600">|</span>
              <span>AI Football Analytics & Prediction Platform</span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={() => setIsDisclaimerModalOpen(true)}
                className="hover:text-white transition-colors"
              >
                18+ Responsible Betting Policy
              </button>
              <button
                onClick={() => setCurrentTab('pricing')}
                className="hover:text-white transition-colors"
              >
                Subscription Terms
              </button>
              <button
                onClick={() => setCurrentTab('track-record')}
                className="hover:text-white transition-colors"
              >
                Audited Track Record
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed text-center sm:text-left">
            Disclaimer: Predict Mind AI provides algorithmic sports predictions and statistical market models for informational and entertainment purposes only. Football is inherently volatile and no outcome is guaranteed. Predict Mind AI does not operate a sportsbook or accept bets. 18+ Please gamble responsibly.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <MatchDetailModal
        fixture={selectedFixture}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        user={user}
        onOpenSubscribe={handleOpenSubscribe}
      />

      <SubscriptionModal
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        user={user}
        initialPlanId={initialPlanForSubscribe}
        onPlanUpdated={handleUpdateUser}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onUserLoggedIn={handleUpdateUser}
      />

      <DisclaimerModal
        isOpen={isDisclaimerModalOpen}
        onClose={() => setIsDisclaimerModalOpen(false)}
      />
    </div>
  );
}
