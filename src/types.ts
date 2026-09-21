export type SubscriptionPlanId = 'free' | 'weekly' | 'monthly' | 'vip-monthly';

export type NavigationTab = 'website' | 'fixtures' | 'vip' | 'track-record' | 'pricing' | 'dashboard';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  price: number;
  priceFormatted: string;
  durationDays: number;
  durationLabel: string;
  tagline: string;
  features: string[];
  popular?: boolean;
  isVip?: boolean;
  badge?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  currentPlan: SubscriptionPlanId;
  planExpiresAt: string | null;
  joinedAt: string;
  bankroll: number;
  notificationsEnabled: boolean;
}

export interface TeamStats {
  name: string;
  shortName: string;
  logoColor: string;
  initials: string;
  form: ('W' | 'D' | 'L')[];
  leaguePosition: number;
  goalsScored: number;
  goalsConceded: number;
  avgPossession: number;
  cleanSheets: number;
}

export interface HeadToHeadStats {
  totalGames: number;
  homeWins: number;
  draws: number;
  awayWins: number;
  lastMeeting: string;
  lastScore: string;
  avgGoalsPerGame: number;
}

export interface OddsComparison {
  homeWin: number;
  draw: number;
  awayWin: number;
  over25: number;
  under25: number;
  bttsYes: number;
  bttsNo: number;
  doubleChance1X: number;
  doubleChanceX2: number;
}

export interface MarketPredictionItem {
  marketCode: string;
  marketName: string;
  category: 'Match' | 'Goals' | 'Halves' | 'Corners/Cards' | 'Scores';
  pick: string;
  confidence: number; // 0 to 100
  estimatedOdds: number;
  valueRating: 'High Value' | 'Moderate' | 'Safe Anchor';
  analysisNote: string;
}

export interface AllMarketsSuite {
  matchResult: MarketPredictionItem; // 1X2
  doubleChance: MarketPredictionItem; // 1X, 12, X2
  drawNoBet: MarketPredictionItem; // DNB
  overUnder15: MarketPredictionItem; // Over/Under 1.5
  overUnder25: MarketPredictionItem; // Over/Under 2.5
  overUnder35: MarketPredictionItem; // Over/Under 3.5
  btts: MarketPredictionItem; // Both Teams to Score (GG/NG)
  halfTimeFullTime: MarketPredictionItem; // HT/FT
  firstHalfGoals: MarketPredictionItem; // 1H O/U
  corners: MarketPredictionItem; // Total Corners O/U
  cards: MarketPredictionItem; // Total Cards O/U
  handicap: MarketPredictionItem; // Asian / European Handicap
  winEitherHalf: MarketPredictionItem; // Win Either Half
  correctScores: { score: string; probability: number; odds: number }[];
}

export interface AIPrediction {
  primaryTip: string;
  market: '1X2' | 'Over/Under' | 'BTTS' | 'Double Chance' | 'Asian Handicap' | 'Draw No Bet' | 'HT/FT' | 'Corners/Cards' | 'Correct Score';
  confidence: number; // 0 to 100
  isVipOnly: boolean;
  isFreeTeaser?: boolean;
  allMarkets?: AllMarketsSuite;
  expectedGoals: {
    home: number;
    away: number;
    total: number;
  };
  probabilities: {
    homeWin: number;
    draw: number;
    awayWin: number;
    over25: number;
    under25: number;
    bttsYes: number;
    bttsNo: number;
  };
  tacticalSummary: string;
  keyStatEdge: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  vipInsight?: string;
  recommendedStakeUnits?: number; // 1 to 5 units
}

export interface FootballFixture {
  id: string;
  league: string;
  country: string;
  round: string;
  date: string;
  time: string;
  venue: string;
  status: 'UPCOMING' | 'LIVE' | 'FINISHED';
  liveMinute?: number;
  liveScore?: { home: number; away: number };
  homeTeam: TeamStats;
  awayTeam: TeamStats;
  headToHead: HeadToHeadStats;
  odds: OddsComparison;
  aiPrediction: AIPrediction;
  result?: {
    homeScore: number;
    awayScore: number;
    predictionOutcome: 'WON' | 'LOST' | 'VOID';
  };
}

export interface PaymentTransaction {
  reference: string;
  amount: number;
  currency: string;
  planId: SubscriptionPlanId;
  planName: string;
  date: string;
  status: 'success' | 'failed' | 'pending';
  channel: string;
  customerEmail: string;
}

export interface HistoricalTip {
  id: string;
  date: string;
  league: string;
  match: string;
  market: string;
  prediction: string;
  odds: number;
  outcome: 'WON' | 'LOST';
  score: string;
  tier: 'Standard' | 'VIP';
  confidence: number;
}

export type BookmakerName = 'SportyBet' | 'Bet9ja' | '1xBet' | 'BetKing' | 'MSport' | 'Betway';

export type SlipRiskLevel = 'banker' | 'balanced' | 'aggressive';

export interface SlipLeg {
  fixtureId: string;
  match: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  kickoff: string;
  marketName: string;
  pick: string;
  odds: number;
  confidence: number;
  rationale: string;
}

export interface AccumulatorSlip {
  id: string;
  title: string;
  bookmaker: BookmakerName;
  bookingCode: string;
  totalOdds: number;
  legsCount: number;
  averageConfidence: number;
  riskProfile: string;
  legs: SlipLeg[];
  generatedAt: string;
  stakeAmount: number;
  potentialReturn: number;
}

