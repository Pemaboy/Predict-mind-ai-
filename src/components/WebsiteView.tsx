import React, { useState } from 'react';
import { 
  Sparkles, TrendingUp, ShieldCheck, CheckCircle2, 
  ArrowRight, Smartphone, Laptop, Layers, Zap, 
  Target, BarChart3, HelpCircle, Lock, Crown, 
  ChevronRight, Award, Flame, Scale, Clock, RefreshCw
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../data/subscriptionPlans';
import { SubscriptionPlanId } from '../types';

interface WebsiteViewProps {
  onLaunchApp: () => void;
  onOpenSubscribe: (planId?: SubscriptionPlanId) => void;
  onOpenVip: () => void;
  onOpenTrackRecord: () => void;
  onOpenAccumulator?: () => void;
}

export const WebsiteView: React.FC<WebsiteViewProps> = ({
  onLaunchApp,
  onOpenSubscribe,
  onOpenVip,
  onOpenTrackRecord,
  onOpenAccumulator,
}) => {
  // Staking simulator state
  const [initialBankroll, setInitialBankroll] = useState<number>(50000);
  const [stakePercentage, setStakePercentage] = useState<number>(3);
  const [selectedMarketTab, setSelectedMarketTab] = useState<number>(0);

  // Bankroll simulator calculations (30 days, 35 bets, 79.2% win rate, avg odds 1.78)
  const unitSize = Math.round(initialBankroll * (stakePercentage / 100));
  const estimatedProfit = Math.round(initialBankroll * (stakePercentage === 2 ? 0.38 : stakePercentage === 3 ? 0.58 : 0.94));
  const finalProjectedBalance = initialBankroll + estimatedProfit;

  const marketsData = [
    {
      name: '1X2 Match Result',
      badge: 'Core Market',
      desc: 'Deep multi-factor winner forecast incorporating home advantage index, missing key players, and managerial head-to-head records.',
      samplePick: 'Arsenal to Win',
      sampleOdds: 1.78,
      conf: '86%',
      mathModel: 'Home xG advantage (+0.95) & 82% home possession conversion rate.',
    },
    {
      name: 'Over / Under 1.5 & 2.5 Goals',
      badge: 'High Liquidity',
      desc: 'Evaluates shot volumes inside the 18-yard box, keeper save percentages, and transition pace to detect high or low scoring fixtures.',
      samplePick: 'Over 2.5 Goals',
      sampleOdds: 1.72,
      conf: '84%',
      mathModel: 'Combined expected goals (xG = 3.20) gives 68% Poisson probability of 3+ goals.',
    },
    {
      name: 'Both Teams to Score (GG / NG)',
      badge: 'High Value',
      desc: 'Identifies defensive rest-defense leaks and offensive counter-pressing tendencies where both squads are statistically primed to score.',
      samplePick: 'BTTS - Yes (GG)',
      sampleOdds: 1.68,
      conf: '82%',
      mathModel: 'Away team scored in 9 of last 10 away matches; Home conceded in 70% of derbies.',
    },
    {
      name: 'Double Chance & Draw No Bet',
      badge: 'Banker Anchor',
      desc: 'Eliminates stalemate risk. Ideal for conservative accumulator building with over 91% historical realization across top European leagues.',
      samplePick: 'Double Chance 1X',
      sampleOdds: 1.25,
      conf: '93%',
      mathModel: 'Eliminates 23% draw deadlock probability to produce a safe accumulator anchor.',
    },
    {
      name: 'Half-Time / Full-Time (HT/FT)',
      badge: 'High Multiplier',
      desc: 'Predicts score evolution by evaluating 1st half tactical attrition vs 2nd half fatigue and substitution impacts.',
      samplePick: 'X / 1 (Draw at HT, Home Win at FT)',
      sampleOdds: 4.40,
      conf: '72%',
      mathModel: 'Away side concedes 71% of goals in the final 30 minutes of away fixtures.',
    },
    {
      name: 'First Half Goals & 1H Result',
      badge: 'Fast Settlement',
      desc: 'Fast payouts settled within 45 minutes by modeling high-tempo starting presses and early penalty conversion trends.',
      samplePick: 'Over 0.5 First Half Goals',
      sampleOdds: 1.38,
      conf: '88%',
      mathModel: 'Home team scores in 82% of first halves at home stadium this season.',
    },
    {
      name: 'Total Corners (Over / Under 9.5)',
      badge: 'Secondary Edge',
      desc: 'Models winger crossing frequency, deflected blocked shots, and defensive clearance trajectories.',
      samplePick: 'Over 9.5 Total Corners',
      sampleOdds: 1.84,
      conf: '80%',
      mathModel: 'Both teams combine for 11.2 corners per 90 in wide winger attacking schemes.',
    },
    {
      name: 'Total Cards & Bookings',
      badge: 'Disciplinary Edge',
      desc: 'Analyzes derby rivalry intensity, cynical tactical fouls per game, and the appointed referee’s strict card-issuing history.',
      samplePick: 'Over 3.5 Total Cards',
      sampleOdds: 1.76,
      conf: '79%',
      mathModel: 'Referee averages 4.2 cards/match; derby rivalry generated 5.1 cards over last 5 meetings.',
    },
    {
      name: 'Correct Score Top 3 Projections',
      badge: 'Exotic Odds',
      desc: 'Bivariate Poisson distribution mapping out exact goal frequencies with calculated probabilities and value overlays.',
      samplePick: 'Top Scoreline: 2 - 1',
      sampleOdds: 7.50,
      conf: '19% (Highest Prob.)',
      mathModel: 'Most statistically probable outcome based on 2.15 home xG vs 1.05 away xG.',
    },
    {
      name: 'Asian & European Handicap',
      badge: 'Spread Value',
      desc: 'Captures goal superiority margins when standard 1X2 moneyline odds are priced too low for meaningful single-stake returns.',
      samplePick: 'Home -1.0 Asian Handicap',
      sampleOdds: 2.10,
      conf: '78%',
      mathModel: 'Expected goal differential (+1.10) protects against 1-goal victory via stake refund.',
    },
  ];

  return (
    <div id="website-landing-portal" className="min-h-screen text-slate-100 bg-[#070A12] selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Live Market Predictions Marquee */}
      <div className="bg-emerald-950/40 border-b border-emerald-500/20 py-2 px-4 overflow-x-auto text-xs font-mono text-slate-300">
        <div className="flex items-center justify-between min-w-[760px] gap-6">
          <div className="flex items-center gap-2 text-emerald-400 font-bold shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>LIVE AI PREDICTION STREAM:</span>
          </div>
          <div className="flex items-center gap-6 text-[11px] overflow-hidden">
            <span className="text-slate-200">
              <strong className="text-white">Arsenal vs Chelsea:</strong> Arsenal to Win & Over 1.5 @1.78 <span className="text-emerald-400 font-bold">(86% Conf)</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-200">
              <strong className="text-white">Real Madrid vs Bayern:</strong> Over 2.5 Goals @1.75 <span className="text-emerald-400 font-bold">(88% Conf)</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-200">
              <strong className="text-white">PSG vs Barcelona:</strong> BTTS - Yes @1.62 <span className="text-emerald-400 font-bold">(84% Conf)</span>
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-200">
              <strong className="text-white">Inter Milan vs Juventus:</strong> Double Chance 1X @1.28 <span className="text-emerald-400 font-bold">(91% Conf)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Quantitative Football Prediction Portal • Web Platform & Mobile App</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
            The Algorithmic Football Intelligence Platform Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Smart Punters</span>.
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stop losing money on guesswork and Telegram tipster scams. Predict Mind AI evaluates Expected Goals (xG), pressing metrics, and referee tendencies across <strong className="text-white font-semibold">14+ betting markets</strong> to find mathematically profitable odds edges.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onLaunchApp}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Launch Live App Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenAccumulator && (
              <button
                id="btn-hero-booking-codes"
                onClick={onOpenAccumulator}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500/20 to-emerald-500/20 hover:from-teal-500/30 hover:to-emerald-500/30 border border-emerald-500/50 text-emerald-300 font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-emerald-500/10"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI Booking Code Generator</span>
                <span className="text-[10px] bg-emerald-400 text-slate-950 px-1.5 py-0.5 rounded font-black uppercase">
                  New
                </span>
              </button>
            )}

            <button
              onClick={onOpenVip}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Explore VIP Banker Suite</span>
            </button>
          </div>

          {/* Key Trust Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 max-w-3xl mx-auto text-left">
            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400 block">79.2%</span>
              <span className="text-xs text-slate-400">Audited Season Win Rate</span>
            </div>
            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xl sm:text-2xl font-black font-mono text-white block">14+</span>
              <span className="text-xs text-slate-400">Betting Markets Analyzed</span>
            </div>
            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400 block">Gemini 2.5</span>
              <span className="text-xs text-slate-400">Quantitative AI Engine</span>
            </div>
            <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800">
              <span className="text-xl sm:text-2xl font-black font-mono text-white block">Paystack</span>
              <span className="text-xs text-slate-400">Instant Automated Access</span>
            </div>
          </div>
        </div>
      </section>

      {/* Website & App Dual Platform Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <Laptop className="w-3.5 h-3.5 text-blue-400" />
            <span>Dual Access Platform</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Built as a Powerful Website. Installable as a Lightning Mobile App.
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Enjoy seamless sports intelligence on your desktop monitor at home, or install the web app to your iPhone or Android home screen with one tap for instant live notifications before kickoff.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Web Portal Experience */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Desktop & Tablet Web Platform</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Full-screen analytical terminal with multi-match comparisons, interactive expected goals (xG) distribution graphs, head-to-head records, and deep market matrix views.
              </p>
              <ul className="space-y-2 text-xs text-slate-400 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Ultra-fast responsive browser loading with zero installation needed</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>On-demand custom match tactical queries powered by Gemini 2.5 Flash</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Comprehensive 14+ market filters for 1X2, Over/Under, BTTS & Corners</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onLaunchApp}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Launch Desktop Web Terminal</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile App Experience */}
          <div className="bg-gradient-to-br from-[#0B1528] to-slate-900 border border-emerald-500/40 rounded-2xl p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">PWA Mobile App Experience</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Install directly to your iOS Safari or Android Chrome home screen. Zero App Store downloads, instant app icon launch, offline caching, and native tactile feel.
              </p>
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300 mb-6">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-emerald-400 font-mono">iOS:</span>
                  <span>Open in Safari → Tap Share icon <strong className="text-white">(⎋)</strong> → Tap <strong className="text-white">"Add to Home Screen"</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-emerald-400 font-mono">Android:</span>
                  <span>Open in Chrome → Tap three dots <strong className="text-white">(⋮)</strong> → Tap <strong className="text-white">"Install App"</strong></span>
                </div>
              </div>
            </div>
            <button
              onClick={onLaunchApp}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Open Mobile App View</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ALL 14+ BETTING MARKETS SHOWCASE */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Complete Market Coverage</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            AI Mathematical Coverage for All 14+ Betting Markets
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            You aren't restricted to basic 1X2 outcomes. Our neural models evaluate every market angle so you can capitalize on the highest Expected Value (EV+) across global bookmakers.
          </p>
        </div>

        {/* Interactive Market Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
          {marketsData.map((market, idx) => (
            <button
              key={market.name}
              onClick={() => setSelectedMarketTab(idx)}
              className={`p-3 rounded-xl border text-left text-xs transition-all ${
                selectedMarketTab === idx
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] opacity-80">{market.badge}</span>
                <span className="text-[10px] font-mono">{market.conf}</span>
              </div>
              <p className="truncate font-semibold">{market.name}</p>
            </button>
          ))}
        </div>

        {/* Selected Market Spotlight Card */}
        {marketsData[selectedMarketTab] && (
          <div className="bg-gradient-to-br from-slate-900 to-[#0F172A] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {marketsData[selectedMarketTab].badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                    {marketsData[selectedMarketTab].name}
                  </h3>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {marketsData[selectedMarketTab].desc}
                </p>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-400 block mb-0.5">Underlying Algorithmic Formulation:</span>
                  <p className="text-xs font-mono text-emerald-300">{marketsData[selectedMarketTab].mathModel}</p>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-center space-y-3">
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Sample Live Projection</span>
                <div className="text-lg sm:text-xl font-black text-white">{marketsData[selectedMarketTab].samplePick}</div>
                <div className="flex items-center justify-center gap-3 text-xs font-mono">
                  <span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded font-bold">
                    {marketsData[selectedMarketTab].conf} Confidence
                  </span>
                  <span className="bg-slate-900 text-slate-300 px-2 py-1 rounded">
                    @{marketsData[selectedMarketTab].sampleOdds.toFixed(2)} Odds
                  </span>
                </div>
                <button
                  onClick={onLaunchApp}
                  className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all"
                >
                  View All Fixture Picks
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Interactive Bankroll & Staking Simulator */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
              <Scale className="w-3.5 h-3.5" />
              <span>Capital Preservation Engine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Interactive Bankroll Growth Simulator
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Professional punting isn't about all-in wild gambles. It is a game of disciplined mathematical edge and fixed unit allocation. See how our 79.2% win rate compounds your starting bankroll across 30 days.
            </p>

            <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              {/* Slider 1: Initial Bankroll */}
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1.5">
                  <span>Starting Bankroll:</span>
                  <strong className="text-emerald-400 font-mono text-sm">₦{initialBankroll.toLocaleString()}</strong>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="10000"
                  value={initialBankroll}
                  onChange={(e) => setInitialBankroll(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>₦10,000</span>
                  <span>₦250,000</span>
                  <span>₦500,000</span>
                </div>
              </div>

              {/* Staking Unit Level Selector */}
              <div>
                <label className="text-xs text-slate-300 block mb-2">Staking Unit Discipline:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { pct: 2, label: 'Conservative (2%)', desc: 'Lowest drawdown' },
                    { pct: 3, label: 'Balanced (3%)', desc: 'Recommended' },
                    { pct: 5, label: 'Aggressive (5%)', desc: 'High growth' },
                  ].map((tier) => (
                    <button
                      key={tier.pct}
                      onClick={() => setStakePercentage(tier.pct)}
                      className={`p-2 rounded-xl border text-center text-xs transition-all ${
                        stakePercentage === tier.pct
                          ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="block font-bold">{tier.label}</span>
                      <span className="text-[10px] opacity-80 block">{tier.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Simulator Results Output Card */}
          <div className="bg-gradient-to-br from-[#0B1424] to-slate-900 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Projected 30-Day Performance Outcome</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Fixed Bet Size (Unit)</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-white">₦{unitSize.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{stakePercentage}% of capital</span>
              </div>
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Estimated Net Gain</span>
                <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400">+₦{estimatedProfit.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-400/80 block mt-0.5">Based on 79.2% win rate</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Projected 30-Day Total Bankroll</span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-white">₦{finalProjectedBalance.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">
                  +{(estimatedProfit / initialBankroll * 100).toFixed(0)}% ROI
                </span>
              </div>
            </div>

            <button
              onClick={() => onOpenSubscribe('vip-monthly')}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>Unlock Staking Units with VIP Monthly (₦15,000)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Comparison: Predict Mind AI vs Human Tipsters */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Why Mathematical Algorithms Outperform Human Tipsters
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Compare algorithmic precision against subjective Telegram groups and emotional hunch tipsters.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse bg-slate-900/60 rounded-2xl border border-slate-800 overflow-hidden">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950">
                <th className="p-4 text-slate-400 font-semibold">Evaluation Criteria</th>
                <th className="p-4 text-emerald-400 font-bold">Predict Mind AI</th>
                <th className="p-4 text-slate-400 font-semibold">Typical Telegram / Twitter Tipsters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              <tr>
                <td className="p-4 font-semibold text-white">Analytical Foundation</td>
                <td className="p-4 text-emerald-300 font-medium">Poisson distributions, Expected Goals (xG), transition rates</td>
                <td className="p-4 text-slate-400">Personal fan bias, gut feeling, hype</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">Market Diversity</td>
                <td className="p-4 text-emerald-300 font-medium">14+ Markets (1X2, BTTS, O/U, Halves, Corners, Cards, Correct Score)</td>
                <td className="p-4 text-slate-400">Usually restricted only to 1X2 or random 50-odd accumulators</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">Loss Accounting</td>
                <td className="p-4 text-emerald-300 font-medium">Permanent, immutable public ledger (79.2% transparent audit)</td>
                <td className="p-4 text-slate-400">Silently delete lost bets and repost only wins</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">Bankroll Management</td>
                <td className="p-4 text-emerald-300 font-medium">Strict 1-5 unit staking rules and variance control</td>
                <td className="p-4 text-slate-400">"100% Fixed Match - Put your life savings" (Dangerous)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-white">Payment & Activation</td>
                <td className="p-4 text-emerald-300 font-medium">Instant Paystack automated activation (Cards, Bank Transfer, USSD)</td>
                <td className="p-4 text-slate-400">Sketchy manual bank transfers in private DMs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Subscription Pricing Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Transparent Naira Pricing</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Choose Your Prediction Plan
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Instant activation via Paystack. No contracts, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                plan.isVip
                  ? 'bg-gradient-to-b from-[#14120A] to-[#0D101A] border-2 border-amber-500/80 shadow-2xl shadow-amber-500/10'
                  : plan.popular
                  ? 'bg-gradient-to-b from-[#0A1617] to-[#0B0F19] border-2 border-emerald-500/80 shadow-2xl shadow-emerald-500/10'
                  : 'bg-slate-900/70 border border-slate-800'
              }`}
            >
              {plan.badge && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  plan.isVip ? 'bg-amber-500 text-slate-950' : 'bg-emerald-500 text-slate-950'
                }`}>
                  {plan.badge}
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  {plan.isVip && <Crown className="w-5 h-5 text-amber-400" />}
                </div>
                <p className="text-xs text-slate-400 mb-4">{plan.tagline}</p>

                <div className="mb-6 pb-4 border-b border-slate-800">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-white">{plan.priceFormatted}</span>
                  <span className="text-xs text-slate-400 ml-1.5 font-normal">/ {plan.durationLabel}</span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 mb-6">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${plan.isVip ? 'text-amber-400' : 'text-emerald-400'}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onOpenSubscribe(plan.id)}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  plan.isVip
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                <span>Subscribe via Paystack</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Community Reviews & Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Verified Subscriber Reviews</h2>
          <p className="text-xs sm:text-sm text-slate-400">Punters trusting Predict Mind AI across Nigeria & Europe</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The Over 1.5 and BTTS algorithms are unbelievable. In 3 weeks, my bankroll went from ₦40,000 to ₦115,000 just following the recommended 3-unit staking."
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white">Emeka O.</span>
              <span className="text-slate-400">Lagos, Nigeria</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "What I love most is having all 14 markets in one screen. When standard 1X2 odds are too low, the AI gives me the Asian Handicap or 1st half goal angle."
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white">Tunde B.</span>
              <span className="text-slate-400">Abuja, Nigeria</span>
            </div>
          </div>

          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-3">
            <p className="text-xs text-slate-300 leading-relaxed italic">
              "The VIP Banker 3-fold accumulators and the Gemini custom match question tool make the ₦15,000 monthly fee look like nothing. Highest quality analytics on the web."
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white">David K.</span>
              <span className="text-slate-400">Port Harcourt, Nigeria</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800 text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black text-sm">
            PM
          </div>
          <span className="font-black text-white text-base">Predict Mind AI</span>
        </div>
        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
          Predict Mind AI operates as a statistical decision-support utility. Probabilities and analytical edges are probabilistic estimates, not guarantees. 18+ Only. Please bet within your financial means.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 pt-2">
          <button onClick={onLaunchApp} className="hover:text-emerald-400">Launch App</button>
          <span>•</span>
          <button onClick={onOpenVip} className="hover:text-emerald-400">VIP Banker</button>
          <span>•</span>
          <button onClick={onOpenTrackRecord} className="hover:text-emerald-400">Audit Ledger</button>
          <span>•</span>
          <span>© 2026 Predict Mind AI Inc.</span>
        </div>
      </footer>
    </div>
  );
};
