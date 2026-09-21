import React, { useState } from 'react';
import { FootballFixture, UserProfile } from '../types';
import { 
  Crown, Sparkles, Zap, ShieldCheck, Lock, 
  ArrowRight, Flame, BarChart2, CheckCircle2, Send, RefreshCw 
} from 'lucide-react';

interface VipSectionProps {
  fixtures: FootballFixture[];
  user: UserProfile;
  onOpenSubscribe: (planId?: 'weekly' | 'monthly' | 'vip-monthly') => void;
  onOpenModal: (fixture: FootballFixture) => void;
}

export const VipSection: React.FC<VipSectionProps> = ({
  fixtures,
  user,
  onOpenSubscribe,
  onOpenModal,
}) => {
  const isVip = user.currentPlan === 'vip-monthly';

  // State for Custom Match AI Generator
  const [customHome, setCustomHome] = useState('');
  const [customAway, setCustomAway] = useState('');
  const [customLeague, setCustomLeague] = useState('Domestic League');
  const [isAnalyzingCustom, setIsAnalyzingCustom] = useState(false);
  const [customAiResult, setCustomAiResult] = useState<any>(null);

  const vipFixtures = fixtures.filter((f) => f.aiPrediction.isVipOnly);
  const bankerFixture = vipFixtures[0] || fixtures[0];

  const handleAnalyzeCustomMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHome.trim() || !customAway.trim()) return;

    setIsAnalyzingCustom(true);
    try {
      const res = await fetch('/api/gemini/analyze-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeTeam: customHome,
          awayTeam: customAway,
          league: customLeague,
          vipMode: true,
          customQuery: 'VIP High-depth statistical match projection and value bet detection.',
        }),
      });

      const data = await res.json();
      setCustomAiResult(data.analysis);
    } catch (err) {
      console.error('Custom match analysis error:', err);
    } finally {
      setIsAnalyzingCustom(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* VIP Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-[#0F172A] border border-amber-500/40 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-3 uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            Predict Mind AI VIP Elite Suite
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            High-Value Banker Picks & <span className="text-amber-400">Algorithmic Edge</span>
          </h1>

          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            Reserved exclusively for our VIP Monthly members (₦15,000/month). Features 90%+ confidence single anchors, curated AI accumulators, custom match evaluations, and tactical corner/card angles.
          </p>

          {!isVip && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onOpenSubscribe('vip-monthly')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                <span>Join VIP Monthly — ₦15,000</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Instant Paystack Activation • Cancel Anytime
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Grid of VIP Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Banker of the Day */}
        <div className="lg:col-span-2 bg-[#0E1422] border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">VIP Banker of the Day</h3>
                <span className="text-xs text-slate-400">Highest Historical Model Confidence (91%)</span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Confidence: 91%
            </span>
          </div>

          {/* Fixture Details */}
          <div className="py-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-400 font-semibold">{bankerFixture.league} • {bankerFixture.round}</span>
              <span className="text-xs font-mono text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                Kickoff: {bankerFixture.time} GMT
              </span>
            </div>

            <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800 mb-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${bankerFixture.homeTeam.logoColor} flex items-center justify-center font-bold text-white text-xs`}>
                  {bankerFixture.homeTeam.initials}
                </div>
                <span className="font-bold text-white text-base">{bankerFixture.homeTeam.name}</span>
              </div>

              <div className="text-xs font-bold text-slate-500 px-3 py-1 rounded-full bg-slate-950">
                VS
              </div>

              <div className="flex items-center gap-2.5">
                <span className="font-bold text-white text-base">{bankerFixture.awayTeam.name}</span>
                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${bankerFixture.awayTeam.logoColor} flex items-center justify-center font-bold text-white text-xs`}>
                  {bankerFixture.awayTeam.initials}
                </div>
              </div>
            </div>

            {/* Banker Tip Display / Blur */}
            {isVip ? (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">Primary VIP Tip:</span>
                  <span className="text-xs font-mono text-slate-300">Staking: 5 Units</span>
                </div>
                <h4 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{bankerFixture.aiPrediction.primaryTip}</span>
                </h4>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {bankerFixture.aiPrediction.vipInsight || bankerFixture.aiPrediction.keyStatEdge}
                </p>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-center relative overflow-hidden backdrop-blur-sm">
                <Lock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <h4 className="font-bold text-white text-sm">VIP Banker Pick Hidden</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  Unlocked exclusively for VIP Monthly subscribers. Historical win rate for Banker picks exceeds 88% over past 120 selections.
                </p>
                <button
                  onClick={() => onOpenSubscribe('vip-monthly')}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  Unlock Banker Pick via Paystack
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenModal(bankerFixture)}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-all"
          >
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <span>View Full Statistical Breakdown & Gemini Tactical Analysis</span>
          </button>
        </div>

        {/* Card 2: AI Super Combo / Accumulator */}
        <div className="bg-[#0E1422] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">AI Super Accumulator</h3>
                <span className="text-xs text-slate-400">3-Fold Optimized Value Slip</span>
              </div>
            </div>

            <div className="my-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Combined Slip Odds:</span>
              <span className="text-lg font-mono font-extrabold text-emerald-400">4.85x</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80 text-xs">
                <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                  <span>Arsenal vs Chelsea</span>
                  <span className="font-mono text-emerald-400 font-semibold">1.78</span>
                </div>
                <div className="font-bold text-white">Arsenal Win & Over 1.5 Goals</div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80 text-xs">
                <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                  <span>Real Madrid vs Bayern Munich</span>
                  <span className="font-mono text-emerald-400 font-semibold">1.50</span>
                </div>
                <div className="font-bold text-white">Both Teams to Score (BTTS - Yes)</div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800/80 text-xs">
                <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                  <span>Atletico Madrid vs Sevilla</span>
                  <span className="font-mono text-emerald-400 font-semibold">1.82</span>
                </div>
                <div className="font-bold text-white">
                  {isVip ? 'Atletico Madrid Win & Under 3.5' : '•••••• [VIP Hidden Pick]'}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            {isVip ? (
              <div className="text-xs text-center text-emerald-400 font-semibold">
                ✓ Full 3-Fold Slip Unlocked • Recommended Stake: 2% Bankroll
              </div>
            ) : (
              <button
                onClick={() => onOpenSubscribe('vip-monthly')}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all"
              >
                Unlock VIP Combo Slip (₦15,000)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card 3: Custom Match AI Generator (Interactive Tool) */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
              VIP On-Demand Tool
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Custom Match AI Engine (Powered by Gemini 3.8 Flash)
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Analyze any custom fixture across the globe. Our server-side Gemini AI evaluates team statistics, expected goals, and betting probabilities.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Ready</span>
          </div>
        </div>

        <form onSubmit={handleAnalyzeCustomMatch} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Home Team</label>
            <input
              type="text"
              value={customHome}
              onChange={(e) => setCustomHome(e.target.value)}
              placeholder="e.g. Barcelona"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Away Team</label>
            <input
              type="text"
              value={customAway}
              onChange={(e) => setCustomAway(e.target.value)}
              placeholder="e.g. Napoli"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">League / Competition</label>
            <input
              type="text"
              value={customLeague}
              onChange={(e) => setCustomLeague(e.target.value)}
              placeholder="e.g. Champions League"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isAnalyzingCustom}
              className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              {isAnalyzingCustom ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Generate AI Insight</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Custom AI Result Display */}
        {customAiResult && (
          <div className="p-5 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white text-sm">
                AI Assessment: {customHome} vs {customAway}
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                Confidence: {customAiResult.confidenceScore}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Recommended Market</span>
                <span className="font-bold text-emerald-400 text-xs">{customAiResult.primaryTip}</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Projected Total xG</span>
                <span className="font-bold text-white text-xs">{customAiResult.expectedGoals?.totalXG || 2.8}</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Risk Evaluation</span>
                <span className="font-bold text-emerald-400 text-xs">{customAiResult.riskAssessment || 'Low'}</span>
              </div>
            </div>

            <p className="text-slate-300 leading-relaxed">
              <strong>Tactical Breakdown:</strong> {customAiResult.tacticalBreakdown}
            </p>
            <p className="text-amber-300 font-medium">
              <strong>VIP Edge:</strong> {customAiResult.vipExclusiveInsight}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
