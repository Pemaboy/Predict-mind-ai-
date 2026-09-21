import React, { useState } from 'react';
import { FootballFixture, UserProfile } from '../types';
import { 
  X, Sparkles, TrendingUp, ShieldCheck, Crown, 
  BarChart3, RefreshCw, Send, AlertCircle, CheckCircle2, Layers 
} from 'lucide-react';
import { calculateAllMarkets } from '../utils/marketGenerator';

interface MatchDetailModalProps {
  fixture: FootballFixture | null;
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onOpenSubscribe: (planId?: 'weekly' | 'monthly' | 'vip-monthly') => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  fixture,
  isOpen,
  onClose,
  user,
  onOpenSubscribe,
}) => {
  if (!isOpen || !fixture) return null;

  const isVipUser = user.currentPlan === 'vip-monthly';
  const isSubscriber = user.currentPlan !== 'free';

  const [modalTab, setModalTab] = useState<'tactical' | 'all-markets' | 'stats'>('tactical');
  const [activeMarketCat, setActiveMarketCat] = useState<'All' | 'Goals' | 'Match' | 'Halves' | 'Corners/Cards' | 'Scores'>('All');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [aiError, setAiError] = useState<string | null>(null);

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

  const filteredMarketList = activeMarketCat === 'All'
    ? marketList
    : marketList.filter((m) => m.category === activeMarketCat);

  const handleRunGeminiAnalysis = async (customPrompt?: string) => {
    setIsLoadingAi(true);
    setAiError(null);
    try {
      const res = await fetch('/api/gemini/analyze-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeTeam: fixture.homeTeam.name,
          awayTeam: fixture.awayTeam.name,
          league: fixture.league,
          kickoff: `${fixture.date} ${fixture.time}`,
          homeForm: fixture.homeTeam.form.join('-'),
          awayForm: fixture.awayTeam.form.join('-'),
          headToHead: `${fixture.headToHead.homeWins}H / ${fixture.headToHead.draws}D / ${fixture.headToHead.awayWins}A (Avg ${fixture.headToHead.avgGoalsPerGame} goals)`,
          vipMode: isVipUser,
          customQuery: customPrompt || customQuestion,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate AI analysis');
      }

      setAiAnalysis(data.analysis);
    } catch (err: any) {
      console.error('Error generating AI analysis:', err);
      setAiError(err.message || 'Unable to connect to AI engine. Using local quantitative model.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const currentAnalysis = aiAnalysis || {
    confidenceScore: fixture.aiPrediction.confidence,
    primaryTip: fixture.aiPrediction.primaryTip,
    recommendedMarket: fixture.aiPrediction.market,
    expectedGoals: fixture.aiPrediction.expectedGoals,
    marketProbabilities: {
      homeWinPercent: fixture.aiPrediction.probabilities.homeWin,
      drawPercent: fixture.aiPrediction.probabilities.draw,
      awayWinPercent: fixture.aiPrediction.probabilities.awayWin,
      over25Percent: fixture.aiPrediction.probabilities.over25,
      bttsYesPercent: fixture.aiPrediction.probabilities.bttsYes,
    },
    tacticalBreakdown: fixture.aiPrediction.tacticalSummary,
    keyStatisticalEdge: fixture.aiPrediction.keyStatEdge,
    riskAssessment: fixture.aiPrediction.riskLevel,
    vipExclusiveInsight: fixture.aiPrediction.vipInsight || 'High tactical correlation between home territorial possession and first half goal output.',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        id="match-detail-modal"
        className="relative w-full max-w-4xl bg-[#0B0F19] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                {fixture.league}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">{fixture.round}</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400">{fixture.venue}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white mt-0.5">
              {fixture.homeTeam.name} vs {fixture.awayTeam.name}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 pb-2 bg-slate-900/60 border-b border-slate-800/80 text-xs font-semibold overflow-x-auto shrink-0">
          <button
            onClick={() => setModalTab('tactical')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              modalTab === 'tactical'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Tactical & xG</span>
          </button>

          <button
            onClick={() => setModalTab('all-markets')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              modalTab === 'all-markets'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All 14+ Markets Suite</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono">14</span>
          </button>

          <button
            onClick={() => setModalTab('stats')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              modalTab === 'stats'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>H2H & Form</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Match Scoreboard / Head-to-Head Banner */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5">
            <div className="grid grid-cols-5 items-center text-center gap-2">
              {/* Home */}
              <div className="col-span-2 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${fixture.homeTeam.logoColor} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                    {fixture.homeTeam.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight">{fixture.homeTeam.name}</h4>
                    <span className="text-xs text-slate-400">Position #{fixture.homeTeam.leaguePosition}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <p>Goals: <span className="text-white font-mono">{fixture.homeTeam.goalsScored} scored / {fixture.homeTeam.goalsConceded} conceded</span></p>
                  <p>Possession: <span className="text-white font-mono">{fixture.homeTeam.avgPossession}%</span></p>
                  <p>Clean Sheets: <span className="text-emerald-400 font-mono">{fixture.homeTeam.cleanSheets}</span></p>
                </div>
              </div>

              {/* Center VS & H2H */}
              <div className="col-span-1">
                <div className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded inline-block mb-1">
                  {fixture.time}
                </div>
                <div className="text-[11px] text-slate-400">
                  <span>H2H Past {fixture.headToHead.totalGames} Games:</span>
                  <div className="font-mono text-white text-xs font-bold mt-0.5">
                    {fixture.headToHead.homeWins}W - {fixture.headToHead.draws}D - {fixture.headToHead.awayWins}W
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Avg {fixture.headToHead.avgGoalsPerGame} goals/game
                  </span>
                </div>
              </div>

              {/* Away */}
              <div className="col-span-2 text-right">
                <div className="flex items-center justify-end gap-3 mb-2">
                  <div>
                    <h4 className="font-bold text-white text-base leading-tight">{fixture.awayTeam.name}</h4>
                    <span className="text-xs text-slate-400">Position #{fixture.awayTeam.leaguePosition}</span>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${fixture.awayTeam.logoColor} flex items-center justify-center text-white font-black text-sm shadow-md`}>
                    {fixture.awayTeam.initials}
                  </div>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <p>Goals: <span className="text-white font-mono">{fixture.awayTeam.goalsScored} scored / {fixture.awayTeam.goalsConceded} conceded</span></p>
                  <p>Possession: <span className="text-white font-mono">{fixture.awayTeam.avgPossession}%</span></p>
                  <p>Clean Sheets: <span className="text-emerald-400 font-mono">{fixture.awayTeam.cleanSheets}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: AI TACTICAL & EXPECTED GOALS */}
          {modalTab === 'tactical' && (
            <div className="space-y-6">
              {/* Expected Goals (xG) Statistical Model */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Algorithmic Expected Goals (xG) Projection
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Total Match xG: <strong className="text-emerald-400">{currentAnalysis.expectedGoals?.totalXG || currentAnalysis.expectedGoals?.total}</strong>
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>{fixture.homeTeam.name} Projected xG</span>
                      <span className="font-mono font-bold text-white">
                        {currentAnalysis.expectedGoals?.homeXG || currentAnalysis.expectedGoals?.home}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            ((currentAnalysis.expectedGoals?.homeXG || currentAnalysis.expectedGoals?.home || 1) / 3.5) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 mb-1">
                      <span>{fixture.awayTeam.name} Projected xG</span>
                      <span className="font-mono font-bold text-white">
                        {currentAnalysis.expectedGoals?.awayXG || currentAnalysis.expectedGoals?.away}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-blue-500 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            ((currentAnalysis.expectedGoals?.awayXG || currentAnalysis.expectedGoals?.away || 1) / 3.5) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gemini AI Tactical Breakdown Engine Card */}
              <div className="bg-gradient-to-br from-slate-900/90 to-[#0F172A] border border-emerald-500/40 rounded-xl p-5 shadow-lg relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Predict Mind AI Tactical Engine</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                          Gemini 2.5 Flash
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Live quantitative reasoning evaluated against recent pressing, finishing & defensive metrics
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRunGeminiAnalysis()}
                    disabled={isLoadingAi}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all shrink-0 active:scale-95"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingAi ? 'animate-spin' : ''}`} />
                    <span>{isLoadingAi ? 'Analyzing Match...' : 'Refresh AI Analysis'}</span>
                  </button>
                </div>

                {aiError && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300 flex items-center gap-2 mb-4">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{aiError}</span>
                  </div>
                )}

                {/* AI Recommendation Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Recommended Market</span>
                    <span className="text-sm font-bold text-emerald-400">{currentAnalysis.primaryTip}</span>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">AI Confidence Score</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-lg font-bold font-mono text-white">{currentAnalysis.confidenceScore}%</span>
                      <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        High Probability
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Model Risk Assessment</span>
                    <span className={`text-sm font-bold ${
                      currentAnalysis.riskAssessment === 'Low' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {currentAnalysis.riskAssessment || 'Low'} Risk Bracket
                    </span>
                  </div>
                </div>

                {/* Tactical Narrative */}
                <div className="space-y-3 text-xs leading-relaxed text-slate-200 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 mb-4">
                  <div>
                    <strong className="text-emerald-400 block mb-1">Tactical Analysis:</strong>
                    <p>{currentAnalysis.tacticalBreakdown}</p>
                  </div>
                  <div>
                    <strong className="text-emerald-400 block mb-1">Key Statistical Edge:</strong>
                    <p>{currentAnalysis.keyStatisticalEdge}</p>
                  </div>
                </div>

                {/* VIP Exclusive Depth */}
                <div className="p-4 rounded-xl border bg-amber-950/20 border-amber-500/30">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <h5 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                      VIP Staking & Secondary Markets Insight
                    </h5>
                  </div>

                  {isVipUser ? (
                    <p className="text-xs text-slate-200">
                      {currentAnalysis.vipExclusiveInsight}
                    </p>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-2">
                      <p className="text-xs text-slate-300">
                        VIP members receive exact staking units, 1st half goals forecast, and high-odds combo overlays.
                      </p>
                      <button
                        onClick={() => {
                          onClose();
                          onOpenSubscribe('vip-monthly');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap"
                      >
                        Unlock VIP (₦15,000)
                      </button>
                    </div>
                  )}
                </div>

                {/* Ask AI a Custom Question about this Match */}
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Ask Gemini AI a Specific Tactical Question:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customQuestion.trim()) {
                          handleRunGeminiAnalysis(customQuestion);
                        }
                      }}
                      placeholder="e.g. What is the likelihood of a 2-1 final score or early red card?"
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => customQuestion.trim() && handleRunGeminiAnalysis(customQuestion)}
                      disabled={isLoadingAi || !customQuestion.trim()}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Ask AI</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALL 14+ MARKETS SUITE MATRIX */}
          {modalTab === 'all-markets' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Comprehensive 14+ Markets Suite</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Algorithmic projections across every betting market evaluated by Predict Mind AI
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs no-scrollbar">
                  {(['All', 'Goals', 'Match', 'Halves', 'Corners/Cards', 'Scores'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveMarketCat(cat)}
                      className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap text-xs transition-colors ${
                        activeMarketCat === cat
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Markets Cards Grid */}
              {activeMarketCat !== 'Scores' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredMarketList.map((m) => (
                    <div 
                      key={m.marketCode}
                      className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {m.marketName}
                          </span>
                          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                            m.confidence >= 85 ? 'text-emerald-400 bg-emerald-500/10' : 'text-blue-400 bg-blue-500/10'
                          }`}>
                            {m.confidence}% Conf.
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-1.5">
                          <h5 className="font-extrabold text-white text-sm sm:text-base">{m.pick}</h5>
                          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                            @{m.estimatedOdds.toFixed(2)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {m.analysisNote}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Value Assessment:</span>
                        <span className={`font-semibold ${
                          m.valueRating === 'Safe Anchor' ? 'text-emerald-400' : 'text-blue-400'
                        }`}>
                          {m.valueRating}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Correct Scores Matrix */
                <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 space-y-4">
                  <div>
                    <h5 className="font-bold text-white text-sm mb-1">Algorithmic Correct Score Projections</h5>
                    <p className="text-xs text-slate-400">
                      Derived from bivariate Poisson distribution over home and away offensive conversion rates
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {allMarkets.correctScores.map((cs) => (
                      <div key={cs.score} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
                        <span className="text-xl font-mono font-black text-white block mb-1">{cs.score}</span>
                        <span className="text-sm font-bold text-emerald-400 block">{cs.probability}% Probability</span>
                        <span className="text-xs text-slate-400 block mt-1">Estimated Odds: ~{cs.odds.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: H2H & TEAM STATS */}
          {modalTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <h5 className="font-bold text-white text-sm mb-2">{fixture.homeTeam.name} Seasonal Performance</h5>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>League Position</span>
                      <span className="font-bold text-white">#{fixture.homeTeam.leaguePosition}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Goals Scored (Total)</span>
                      <span className="font-bold text-emerald-400">{fixture.homeTeam.goalsScored}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Goals Conceded (Total)</span>
                      <span className="font-bold text-rose-400">{fixture.homeTeam.goalsConceded}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Avg Ball Possession</span>
                      <span className="font-bold text-white">{fixture.homeTeam.avgPossession}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Total Clean Sheets</span>
                      <span className="font-bold text-emerald-400">{fixture.homeTeam.cleanSheets} matches</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  <h5 className="font-bold text-white text-sm mb-2">{fixture.awayTeam.name} Seasonal Performance</h5>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>League Position</span>
                      <span className="font-bold text-white">#{fixture.awayTeam.leaguePosition}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Goals Scored (Total)</span>
                      <span className="font-bold text-emerald-400">{fixture.awayTeam.goalsScored}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Goals Conceded (Total)</span>
                      <span className="font-bold text-rose-400">{fixture.awayTeam.goalsConceded}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Avg Ball Possession</span>
                      <span className="font-bold text-white">{fixture.awayTeam.avgPossession}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span>Total Clean Sheets</span>
                      <span className="font-bold text-emerald-400">{fixture.awayTeam.cleanSheets} matches</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            * Predict Mind AI models are probabilistic statistical insights. 18+ Gamble responsibly.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
