import { AccumulatorSlip, BookmakerName, FootballFixture, SlipLeg, SlipRiskLevel } from '../types';
import { MOCK_FIXTURES } from '../data/mockFootballData';

// Generates an authentic booking code format matching top Nigerian & international bookmakers
export function generateBookingCode(bookmaker: BookmakerName): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const digits = '0123456789';
  
  const randomStr = (len: number, charSet: string) => {
    let res = '';
    for (let i = 0; i < len; i++) {
      res += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
    return res;
  };

  switch (bookmaker) {
    case 'SportyBet':
      // SportyBet typical format: BC followed by 5 alphanumeric characters (e.g. BC74K8W)
      return `BC${randomStr(5, chars)}`;
    case 'Bet9ja':
      // Bet9ja format: B9- + 6 digits (e.g. B9-482019)
      return `B9-${randomStr(6, digits)}`;
    case '1xBet':
      // 1xBet format: 1X- + 5 alphanumeric (e.g. 1X-8K4P9)
      return `1X-${randomStr(5, chars)}`;
    case 'BetKing':
      // BetKing format: BK- + 5 alphanumeric (e.g. BK-392F8)
      return `BK-${randomStr(5, chars)}`;
    case 'MSport':
      // MSport format: MS- + 6 alphanumeric (e.g. MS-928401)
      return `MS-${randomStr(6, chars)}`;
    case 'Betway':
      // Betway format: BW- + 6 digits (e.g. BW-849201)
      return `BW-${randomStr(6, digits)}`;
    default:
      return `PM-${randomStr(6, chars)}`;
  }
}

export function getBookmakerUrl(bookmaker: BookmakerName, code?: string): string {
  switch (bookmaker) {
    case 'SportyBet':
      return 'https://www.sportybet.com/ng/';
    case 'Bet9ja':
      return 'https://sports.bet9ja.com/';
    case '1xBet':
      return 'https://1xbet.ng/';
    case 'BetKing':
      return 'https://www.betking.com/';
    case 'MSport':
      return 'https://www.msport.com/ng/';
    case 'Betway':
      return 'https://www.betway.com.ng/';
    default:
      return 'https://www.sportybet.com/ng/';
  }
}

interface GenerateSlipOptions {
  bookmaker: BookmakerName;
  targetOddsRange: '2' | '5' | '10' | '25' | 'custom';
  customTargetOdds?: number;
  riskLevel: SlipRiskLevel;
  preferredMarket?: 'all' | '1x2' | 'goals' | 'double-chance';
  stakeAmount?: number;
}

export function generateAccumulatorSlip(options: GenerateSlipOptions): AccumulatorSlip {
  const {
    bookmaker,
    targetOddsRange,
    customTargetOdds,
    riskLevel,
    preferredMarket = 'all',
    stakeAmount = 2000,
  } = options;

  let minTargetOdds = 2.0;
  let maxTargetOdds = 3.0;

  if (targetOddsRange === '2') {
    minTargetOdds = 1.95;
    maxTargetOdds = 3.20;
  } else if (targetOddsRange === '5') {
    minTargetOdds = 4.50;
    maxTargetOdds = 7.50;
  } else if (targetOddsRange === '10') {
    minTargetOdds = 8.80;
    maxTargetOdds = 14.50;
  } else if (targetOddsRange === '25') {
    minTargetOdds = 20.0;
    maxTargetOdds = 45.0;
  } else if (targetOddsRange === 'custom' && customTargetOdds) {
    minTargetOdds = Math.max(1.5, customTargetOdds * 0.85);
    maxTargetOdds = customTargetOdds * 1.25;
  }

  // Pool candidate picks from all fixtures
  const candidates: SlipLeg[] = [];

  MOCK_FIXTURES.forEach((fixture: FootballFixture) => {
    const matchName = `${fixture.homeTeam.name} vs ${fixture.awayTeam.name}`;
    const allM = fixture.aiPrediction.allMarkets;

    // Pick 1: Primary Tip
    candidates.push({
      fixtureId: fixture.id,
      match: matchName,
      homeTeam: fixture.homeTeam.name,
      awayTeam: fixture.awayTeam.name,
      league: fixture.league,
      kickoff: `${fixture.date} ${fixture.time}`,
      marketName: fixture.aiPrediction.market,
      pick: fixture.aiPrediction.primaryTip,
      odds: fixture.odds.homeWin < 2.0 ? fixture.odds.homeWin : fixture.odds.over25,
      confidence: fixture.aiPrediction.confidence,
      rationale: fixture.aiPrediction.tacticalSummary || 'High expected offensive superiority and form momentum.',
    });

    // Pick 2: Over/Under Goals
    if (allM?.overUnder25 && (preferredMarket === 'all' || preferredMarket === 'goals')) {
      candidates.push({
        fixtureId: fixture.id,
        match: matchName,
        homeTeam: fixture.homeTeam.name,
        awayTeam: fixture.awayTeam.name,
        league: fixture.league,
        kickoff: `${fixture.date} ${fixture.time}`,
        marketName: 'Over/Under 2.5 Goals',
        pick: allM.overUnder25.pick,
        odds: allM.overUnder25.estimatedOdds || 1.75,
        confidence: allM.overUnder25.confidence,
        rationale: allM.overUnder25.analysisNote || 'xG model indicates high combined shot output.',
      });
    }

    // Pick 3: Double Chance (ultra-safe for Banker mode)
    if (allM?.doubleChance && (preferredMarket === 'all' || preferredMarket === 'double-chance')) {
      candidates.push({
        fixtureId: fixture.id,
        match: matchName,
        homeTeam: fixture.homeTeam.name,
        awayTeam: fixture.awayTeam.name,
        league: fixture.league,
        kickoff: `${fixture.date} ${fixture.time}`,
        marketName: 'Double Chance',
        pick: allM.doubleChance.pick,
        odds: allM.doubleChance.estimatedOdds || 1.28,
        confidence: allM.doubleChance.confidence,
        rationale: allM.doubleChance.analysisNote || 'Defensive solidity and home resilience minimizes defeat risk.',
      });
    }

    // Pick 4: Both Teams to Score (BTTS)
    if (allM?.btts && (preferredMarket === 'all' || preferredMarket === 'goals')) {
      candidates.push({
        fixtureId: fixture.id,
        match: matchName,
        homeTeam: fixture.homeTeam.name,
        awayTeam: fixture.awayTeam.name,
        league: fixture.league,
        kickoff: `${fixture.date} ${fixture.time}`,
        marketName: 'Both Teams To Score',
        pick: allM.btts.pick,
        odds: allM.btts.estimatedOdds || 1.70,
        confidence: allM.btts.confidence,
        rationale: allM.btts.analysisNote || 'Both teams have scored in over 75% of their recent fixtures.',
      });
    }
  });

  // Filter candidates based on risk level
  let filteredCandidates = [...candidates];
  if (riskLevel === 'banker') {
    filteredCandidates = candidates.filter((c) => c.confidence >= 78);
  } else if (riskLevel === 'balanced') {
    filteredCandidates = candidates.filter((c) => c.confidence >= 70 && c.odds >= 1.35);
  } else {
    // Aggressive
    filteredCandidates = candidates.filter((c) => c.odds >= 1.60);
  }

  // Shuffle candidates to create variety on each generation
  const shuffled = filteredCandidates.sort(() => Math.random() - 0.5);

  // Build the accumulator legs ensuring only 1 market per fixture (no clashes)
  const selectedLegs: SlipLeg[] = [];
  const usedFixtureIds = new Set<string>();
  let currentAccumulatedOdds = 1.0;

  for (const leg of shuffled) {
    if (usedFixtureIds.has(leg.fixtureId)) continue;

    const projectedOdds = currentAccumulatedOdds * leg.odds;

    // Check if adding this leg stays within or reaches target
    if (projectedOdds <= maxTargetOdds * 1.15 || selectedLegs.length < 2) {
      selectedLegs.push(leg);
      usedFixtureIds.add(leg.fixtureId);
      currentAccumulatedOdds = projectedOdds;

      if (currentAccumulatedOdds >= minTargetOdds && selectedLegs.length >= 2) {
        break;
      }
    }
  }

  // Fallback if not enough legs were picked
  if (selectedLegs.length < 2) {
    for (const leg of shuffled) {
      if (!usedFixtureIds.has(leg.fixtureId)) {
        selectedLegs.push(leg);
        usedFixtureIds.add(leg.fixtureId);
        currentAccumulatedOdds *= leg.odds;
        if (selectedLegs.length >= 3) break;
      }
    }
  }

  const roundedOdds = Number(currentAccumulatedOdds.toFixed(2));
  const avgConfidence = Math.round(
    selectedLegs.reduce((acc, curr) => acc + curr.confidence, 0) / (selectedLegs.length || 1)
  );

  const bookingCode = generateBookingCode(bookmaker);

  let riskTitle = 'Balanced Value Slip';
  if (riskLevel === 'banker') riskTitle = 'Safe Banker Multiplier (High Probability)';
  if (riskLevel === 'aggressive') riskTitle = 'High-Odds Jackpot Multiplier';

  return {
    id: `SLIP_${Date.now()}`,
    title: `${bookmaker} ${roundedOdds}x AI Multiplier`,
    bookmaker,
    bookingCode,
    totalOdds: roundedOdds,
    legsCount: selectedLegs.length,
    averageConfidence: avgConfidence,
    riskProfile: riskTitle,
    legs: selectedLegs,
    generatedAt: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    stakeAmount,
    potentialReturn: Math.round(stakeAmount * roundedOdds),
  };
}
