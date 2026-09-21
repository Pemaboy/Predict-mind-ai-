import React, { useState } from 'react';
import { FootballFixture, UserProfile } from '../types';
import { 
  Lock, Sparkles, TrendingUp, ChevronRight, Crown, 
  ShieldAlert, BarChart3, Clock, CheckCircle2, ChevronDown, 
  Layers, Target, Compass, Flame 
} from 'lucide-react';
import { calculateAllMarkets } from '../utils/marketGenerator';

interface FixtureCardProps {
  fixture: FootballFixture;
  user: UserProfile;
  onOpenModal: (fixture: FootballFixture) => void;
  onOpenSubscribe: (planId?: 'weekly' | 'monthly' | 'vip-monthly') => void;
}

export const FixtureCard: React.FC<FixtureCardProps> = ({
  fixture,
  user,
  onOpenModal,
  onOpenSubscribe,
}) => {
  const [showAllMarkets, setShowAllMarkets] = useState(false);
  const [activeMarketCategory, setActiveMarketCategory] = useState<'All' | 'Goals' | 'Match' | 'Halves' | 'Corners/Cards' | 'Scores'>('All');

  const isVipUser = user.currentPlan === 'vip-monthly';
  const isStandardSubscriber = user.currentPlan === 'weekly' || user.currentPlan === 'monthly' || isVipUser;

  const isUnlocked =
    fixture.aiPrediction.isFreeTeaser ||
    (fixture.aiPrediction.isVipOnly ? isVipUser : isStandardSubscriber);

  const getFormColor = (char: 'W' | 'D' | 'L') => {
    if (char === 'W') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    if (char === 'D') return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (conf >= 75) return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  };

  const allMarkets = fixture.aiPrediction.allMarkets || calculateAllMarkets(fixture);

  const marketList = [
    allMarkets.matchResult,
    allMarkets.doubleChance,
    allMarkets.drawNoBet,
    allMarkets.overUnder15,
    allMarkets.overUnder25,
    allMarkets.overUnder35,
    allMarkets.btts,
    allMarkets.halfTimeFullTime,
    allMarkets.firstHalfGoals,
    allMarkets.corners,
    allMarkets.cards,
    allMarkets.handicap,
    allMarkets.winEitherHalf,
  ];

  const filteredMarketList = activeMarketCategory === 'All'
    ? marketList
    : marketList.filter((m) => m.category === activeMarketCategory);

  return (
    <div 
      id={`fixture-${fixture.id}`}
      className="bg-[#0E1422] border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all shadow-md hover:shadow-xl relative flex flex-col justify-between"
    >
      {/* Card Header: League, Round, Kickoff */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">{fixture.league}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{fixture.round}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium text-[11px] text-slate-200">
              {fixture.time} GMT
            </span>
          </div>
        </div>

        {/* Teams Matchup & Form */}
        <div className="grid grid-cols-5 items-center gap-2 py-2">
          {/* Home Team */}
          <div className="col-span-2 text-left">
            <div className="flex items-center gap-2 mb-1.5">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${fixture.homeTeam.logoColor} flex items-center justify-center text-white font-black text-xs shadow-sm`}>
                {fixture.homeTeam.initials}
              </div>
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base leading-tight truncate">
                  {fixture.homeTeam.name}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  #{fixture.homeTeam.leaguePosition} in Table
                </span>
              </div>
            </div>
            {/* Form */}
            <div className="flex items-center gap-1">
              {fixture.homeTeam.form.map((f, i) => (
                <span key={i} className={`w-4 h-4 rounded text-[9px] font-bold border flex items-center justify-center ${getFormColor(f)}`}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* VS Center Marker */}
          <div className="col-span-1 text-center">
            <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400 text-xs font-bold">
              VS
            </div>
            <span className="text-[10px] text-slate-500 mt-1 block">Head-to-Head</span>
          </div>

          {/* Away Team */}
          <div className="col-span-2 text-right">
            <div className="flex items-center justify-end gap-2 mb-1.5">
              <div>
                <h4 className="font-bold text-white text-sm sm:text-base leading-tight truncate">
                  {fixture.awayTeam.name}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  #{fixture.awayTeam.leaguePosition} in Table
                </span>
              </div>
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${fixture.awayTeam.logoColor} flex items-center justify-center text-white font-black text-xs shadow-sm`}>
                {fixture.awayTeam.initials}
              </div>
            </div>
            {/* Form */}
            <div className="flex items-center justify-end gap-1">
              {fixture.awayTeam.form.map((f, i) => (
                <span key={i} className={`w-4 h-4 rounded text-[9px] font-bold border flex items-center justify-center ${getFormColor(f)}`}>
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live Market Odds Preview */}
        <div className="grid grid-cols-3 gap-2 mt-3 mb-4">
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-mono">1 (Home)</span>
            <span className="text-xs font-bold text-slate-200">{fixture.odds.homeWin.toFixed(2)}</span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-mono">X (Draw)</span>
            <span className="text-xs font-bold text-slate-200">{fixture.odds.draw.toFixed(2)}</span>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-mono">2 (Away)</span>
            <span className="text-xs font-bold text-slate-200">{fixture.odds.awayWin.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* AI Prediction Area */}
      <div className="mt-2">
        {isUnlocked ? (
          /* Unlocked AI Prediction View */
          <div className={`p-4 rounded-xl border relative overflow-hidden ${
            fixture.aiPrediction.isVipOnly
              ? 'bg-amber-950/20 border-amber-500/40'
              : 'bg-emerald-950/20 border-emerald-500/40'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                {fixture.aiPrediction.isVipOnly ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Crown className="w-3 h-3" /> VIP Banker Pick
                  </span>
                ) : fixture.aiPrediction.isFreeTeaser ? (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Sparkles className="w-3 h-3" /> Free Daily Preview
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <TrendingUp className="w-3 h-3" /> AI Pro Forecast
                  </span>
                )}
                <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {fixture.aiPrediction.market}
                </span>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  14+ Markets Ready
                </span>
              </div>

              {/* Confidence Gauge */}
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-bold font-mono ${getConfidenceColor(fixture.aiPrediction.confidence)}`}>
                <span>{fixture.aiPrediction.confidence}%</span>
                <span className="text-[10px] font-normal text-slate-400">conf.</span>
              </div>
            </div>

            {/* Primary Tip Headline */}
            <div className="mb-2">
              <h5 className="text-white font-extrabold text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{fixture.aiPrediction.primaryTip}</span>
              </h5>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                {fixture.aiPrediction.keyStatEdge}
              </p>
            </div>

            {/* Probability Percentages Bar */}
            <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] font-mono">
              <div className="bg-slate-900/80 px-2 py-1 rounded text-center">
                <span className="text-slate-400 block text-[9px]">1 (Home)</span>
                <span className="font-bold text-slate-200">{fixture.aiPrediction.probabilities.homeWin}%</span>
              </div>
              <div className="bg-slate-900/80 px-2 py-1 rounded text-center">
                <span className="text-slate-400 block text-[9px]">Over 2.5</span>
                <span className="font-bold text-emerald-400">{fixture.aiPrediction.probabilities.over25}%</span>
              </div>
              <div className="bg-slate-900/80 px-2 py-1 rounded text-center">
                <span className="text-slate-400 block text-[9px]">BTTS Yes</span>
                <span className="font-bold text-blue-400">{fixture.aiPrediction.probabilities.bttsYes}%</span>
              </div>
            </div>

            {/* Expand / Collapse All 14+ Markets Toggle */}
            <div className="mt-3 pt-2.5 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowAllMarkets(!showAllMarkets)}
                className="w-full flex items-center justify-between text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors py-1"
              >
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{showAllMarkets ? 'Collapse Markets Suite' : 'View All 14+ Predicted Markets (1X2, Goals, Halves, Corners)'}</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllMarkets ? 'rotate-180' : ''}`} />
              </button>

              {/* Expanded All Markets Matrix */}
              {showAllMarkets && (
                <div className="mt-3 space-y-2.5 pt-2 border-t border-slate-800/60 animate-in fade-in duration-200">
                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] no-scrollbar">
                    {(['All', 'Goals', 'Match', 'Halves', 'Corners/Cards', 'Scores'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveMarketCategory(cat)}
                        className={`px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                          activeMarketCategory === cat
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Market Items Grid */}
                  {activeMarketCategory !== 'Scores' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                      {filteredMarketList.map((m) => (
                        <div 
                          key={m.marketCode} 
                          className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 hover:border-emerald-500/30 transition-all text-xs"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] text-slate-400 truncate">{m.marketName}</span>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold">
                              {m.confidence}%
                            </span>
                          </div>
                          <div className="flex items-center justify-between font-semibold text-slate-100 text-[11px]">
                            <span className="truncate text-white">{m.pick}</span>
                            <span className="text-slate-400 font-mono text-[10px] ml-1 shrink-0">
                              @{m.estimatedOdds.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Projected Correct Scores View */
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Projected Correct Scores (Algorithmic Probabilities)
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {allMarkets.correctScores.map((cs) => (
                          <div key={cs.score} className="bg-slate-950/80 p-2 rounded border border-slate-800 text-center">
                            <span className="text-xs font-mono font-bold text-white block">{cs.score}</span>
                            <span className="text-[10px] text-emerald-400 font-semibold">{cs.probability}% Prob.</span>
                            <span className="text-[9px] text-slate-500 block">@{cs.odds.toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Locked State for Non-Subscribers or Non-VIP */
          <div className={`p-4 rounded-xl border relative overflow-hidden backdrop-blur-sm ${
            fixture.aiPrediction.isVipOnly
              ? 'bg-amber-950/15 border-amber-500/30'
              : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {fixture.aiPrediction.isVipOnly ? (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Crown className="w-3 h-3 text-amber-400" /> VIP Exclusive Match
                </span>
              ) : (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  <Lock className="w-3 h-3 text-slate-400" /> All 14+ Markets Locked
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 py-1">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                fixture.aiPrediction.isVipOnly ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-white text-xs sm:text-sm">
                  {fixture.aiPrediction.isVipOnly ? 'VIP Banker & Full Market Suite Locked' : '14+ AI Prediction Markets Locked'}
                </h5>
                <p className="text-[11px] text-slate-400">
                  {fixture.aiPrediction.isVipOnly
                    ? 'Requires VIP Monthly (₦15,000) for highest edge bankroll picks and custom AI.'
                    : 'Subscribe Weekly (₦5,000) or Monthly (₦10,000) to reveal full 14+ markets.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenSubscribe(fixture.aiPrediction.isVipOnly ? 'vip-monthly' : 'monthly')}
              className={`w-full mt-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-98 ${
                fixture.aiPrediction.isVipOnly
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              <span>Unlock All Markets with Paystack</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* View Deep Analysis Button */}
        <button
          onClick={() => onOpenModal(fixture)}
          className="w-full mt-3 py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Deep Match Stats & Gemini AI Breakdown (All Markets)</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
};
