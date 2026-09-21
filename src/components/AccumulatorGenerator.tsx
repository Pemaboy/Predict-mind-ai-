import React, { useState } from 'react';
import { AccumulatorSlip, BookmakerName, SlipRiskLevel, UserProfile } from '../types';
import { generateAccumulatorSlip, getBookmakerUrl } from '../utils/slipGenerator';
import { 
  Sparkles, Copy, Check, ExternalLink, RefreshCw, 
  ShieldCheck, Zap, Flame, Trophy, TrendingUp, AlertCircle, 
  CheckCircle2, Share2, Coins, ArrowRight, Lock, Crown 
} from 'lucide-react';

interface AccumulatorGeneratorProps {
  user: UserProfile;
  onOpenSubscribe?: () => void;
}

const BOOKMAKERS: { name: BookmakerName; color: string; badge: string }[] = [
  { name: 'SportyBet', color: 'from-red-600 to-rose-700', badge: 'Most Popular' },
  { name: 'Bet9ja', color: 'from-emerald-700 to-green-800', badge: 'Fast Code' },
  { name: '1xBet', color: 'from-blue-600 to-cyan-700', badge: 'High Odds' },
  { name: 'BetKing', color: 'from-amber-600 to-yellow-700', badge: 'Nigeria' },
  { name: 'MSport', color: 'from-purple-600 to-indigo-800', badge: 'Instant Bet' },
  { name: 'Betway', color: 'from-slate-800 to-slate-950', badge: 'Global' },
];

export const AccumulatorGenerator: React.FC<AccumulatorGeneratorProps> = ({
  user,
  onOpenSubscribe,
}) => {
  const [selectedBookmaker, setSelectedBookmaker] = useState<BookmakerName>('SportyBet');
  const [targetOddsPreset, setTargetOddsPreset] = useState<'2' | '5' | '10' | '25' | 'custom'>('5');
  const [customOdds, setCustomOdds] = useState<number>(5.0);
  const [riskLevel, setRiskLevel] = useState<SlipRiskLevel>('banker');
  const [preferredMarket, setPreferredMarket] = useState<'all' | '1x2' | 'goals' | 'double-chance'>('all');
  const [stakeAmount, setStakeAmount] = useState<number>(2000);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [slip, setSlip] = useState<AccumulatorSlip>(() => 
    generateAccumulatorSlip({
      bookmaker: 'SportyBet',
      targetOddsRange: '5',
      riskLevel: 'banker',
      stakeAmount: 2000,
    })
  );
  
  const [copiedCode, setCopiedCode] = useState(false);
  const isSubscribed = user.currentPlan !== 'free';

  const handleGenerate = () => {
    setIsGenerating(true);
    setCopiedCode(false);

    setTimeout(() => {
      const newSlip = generateAccumulatorSlip({
        bookmaker: selectedBookmaker,
        targetOddsRange: targetOddsPreset,
        customTargetOdds: customOdds,
        riskLevel,
        preferredMarket,
        stakeAmount,
      });
      setSlip(newSlip);
      setIsGenerating(false);
    }, 450);
  };

  const handleCopyCode = () => {
    if (!isSubscribed) {
      if (onOpenSubscribe) {
        onOpenSubscribe();
      }
      return;
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(slip.bookingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handleStakeChange = (newStake: number) => {
    setStakeAmount(newStake);
    setSlip((prev) => ({
      ...prev,
      stakeAmount: newStake,
      potentialReturn: Math.round(newStake * prev.totalOdds),
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          AI Accumulator Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Generate AI Match Slips & <span className="text-emerald-400">Booking Codes</span>
        </h1>
        <p className="mt-2 text-slate-300 text-xs sm:text-sm">
          Select your bookmaker, choose your target odds multiplier, and let the AI scan today's fixtures to build an optimal ticket with instant booking codes.
        </p>
      </div>

      {/* Generator Control Panel */}
      <div className="bg-[#0E1422] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
        <div className="space-y-6">
          {/* 1. Bookmaker Selection */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2.5">
              1. Select Your Bookmaker
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {BOOKMAKERS.map((b) => {
                const isSelected = selectedBookmaker === b.name;
                return (
                  <button
                    key={b.name}
                    onClick={() => {
                      setSelectedBookmaker(b.name);
                      setSlip((prev) => ({
                        ...prev,
                        bookmaker: b.name,
                      }));
                    }}
                    className={`relative p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="font-bold text-sm text-white">{b.name}</div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{b.badge}</span>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Target Odds Multiplier */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                2. Target Total Odds Multiplier
              </label>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                Target: {targetOddsPreset === 'custom' ? `${customOdds}x` : `${targetOddsPreset}x`}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: '2', label: '2.00x Banker', desc: 'Safe 2-3 Games' },
                { id: '5', label: '5.00x Value', desc: 'Optimal 3-5 Games' },
                { id: '10', label: '10.00x Acca', desc: 'High Return 5-7 Games' },
                { id: '25', label: '25.00x+ Mega', desc: 'Jackpot Multiplier' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTargetOddsPreset(opt.id as any)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    targetOddsPreset === opt.id
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="font-bold text-sm text-white">{opt.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Strategy & Market Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                3. Risk Profile
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'banker', label: 'Banker Safe', icon: ShieldCheck },
                  { id: 'balanced', label: 'Balanced', icon: Zap },
                  { id: 'aggressive', label: 'Aggressive', icon: Flame },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = riskLevel === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setRiskLevel(item.id as any)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                4. Preferred Markets
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'all', label: 'All Markets' },
                  { id: '1x2', label: 'Match 1X2' },
                  { id: 'goals', label: 'Goals & BTTS' },
                  { id: 'double-chance', label: 'Double Chance' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPreferredMarket(m.id as any)}
                    className={`py-2 px-2 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                      preferredMarket === m.id
                        ? 'bg-teal-500/20 border-teal-500/60 text-teal-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-900'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-2">
            <button
              id="btn-generate-ai-slip"
              disabled={isGenerating}
              onClick={handleGenerate}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-base shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing Match Engine & Generating Booking Code...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate {selectedBookmaker} Slip & Booking Code</span>
                  <ArrowRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Slip Presentation Ticket */}
      {slip && (
        <div 
          id="generated-slip-ticket"
          className="relative bg-gradient-to-b from-[#111927] to-[#0A0E17] border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-500/10 overflow-hidden"
        >
          {/* Top Ticket Header with Booking Code Highlight */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {slip.bookmaker} AI Ticket
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {slip.legsCount} Matches • Generated {slip.generatedAt}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {slip.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{slip.riskProfile}</p>
            </div>

            {/* Booking Code Box with Subscription Guard */}
            <div className={`w-full md:w-auto border-2 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-lg ${
              isSubscribed
                ? 'bg-slate-950/90 border-emerald-500/60'
                : 'bg-gradient-to-r from-amber-950/30 to-slate-950 border-amber-500/50'
            }`}>
              {isSubscribed ? (
                <>
                  <div className="text-center sm:text-left">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block font-mono">
                      {slip.bookmaker} Booking Code
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-wider select-all">
                      {slip.bookingCode}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      id="btn-copy-booking-code"
                      onClick={handleCopyCode}
                      className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                        copiedCode
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                      }`}
                    >
                      {copiedCode ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>

                    <a
                      href={getBookmakerUrl(slip.bookmaker, slip.bookingCode)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1 transition-all border border-slate-700"
                    >
                      <span>Open {slip.bookmaker}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 text-amber-400 mb-0.5">
                      <Lock className="w-3.5 h-3.5" />
                      <span className="text-[10px] uppercase tracking-wider font-extrabold font-mono">
                        {slip.bookmaker} Booking Code (Locked)
                      </span>
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-500 font-mono tracking-widest select-none">
                      {slip.bookmaker === 'SportyBet' ? 'BC••••••' : slip.bookmaker === 'Bet9ja' ? 'B9-••••••' : '1X-••••••'}
                    </div>
                  </div>

                  <button
                    id="btn-unlock-booking-code"
                    onClick={onOpenSubscribe}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 active:scale-95 shadow-amber-500/20"
                  >
                    <Crown className="w-4 h-4 fill-slate-950" />
                    <span>Subscribe to Reveal Code</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Paywall Callout Banner if not subscribed */}
          {!isSubscribed && (
            <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-950 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Subscription Required for Booking Codes</span>
                    <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black uppercase">
                      Paystack
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Pay for subscription with Paystack (Card, Bank Transfer, USSD) to reveal today's booking code & all hidden matches instantly.
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenSubscribe}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5 fill-slate-950" />
                <span>Pay Subscription</span>
              </button>
            </div>
          )}

          {/* Ticket Stats & Bankroll Return Projection */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 py-4 px-4 bg-slate-950/50 rounded-2xl border border-slate-800/80">
            <div>
              <span className="text-[11px] text-slate-400 font-mono block">Combined Odds</span>
              <span className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
                {slip.totalOdds}x
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-mono block">AI Confidence</span>
              <span className="text-2xl font-black text-white font-mono tracking-tight">
                {slip.averageConfidence}%
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-mono block">Stake Simulation</span>
              <div className="flex items-center gap-1 mt-0.5">
                {[1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => handleStakeChange(amt)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                      stakeAmount === amt
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    ₦{amt / 1000}k
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-mono block">Potential Return</span>
              <span className="text-2xl font-black text-amber-400 font-mono tracking-tight">
                ₦{slip.potentialReturn.toLocaleString()}
              </span>
            </div>
          </div>

          {/* List of Match Legs in this Slip */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider px-1">
              <span>Selected Matches ({slip.legs.length})</span>
              <span>Odds & Confidence</span>
            </div>

            {slip.legs.map((leg, index) => {
              const isLegLocked = !isSubscribed && index > 0;

              return (
                <div
                  key={`${leg.fixtureId}-${index}`}
                  className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all relative overflow-hidden ${
                    isLegLocked
                      ? 'bg-slate-900/40 border-slate-800/60'
                      : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{leg.match}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {leg.league}
                        </span>
                        {!isSubscribed && index === 0 && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold">
                            Free Preview
                          </span>
                        )}
                      </div>

                      {isLegLocked ? (
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Pick: [Locked - Subscribers Only]</span>
                          </span>
                          <button
                            onClick={onOpenSubscribe}
                            className="text-[10px] text-emerald-400 underline hover:text-emerald-300 font-semibold"
                          >
                            Unlock pick
                          </button>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs font-extrabold text-emerald-400">
                            Pick: {leg.pick}
                          </span>
                          <span className="text-[11px] text-slate-400">({leg.marketName})</span>
                        </div>
                      )}

                      <p className={`text-[11px] mt-1 leading-snug ${isLegLocked ? 'text-slate-500 italic' : 'text-slate-400'}`}>
                        {isLegLocked ? '🔒 Tactical breakdown & market pick reserved for active subscribers.' : `💡 ${leg.rationale}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800 shrink-0">
                    <span className="text-base font-black text-white font-mono">
                      {isLegLocked ? '•••' : leg.odds.toFixed(2)}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-medium">
                      {leg.confidence}% Conf.
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {isSubscribed
                  ? `Copy code directly into ${slip.bookmaker}'s betslip or search bar.`
                  : `Subscribe to unlock instant loadable ${slip.bookmaker} booking codes.`}
              </span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleGenerate}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate Another Slip</span>
              </button>

              {isSubscribed ? (
                <button
                  onClick={handleCopyCode}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode ? 'Copied!' : `Copy ${slip.bookmaker} Code`}</span>
                </button>
              ) : (
                <button
                  onClick={onOpenSubscribe}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 active:scale-95"
                >
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>Subscribe to Reveal Code</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
