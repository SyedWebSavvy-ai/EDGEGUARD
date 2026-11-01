export type Timeframe = '5M' | '15M' | '1H' | '4H' | '1D';

export type SignalDirection = 'BUY' | 'SELL';

export type MarketRegimeType = 
  | 'Bullish Trending' 
  | 'Bearish Trending' 
  | 'Range-Bound Consolidation' 
  | 'Volatile Expansion'
  | 'Compression / Squeeze';

export interface MarketTicker {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  volumeUsdt: number;
  rvol: number; // Relative Volume
  regime: MarketRegimeType;
  trendStrength: 'Strong Bull' | 'Moderate Bull' | 'Neutral' | 'Moderate Bear' | 'Strong Bear';
  volatilityAtrPercent: number;
  liquidityTier: 'Tier 1' | 'Tier 2' | 'Tier 3';
  signalDirection?: SignalDirection | 'NEUTRAL';
  signalScore: number; // 0 - 100
  lastUpdated: number;
}

export interface TimeframeConfirmation {
  timeframe: Timeframe;
  bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  trendScore: number; // 0-100
  description: string;
  emaAlignment: 'BULLISH_STACK' | 'BEARISH_STACK' | 'MIXED';
  rsiValue: number;
  structure: 'BOS_UP' | 'BOS_DOWN' | 'RANGE' | 'CHOH_BULL' | 'CHOH_BEAR';
}

export interface TradeSignal {
  id: string;
  symbol: string;
  direction: SignalDirection;
  qualityScore: number; // 0 - 100 research score (not win probability)
  entryMin: number;
  entryMax: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  riskRewardRatio: number;
  riskPercent: number;
  timestamp: number;
  expiresAt: number;
  regime: MarketRegimeType;
  strategyName: string;
  strategyVersion: string;
  confirmations: {
    tf4h: TimeframeConfirmation;
    tf1h: TimeframeConfirmation;
    tf15m: TimeframeConfirmation;
    tf5m: TimeframeConfirmation;
  };
  reasoning: {
    summary: string;
    bullishEvidence: string[];
    bearishCounterEvidence: string[];
    invalidationCriteria: string[];
    riskWarnings: string[];
  };
  status: 'ACTIVE' | 'TRIGGERED' | 'TARGET_HIT' | 'STOPPED_OUT' | 'EXPIRED';
}

export interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  ema20?: number;
  ema50?: number;
  ema200?: number;
  rsi?: number;
  atr?: number;
  macd?: {
    macd: number;
    signal: number;
    hist: number;
  };
}

export interface PaperPosition {
  id: string;
  symbol: string;
  direction: SignalDirection;
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  initialValue: number;
  currentValue: number;
  stopLoss: number;
  takeProfit: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  pnlR: number;
  openTimestamp: number;
  signalId?: string;
  leverage: 1; // Spot trading only: 1x
}

export interface ClosedPaperTrade {
  id: string;
  symbol: string;
  direction: SignalDirection;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  fees: number;
  realizedPnl: number;
  realizedPnlPercent: number;
  pnlR: number;
  openTimestamp: number;
  closeTimestamp: number;
  exitReason: 'TAKE_PROFIT' | 'STOP_LOSS' | 'MANUAL_CLOSE';
  signalId?: string;
}

export interface JournalEntry {
  id: string;
  symbol: string;
  direction: SignalDirection;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  quantity: number;
  fees: number;
  netPnl: number;
  openDate: string;
  closeDate: string;
  reasonForEntry: string;
  reasonForExit: string;
  signalReference?: string;
  screenshotUrl?: string;
  disciplineRating: number; // 1-5
  notes: string;
  marketRegime: MarketRegimeType;
}

export interface BacktestConfig {
  symbol: string;
  timeframe: Timeframe;
  strategyId: string;
  dateRangeDays: number;
  initialCapital: number;
  riskPerTradePercent: number;
  makerFeePercent: number;
  takerFeePercent: number;
  slippagePercent: number;
}

export interface BacktestTrade {
  id: string;
  timestamp: number;
  symbol: string;
  direction: SignalDirection;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  pnlR: number;
  returnPercent: number;
  mfeR: number;
  maeR: number;
  durationHours: number;
  exitType: 'TP1' | 'TP2' | 'TP3' | 'SL' | 'TIME_EXPIRY';
  regime: MarketRegimeType;
}

export interface BacktestResult {
  config: BacktestConfig;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  netReturnUsd: number;
  netReturnPercent: number;
  profitFactor: number;
  expectancyR: number;
  maxDrawdownPercent: number;
  maxDrawdownUsd: number;
  sharpeRatio: number;
  sortinoRatio: number;
  avgWinUsd: number;
  avgLossUsd: number;
  maxConsecutiveLosses: number;
  maxConsecutiveWins: number;
  equityCurve: { timestamp: number; equity: number; drawdownPercent: number }[];
  monthlyReturns: { year: number; month: number; returnPercent: number }[];
  trades: BacktestTrade[];
}

export interface SystemAuditLog {
  id: string;
  timestamp: number;
  level: 'INFO' | 'WARN' | 'ERROR';
  category: 'BINANCE_API' | 'SIGNAL_ENGINE' | 'SCANNER' | 'STORAGE' | 'RISK_MODEL';
  message: string;
  details?: string;
}

export interface TerminalSettings {
  minVolumeUsdt: number;
  minQualityScore: number;
  maxRiskPerTrade: number;
  defaultTp1R: number;
  defaultTp2R: number;
  defaultTp3R: number;
  makerFeeRate: number;
  takerFeeRate: number;
  slippageAssumption: number;
  audioAlertsEnabled: boolean;
  autoRefreshIntervalSeconds: number;
  selectedMarkets: string[];
}
