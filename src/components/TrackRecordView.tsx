import React, { useState } from 'react';
import { MOCK_HISTORICAL_TIPS } from '../data/mockFootballData';
import { HistoricalTip } from '../types';
import { 
  TrendingUp, CheckCircle2, XCircle, ShieldCheck, 
  BarChart3, Filter, Award, Sparkles 
} from 'lucide-react';

export const TrackRecordView: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');

  const filteredTips = MOCK_HISTORICAL_TIPS.filter((tip) => {
    if (selectedMarket !== 'All' && !tip.market.toLowerCase().includes(selectedMarket.toLowerCase())) {
      return false;
    }
    if (selectedTier !== 'All' && tip.tier !== selectedTier) {
      return false;
    }
    return true;
  });

  const totalWon = MOCK_HISTORICAL_TIPS.filter((t) => t.outcome === 'WON').length;
  const winRate = Math.round((totalWon / MOCK_HISTORICAL_TIPS.length) * 100);

  return (
    <div className="space-y-8">
      {/* Header & Verification Metric Cards */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Verified Historical Records
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Prediction Performance & Track Record
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Complete transparency in all sporting projections. Every tip is recorded prior to kickoff and audited against final official results.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-800 shrink-0">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Audited Performance v4.2</span>
          </div>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0E1422] p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Overall Win Rate</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">{winRate}%</span>
              <span className="text-[11px] text-slate-500">Historical</span>
            </div>
            <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${winRate}%` }}></div>
            </div>
          </div>

          <div className="bg-[#0E1422] p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Total Verified Tips</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">512</span>
              <span className="text-[11px] text-slate-500">Documented</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">Top 6 European Leagues + NPFL</span>
          </div>

          <div className="bg-[#0E1422] p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Net ROI / Yield</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">+34.2%</span>
              <span className="text-[11px] text-emerald-500 font-semibold">Positive EV</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">Flat 2-unit staking model</span>
          </div>

          <div className="bg-[#0E1422] p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">Current Active Streak</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">6 Wins</span>
              <span className="text-[11px] text-amber-500">Unbroken</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-2 block">Weekend Premier & UCL slates</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-300 font-semibold">Filter by Market:</span>
          {['All', '1X2', 'Over/Under', 'BTTS', 'Double Chance'].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMarket(m)}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedMarket === m
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-300 font-semibold">Tier:</span>
          {['All', 'Standard', 'VIP'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedTier === t
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#0E1422] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">League</th>
                <th className="py-3.5 px-4">Matchup</th>
                <th className="py-3.5 px-4">AI Prediction</th>
                <th className="py-3.5 px-4 text-center">Odds</th>
                <th className="py-3.5 px-4 text-center">Final Score</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTips.map((tip) => (
                <tr key={tip.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">{tip.date}</td>
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">{tip.league}</td>
                  <td className="py-3 px-4 font-bold text-white whitespace-nowrap">{tip.match}</td>
                  <td className="py-3 px-4 text-slate-200">
                    <span className="font-semibold text-emerald-400">{tip.prediction}</span>
                    <span className="text-[10px] text-slate-500 block font-mono">({tip.market})</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-300">
                    {tip.odds.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-white bg-slate-950/40">
                    {tip.score}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {tip.outcome === 'WON' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <CheckCircle2 className="w-3 h-3" /> WON
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        <XCircle className="w-3 h-3" /> LOST
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-300">
                    {tip.confidence}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transparency & Disclaimer Box */}
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 text-xs text-slate-400 space-y-2">
        <h4 className="font-bold text-slate-200 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Predict Mind AI Integrity & Mathematical Commitment
        </h4>
        <p className="leading-relaxed">
          Unlike tipster platforms that delete losing predictions, Predict Mind AI maintains a transparent, permanent ledger. Sports betting inherently carries financial risk; our algorithms calculate mathematical advantages (Expected Value) to optimize long-term bankroll growth, not guarantee single matches. Always bet within predefined personal limits.
        </p>
      </div>
    </div>
  );
};
