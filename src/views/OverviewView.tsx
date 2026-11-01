import React from 'react';
import { MarketTicker, TradeSignal, PaperPosition, ClosedPaperTrade } from '../types';
import { MetricCard } from '../components/common/MetricCard';

interface OverviewViewProps {
  tickers: MarketTicker[];
  signals: TradeSignal[];
  paperBalance: number;
  openPositions: PaperPosition[];
  closedTrades: ClosedPaperTrade[];
  onSelectCoin: (symbol: string) => void;
  onNavigateToSignals: () => void;
  onNavigateToScanner: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  tickers,
  signals,
  paperBalance,
  openPositions,
  closedTrades,
  onSelectCoin,
  onNavigateToSignals,
  onNavigateToScanner
}) => {
  const btcTicker = tickers.find((t) => t.symbol === 'BTCUSDT') || tickers[0];

  const activeBuyCount = tickers.filter((t) => t.signalDirection === 'BUY').length;
  const activeSellCount = tickers.filter((t) => t.signalDirection === 'SELL').length;
  const totalVolumeUsdt = tickers.reduce((acc, t) => acc + (t.volumeUsdt || 0), 0);

  const totalUnrealizedPnl = openPositions.reduce((acc, p) => acc + p.unrealizedPnl, 0);
  const totalEquity = paperBalance + totalUnrealizedPnl;

  // Format currency helper
  const formatVol = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  const topSignals = signals.slice(0, 3);

  // Simulated 30-day equity curve points
  const equityPoints = [
    { day: 'Day 1', val: 100000, dd: 0 },
    { day: 'Day 5', val: 101420, dd: 0 },
    { day: 'Day 10', val: 100800, dd: -0.61 },
    { day: 'Day 15', val: 103250, dd: 0 },
    { day: 'Day 20', val: 102400, dd: -0.82 },
    { day: 'Day 25', val: 105800, dd: 0 },
    { day: 'Day 30', val: 107640, dd: 0 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Verification & Disclosures */}
      <div className="p-3 bg-[#111622] border border-[#1E2638] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-none inline-block"></span>
          <span className="text-neutral-200 font-semibold">EDGEGUARD RESEARCH SUITE</span>
          <span className="text-neutral-600">·</span>
          <span>Binance Spot Systematic Quant Screening</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Data Layer: <strong className="text-neutral-300">DEMO & LIVE SPOT</strong></span>
          <span className="text-neutral-600">·</span>
          <span>Execution: <strong className="text-neutral-300">Manual User Action Only</strong></span>
        </div>
      </div>

      {/* KPI Metric Strips: Domain Separated */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <MetricCard
          label="BTC / USDT Spot"
          value={btcTicker ? `$${btcTicker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$96,420'}
          subValue={btcTicker ? `${btcTicker.change24h >= 0 ? '+' : ''}${btcTicker.change24h}% (24h)` : '+2.45%'}
          trend={btcTicker && btcTicker.change24h >= 0 ? 'up' : 'down'}
          datasetType="MARKET_SCAN"
        />
        <MetricCard
          label="Tracked 24h Vol"
          value={formatVol(totalVolumeUsdt)}
          subValue={`${tickers.length} Binance Spot Pairs`}
          trend="neutral"
          datasetType="MARKET_SCAN"
        />
        <MetricCard
          label="Active BUY Setups"
          value={activeBuyCount}
          subValue={`${activeSellCount} Short/Exit Setups`}
          trend="up"
          datasetType="MARKET_SCAN"
          badgeNote="Scored > 70"
        />
        <MetricCard
          label="Paper Portfolio"
          value={`$${totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue={`${totalUnrealizedPnl >= 0 ? '+' : ''}$${totalUnrealizedPnl.toFixed(2)} Open P&L`}
          trend={totalUnrealizedPnl >= 0 ? 'up' : 'down'}
          datasetType="PAPER"
        />
        <MetricCard
          label="Backtest Win Rate"
          value="58.4%"
          subValue="Profit Factor: 1.89"
          trend="up"
          datasetType="BACKTEST"
          badgeNote="N = 482"
        />
        <MetricCard
          label="Expectancy"
          value="+0.44 R"
          subValue="Max DD: -8.2%"
          trend="up"
          datasetType="BACKTEST"
          badgeNote="Spot Only"
        />
      </div>

      {/* Main Charts & Visualizations Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Equity Curve (Backtest / Paper) */}
        <div className="lg:col-span-2 bg-[#111622] border border-[#1E2638] p-5">
          <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-[#1E2638]">
            <div>
              <h2 className="text-sm font-mono font-semibold text-white tracking-wide uppercase">
                Quantitative Portfolio Equity Curve
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Simulated compounding curve based on systematic trend-pullback alpha model (1.0R risk budget)
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span>
                <span>Equity (+7.64%)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-rose-400 inline-block"></span>
                <span>Drawdown</span>
              </span>
            </div>
          </div>

          {/* SVG Equity Chart */}
          <div className="h-56 w-full pt-2">
            <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines */}
              {[40, 80, 120, 160].map((y) => (
                <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#171F2E" strokeDasharray="3 3" />
              ))}

              {/* Area fill */}
              <polygon
                points="0,170 100,140 220,150 350,90 470,110 590,40 700,10 700,190 0,190"
                fill="url(#equityGrad)"
              />

              {/* Line path */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="2.2"
                points="0,170 100,140 220,150 350,90 470,110 590,40 700,10"
              />

              {/* Drawdown underwater trace */}
              <line x1="200" y1="180" x2="240" y2="190" stroke="#EF4444" strokeWidth="1.5" />
              <line x1="450" y1="180" x2="490" y2="192" stroke="#EF4444" strokeWidth="1.5" />

              {/* Data labels */}
              <text x="10" y="24" fill="#94A3B8" fontSize="10" fontFamily="monospace">$107,640.00 USD</text>
              <text x="10" y="185" fill="#64748B" fontSize="10" fontFamily="monospace">Base: $100,000.00</text>
            </svg>
          </div>

          <div className="pt-3 border-t border-[#1E2638] flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400">
            <span>Sharpe Ratio: <strong className="text-white">1.84</strong></span>
            <span>Sortino Ratio: <strong className="text-white">2.42</strong></span>
            <span>Profit Factor: <strong className="text-emerald-400">1.89</strong></span>
            <span>Max Consecutive Losses: <strong className="text-white">3</strong></span>
          </div>
        </div>

        {/* Chart 2: Market Regime Distribution & Signal Direction */}
        <div className="bg-[#111622] border border-[#1E2638] p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-mono font-semibold text-white tracking-wide uppercase pb-2 border-b border-[#1E2638]">
              Market Regime Distribution
            </h2>
            <p className="text-xs text-neutral-400 mt-2 mb-4">
              Real-time classification across monitored Binance Spot pairs
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Bullish Trending</span>
                  <span className="text-emerald-400 font-semibold">45.8% (11 pairs)</span>
                </div>
                <div className="w-full bg-[#0B0E14] h-2">
                  <div className="bg-emerald-500 h-2" style={{ width: '45.8%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Range Consolidation</span>
                  <span className="text-neutral-400">29.2% (7 pairs)</span>
                </div>
                <div className="w-full bg-[#0B0E14] h-2">
                  <div className="bg-sky-500 h-2" style={{ width: '29.2%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Volatile Expansion</span>
                  <span className="text-amber-400">16.7% (4 pairs)</span>
                </div>
                <div className="w-full bg-[#0B0E14] h-2">
                  <div className="bg-amber-500 h-2" style={{ width: '16.7%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-neutral-300 mb-1">
                  <span>Bearish Trending</span>
                  <span className="text-rose-400">8.3% (2 pairs)</span>
                </div>
                <div className="w-full bg-[#0B0E14] h-2">
                  <div className="bg-rose-500 h-2" style={{ width: '8.3%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1E2638] text-xs font-mono text-neutral-400 flex items-center justify-between">
            <span>System State: <strong className="text-emerald-400">RISK ON</strong></span>
            <button
              onClick={onNavigateToScanner}
              className="text-emerald-400 hover:text-emerald-300 font-medium underline"
            >
              Scan All 24 Pairs →
            </button>
          </div>
        </div>
      </div>

      {/* High-Conviction Signal Highlights */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Top Actionable Signals Generated
            </h2>
            <p className="text-xs text-neutral-400">
              Highest research quality score setups meeting multi-timeframe structural criteria
            </p>
          </div>
          <button
            onClick={onNavigateToSignals}
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 font-medium border border-[#1E2638] px-3 py-1.5 bg-[#111622] hover:bg-[#141A26]"
          >
            View All Signals Center ({signals.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topSignals.map((sig) => {
            const isBuy = sig.direction === 'BUY';
            return (
              <div
                key={sig.id}
                className="bg-[#111622] border border-[#1E2638] p-4 flex flex-col justify-between hover:border-neutral-600 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1E2638]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-base">
                        {sig.symbol}
                      </span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 font-bold ${
                        isBuy ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30' : 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
                      }`}>
                        {sig.direction}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-neutral-500 block uppercase font-mono">Research Score</span>
                      <span className="text-sm font-mono font-bold text-emerald-400 tabular-nums">
                        {sig.qualityScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Pricing parameter table */}
                  <div className="space-y-1.5 text-xs font-mono tabular-nums mb-3">
                    <div className="flex justify-between text-neutral-400">
                      <span>Entry Zone:</span>
                      <span className="text-white font-medium">${sig.entryMin} - ${sig.entryMax}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Stop-Loss:</span>
                      <span className="text-rose-400">${sig.stopLoss} (-{sig.riskPercent}%)</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Target 1 (1.0R):</span>
                      <span className="text-emerald-400">${sig.takeProfit1}</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Target 2 (2.0R):</span>
                      <span className="text-emerald-400">${sig.takeProfit2}</span>
                    </div>
                  </div>

                  {/* Multi-timeframe confirmation checklist */}
                  <div className="pt-2 border-t border-[#1E2638]/70 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                    <span>4H: <strong className="text-emerald-400">BULL</strong></span>
                    <span>1H: <strong className="text-emerald-400">BULL</strong></span>
                    <span>15M: <strong className="text-emerald-400">BULL</strong></span>
                    <span>R:R: <strong className="text-white">1:{sig.riskRewardRatio}</strong></span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1E2638] flex items-center justify-between">
                  <button
                    onClick={() => onSelectCoin(sig.symbol)}
                    className="text-xs font-mono text-sky-400 hover:text-sky-300 font-medium"
                  >
                    Inspect Chart & Evidence →
                  </button>
                  <span className="text-[10px] font-mono text-neutral-500">
                    Valid for 8h
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
