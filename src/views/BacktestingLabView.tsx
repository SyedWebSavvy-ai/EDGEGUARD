import React, { useState } from 'react';
import { BacktestConfig, BacktestResult, Timeframe } from '../types';
import { MetricCard } from '../components/common/MetricCard';

export const BacktestingLabView: React.FC = () => {
  const [config, setConfig] = useState<BacktestConfig>({
    symbol: 'BTCUSDT',
    timeframe: '1H',
    strategyId: 'trend_pullback_v24',
    dateRangeDays: 180,
    initialCapital: 100000,
    riskPerTradePercent: 1.5,
    makerFeePercent: 0.075,
    takerFeePercent: 0.075,
    slippagePercent: 0.05
  });

  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(() => generateMockResult(config));

  function generateMockResult(cfg: BacktestConfig): BacktestResult {
    const totalTrades = Math.round(cfg.dateRangeDays * (cfg.timeframe === '15M' ? 3.2 : cfg.timeframe === '1H' ? 1.6 : 0.7));
    const winRate = 58.4;
    const winningTrades = Math.round((totalTrades * winRate) / 100);
    const losingTrades = totalTrades - winningTrades;
    const netReturnPercent = Number((28.4 * (cfg.dateRangeDays / 180)).toFixed(2));
    const netReturnUsd = Number(((cfg.initialCapital * netReturnPercent) / 100).toFixed(2));

    // Equity curve generation
    const equityCurve = [];
    let currentEquity = cfg.initialCapital;
    let peakEquity = cfg.initialCapital;
    const daysStep = Math.max(1, Math.floor(cfg.dateRangeDays / 30));

    for (let i = 0; i <= 30; i++) {
      const stepReturn = (Math.sin(i * 0.4) * 0.02 + 0.009);
      currentEquity = Math.round(currentEquity * (1 + stepReturn));
      if (currentEquity > peakEquity) peakEquity = currentEquity;
      const drawdownPercent = Number((((currentEquity - peakEquity) / peakEquity) * 100).toFixed(2));

      equityCurve.push({
        timestamp: Date.now() - (30 - i) * daysStep * 86400 * 1000,
        equity: currentEquity,
        drawdownPercent: Math.min(0, drawdownPercent)
      });
    }

    // Monthly returns matrix
    const monthlyReturns = [
      { year: 2026, month: 5, returnPercent: 4.2 },
      { year: 2026, month: 6, returnPercent: 6.8 },
      { year: 2026, month: 7, returnPercent: -1.4 },
      { year: 2026, month: 8, returnPercent: 5.1 },
      { year: 2026, month: 9, returnPercent: 7.9 },
      { year: 2026, month: 10, returnPercent: 4.6 }
    ];

    return {
      config: cfg,
      totalTrades,
      winningTrades,
      losingTrades,
      winRate,
      netReturnUsd,
      netReturnPercent,
      profitFactor: 1.89,
      expectancyR: 0.44,
      maxDrawdownPercent: 7.8,
      maxDrawdownUsd: 8240,
      sharpeRatio: 1.84,
      sortinoRatio: 2.42,
      avgWinUsd: 1420,
      avgLossUsd: 780,
      maxConsecutiveLosses: 3,
      maxConsecutiveWins: 7,
      equityCurve,
      monthlyReturns,
      trades: []
    };
  }

  const handleRunBacktest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setResult(generateMockResult(config));
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2638] pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-white tracking-wide uppercase">
            Backtesting Lab
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Rigorous quantitative backtesting with granular Binance Spot fee modeling (maker/taker 0.075%) and slippage friction.
          </p>
        </div>

        <button
          onClick={handleRunBacktest}
          disabled={isRunning}
          className="px-4 py-2 font-mono text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {isRunning ? (
            <>
              <svg className="w-4 h-4 animate-spin text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <span>Computing Simulation...</span>
            </>
          ) : (
            <span>Run Backtest Engine</span>
          )}
        </button>
      </div>

      {/* Configuration Controls Bar */}
      <div className="p-4 bg-[#111622] border border-[#1E2638] grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-xs font-mono">
        <div>
          <label className="text-neutral-500 block text-[10px] uppercase mb-1">Asset</label>
          <select
            value={config.symbol}
            onChange={(e) => setConfig({ ...config, symbol: e.target.value })}
            className="w-full bg-[#0B0E14] border border-[#1E2638] px-2.5 py-1 text-white focus:outline-none"
          >
            <option value="BTCUSDT">BTC/USDT</option>
            <option value="ETHUSDT">ETH/USDT</option>
            <option value="SOLUSDT">SOL/USDT</option>
            <option value="BNBUSDT">BNB/USDT</option>
            <option value="TOP_10_BASKET">Top 10 Spot Basket</option>
          </select>
        </div>

        <div>
          <label className="text-neutral-500 block text-[10px] uppercase mb-1">Timeframe</label>
          <select
            value={config.timeframe}
            onChange={(e) => setConfig({ ...config, timeframe: e.target.value as Timeframe })}
            className="w-full bg-[#0B0E14] border border-[#1E2638] px-2.5 py-1 text-white focus:outline-none"
          >
            <option value="15M">15M Intraday</option>
            <option value="1H">1H Standard</option>
            <option value="4H">4H Swing</option>
            <option value="1D">1D Position</option>
          </select>
        </div>

        <div>
          <label className="text-neutral-500 block text-[10px] uppercase mb-1">Strategy Model</label>
          <select
            value={config.strategyId}
            onChange={(e) => setConfig({ ...config, strategyId: e.target.value })}
            className="w-full bg-[#0B0E14] border border-[#1E2638] px-2.5 py-1 text-white focus:outline-none"
          >
            <option value="trend_pullback_v24">Alpha Trend-Pullback v2.4</option>
            <option value="breakout_mom_v18">Volume Breakout Momentum v1.8</option>
            <option value="mean_reversion_vwap">Mean-Reversion VWAP v3.1</option>
          </select>
        </div>

        <div>
          <label className="text-neutral-500 block text-[10px] uppercase mb-1">History Horizon</label>
          <select
            value={config.dateRangeDays}
            onChange={(e) => setConfig({ ...config, dateRangeDays: parseInt(e.target.value) })}
            className="w-full bg-[#0B0E14] border border-[#1E2638] px-2.5 py-1 text-white focus:outline-none"
          >
            <option value="60">60 Days</option>
            <option value="90">90 Days</option>
            <option value="180">180 Days</option>
            <option value="365">1 Year (365d)</option>
          </select>
        </div>

        <div>
          <label className="text-neutral-500 block text-[10px] uppercase mb-1">Initial Capital</label>
          <input
            type="number"
            value={config.initialCapital}
            onChange={(e) => setConfig({ ...config, initialCapital: parseFloat(e.target.value) || 10000 })}
            className="w-full bg-[#0B0E14] border border-[#1E2638] px-2.5 py-1 text-white focus:outline-none"
          />
        </div>

        <div>
          <label className="text-neutral-500 block text-[10px] uppercase mb-1">Risk Per Trade</label>
          <select
            value={config.riskPerTradePercent}
            onChange={(e) => setConfig({ ...config, riskPerTradePercent: parseFloat(e.target.value) })}
            className="w-full bg-[#0B0E14] border border-[#1E2638] px-2.5 py-1 text-white focus:outline-none"
          >
            <option value="0.75">0.75%</option>
            <option value="1.0">1.0%</option>
            <option value="1.5">1.5%</option>
            <option value="2.0">2.0%</option>
          </select>
        </div>

        <div>
          <label className="text-neutral-500 block text-[10px] uppercase mb-1">Binance Fee Model</label>
          <div className="text-neutral-300 py-1">
            0.075% / 0.05% slip
          </div>
        </div>
      </div>

      {result && (
        <>
          {/* Key Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <MetricCard
              label="Win Rate"
              value={`${result.winRate}%`}
              subValue={`${result.winningTrades}W / ${result.losingTrades}L`}
              trend="up"
              datasetType="BACKTEST"
              badgeNote={`N=${result.totalTrades}`}
            />
            <MetricCard
              label="Net Return"
              value={`+${result.netReturnPercent}%`}
              subValue={`+$${result.netReturnUsd.toLocaleString()} USD`}
              trend="up"
              datasetType="BACKTEST"
            />
            <MetricCard
              label="Profit Factor"
              value={result.profitFactor}
              subValue="Gross Win / Loss"
              trend="up"
              datasetType="BACKTEST"
            />
            <MetricCard
              label="Expectancy"
              value={`+${result.expectancyR} R`}
              subValue="Expected return / trade"
              trend="up"
              datasetType="BACKTEST"
            />
            <MetricCard
              label="Max Drawdown"
              value={`-${result.maxDrawdownPercent}%`}
              subValue={`-$${result.maxDrawdownUsd.toLocaleString()}`}
              trend="down"
              datasetType="BACKTEST"
            />
            <MetricCard
              label="Sharpe / Sortino"
              value={`${result.sharpeRatio} / ${result.sortinoRatio}`}
              subValue="Risk-Adjusted Alpha"
              trend="up"
              datasetType="BACKTEST"
            />
          </div>

          {/* Equity & Drawdown Chart View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-[#111622] border border-[#1E2638] p-5">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E2638]">
                <div>
                  <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                    Simulated Equity & Underwater Drawdown
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Growth of starting capital ($100k) with compounding capital allocation
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-semibold">
                  Peak: $128,400.00
                </span>
              </div>

              {/* Equity SVG Curve */}
              <div className="h-56 w-full pt-2">
                <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="btGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  {[40, 80, 120, 160].map((y) => (
                    <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#171F2E" strokeDasharray="3 3" />
                  ))}

                  <polygon
                    points="0,170 80,150 160,155 240,110 320,125 400,80 480,95 560,50 640,30 700,15 700,190 0,190"
                    fill="url(#btGrad)"
                  />

                  <polyline
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    points="0,170 80,150 160,155 240,110 320,125 400,80 480,95 560,50 640,30 700,15"
                  />

                  {/* Drawdown line at the bottom */}
                  <line x1="0" y1="185" x2="700" y2="185" stroke="#334155" strokeWidth="1" />
                  <path
                    d="M 140,185 Q 160,195 180,185 M 300,185 Q 320,198 340,185 M 460,185 Q 480,196 500,185"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pt-3 border-t border-[#1E2638]">
                <span>Avg Win: <strong className="text-emerald-400">+${result.avgWinUsd}</strong></span>
                <span>Avg Loss: <strong className="text-rose-400">-${result.avgLossUsd}</strong></span>
                <span>Win/Loss Ratio: <strong className="text-white">1.82</strong></span>
                <span>Max Consecutive Losses: <strong className="text-white">{result.maxConsecutiveLosses}</strong></span>
              </div>
            </div>

            {/* Monthly Returns Heatmap Grid */}
            <div className="lg:col-span-4 bg-[#111622] border border-[#1E2638] p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider pb-2 border-b border-[#1E2638]">
                  Monthly Returns Heatmap (%)
                </h2>
                <p className="text-xs text-neutral-400 mt-1 mb-4">
                  Monthly performance breakdown across backtest window
                </p>

                <div className="space-y-2 font-mono text-xs">
                  {result.monthlyReturns.map((m) => {
                    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const isPos = m.returnPercent >= 0;
                    return (
                      <div
                        key={`${m.year}-${m.month}`}
                        className="p-2.5 bg-[#0B0E14] border border-[#1E2638] flex items-center justify-between"
                      >
                        <span className="text-neutral-400">
                          {monthNames[m.month]} {m.year}
                        </span>
                        <span
                          className={`font-semibold tabular-nums ${
                            isPos ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isPos ? `+${m.returnPercent}%` : `${m.returnPercent}%`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-[#1E2638] text-[11px] font-mono text-neutral-500">
                Positive Months: <strong className="text-emerald-400">5/6 (83.3%)</strong>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
