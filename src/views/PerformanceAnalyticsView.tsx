import React, { useState } from 'react';
import { MetricCard } from '../components/common/MetricCard';

export const PerformanceAnalyticsView: React.FC = () => {
  const [activeDataset, setActiveDataset] = useState<'BACKTEST' | 'PAPER' | 'JOURNAL'>('BACKTEST');

  // Segregated Dataset Profiles (strictly isolated per prompt instructions)
  const datasets = {
    BACKTEST: {
      title: 'Historical Quantitative Backtest Model',
      disclaimer: 'Pure in-sample and out-of-sample simulation across historical Binance Spot klines.',
      sampleN: 482,
      winRate: 58.4,
      netPnlUsd: 28400,
      netReturnPct: 28.4,
      expectancyR: 0.44,
      profitFactor: 1.89,
      maxDrawdownPct: 7.8,
      sharpe: 1.84,
      directionStats: {
        buy: { trades: 340, winRate: 61.2, pf: 2.05, expectancy: '+0.51 R' },
        sell: { trades: 142, winRate: 51.4, pf: 1.52, expectancy: '+0.27 R' }
      },
      timeframeStats: [
        { tf: '15M Intraday', winRate: 52.4, pf: 1.58, expectancy: '+0.28 R', trades: 194 },
        { tf: '1H Standard', winRate: 60.1, pf: 1.94, expectancy: '+0.48 R', trades: 182 },
        { tf: '4H Swing', winRate: 64.8, pf: 2.26, expectancy: '+0.62 R', trades: 88 },
        { tf: '1D Position', winRate: 66.7, pf: 2.45, expectancy: '+0.74 R', trades: 18 }
      ],
      symbolStats: [
        { symbol: 'BTCUSDT', trades: 110, winRate: 62.7, pnl: '+$11,400', pf: 2.15 },
        { symbol: 'ETHUSDT', trades: 95, winRate: 56.8, pnl: '+$6,820', pf: 1.76 },
        { symbol: 'SOLUSDT', trades: 84, winRate: 60.7, pnl: '+$7,150', pf: 2.04 },
        { symbol: 'BNBUSDT', trades: 52, winRate: 53.8, pnl: '+$2,210', pf: 1.62 },
        { symbol: 'AVAXUSDT', trades: 48, winRate: 56.2, pnl: '+$1,940', pf: 1.70 }
      ]
    },
    PAPER: {
      title: 'Simulated Paper Trading Track Record',
      disclaimer: 'Real-time forward paper trades executed in live forward market conditions with virtual equity.',
      sampleN: 32,
      winRate: 62.5,
      netPnlUsd: 1450.8,
      netReturnPct: 1.45,
      expectancyR: 0.52,
      profitFactor: 2.10,
      maxDrawdownPct: 2.4,
      sharpe: 2.15,
      directionStats: {
        buy: { trades: 26, winRate: 65.4, pf: 2.25, expectancy: '+0.58 R' },
        sell: { trades: 6, winRate: 50.0, pf: 1.45, expectancy: '+0.25 R' }
      },
      timeframeStats: [
        { tf: '15M Intraday', winRate: 55.6, pf: 1.72, expectancy: '+0.34 R', trades: 9 },
        { tf: '1H Standard', winRate: 64.7, pf: 2.18, expectancy: '+0.56 R', trades: 17 },
        { tf: '4H Swing', winRate: 66.7, pf: 2.40, expectancy: '+0.68 R', trades: 6 },
        { tf: '1D Position', winRate: 0, pf: 0, expectancy: '0 R', trades: 0 }
      ],
      symbolStats: [
        { symbol: 'BTCUSDT', trades: 10, winRate: 70.0, pnl: '+$580.40', pf: 2.50 },
        { symbol: 'SOLUSDT', trades: 8, winRate: 62.5, pnl: '+$445.20', pf: 2.10 },
        { symbol: 'ETHUSDT', trades: 6, winRate: 50.0, pnl: '+$190.15', pf: 1.65 },
        { symbol: 'NEARUSDT', trades: 4, winRate: 75.0, pnl: '+$235.05', pf: 2.80 }
      ]
    },
    JOURNAL: {
      title: 'Manual Binance Real-World Journal',
      disclaimer: 'Self-reported manual executions by the user directly on Binance Spot terminal.',
      sampleN: 18,
      winRate: 61.1,
      netPnlUsd: 840.5,
      netReturnPct: 4.2,
      expectancyR: 0.48,
      profitFactor: 1.95,
      maxDrawdownPct: 3.8,
      sharpe: 1.78,
      directionStats: {
        buy: { trades: 15, winRate: 66.7, pf: 2.15, expectancy: '+0.54 R' },
        sell: { trades: 3, winRate: 33.3, pf: 1.10, expectancy: '+0.15 R' }
      },
      timeframeStats: [
        { tf: '15M Intraday', winRate: 50.0, pf: 1.40, expectancy: '+0.20 R', trades: 4 },
        { tf: '1H Standard', winRate: 63.6, pf: 2.05, expectancy: '+0.52 R', trades: 11 },
        { tf: '4H Swing', winRate: 66.7, pf: 2.30, expectancy: '+0.65 R', trades: 3 },
        { tf: '1D Position', winRate: 0, pf: 0, expectancy: '0 R', trades: 0 }
      ],
      symbolStats: [
        { symbol: 'BTCUSDT', trades: 7, winRate: 71.4, pnl: '+$410.20', pf: 2.60 },
        { symbol: 'SOLUSDT', trades: 5, winRate: 60.0, pnl: '+$280.10', pf: 1.95 },
        { symbol: 'ETHUSDT', trades: 4, winRate: 50.0, pnl: '+$95.20', pf: 1.45 },
        { symbol: 'AVAXUSDT', trades: 2, winRate: 50.0, pnl: '+$55.00', pf: 1.50 }
      ]
    }
  };

  const current = datasets[activeDataset];

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Segregation Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2638] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-mono font-bold text-white tracking-wide uppercase">
              Performance Analytics
            </h1>
            <span className="text-xs font-mono text-sky-400 border border-sky-500/30 px-2 py-0.5 bg-sky-500/10">
              SEGREGATED DATASETS
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Statistical breakdown strictly isolated between Backtest simulations, Forward Paper Trading, and Manual Binance executions.
          </p>
        </div>

        {/* Dataset Switcher Tabs */}
        <div className="flex items-center bg-[#0B0E14] border border-[#1E2638] p-1">
          <button
            onClick={() => setActiveDataset('BACKTEST')}
            className={`px-3 py-1 font-mono text-xs font-semibold transition-colors ${
              activeDataset === 'BACKTEST'
                ? 'bg-[#1E2638] text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            1. Historical Backtest
          </button>
          <button
            onClick={() => setActiveDataset('PAPER')}
            className={`px-3 py-1 font-mono text-xs font-semibold transition-colors ${
              activeDataset === 'PAPER'
                ? 'bg-[#1E2638] text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            2. Forward Paper Trading
          </button>
          <button
            onClick={() => setActiveDataset('JOURNAL')}
            className={`px-3 py-1 font-mono text-xs font-semibold transition-colors ${
              activeDataset === 'JOURNAL'
                ? 'bg-[#1E2638] text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            3. Manual Live Journal
          </button>
        </div>
      </div>

      {/* Dataset Description Banner */}
      <div className="p-3 bg-[#111622] border border-[#1E2638] flex items-center justify-between text-xs font-mono text-neutral-300">
        <div>
          Active Dataset: <strong className="text-white">{current.title}</strong>
          <span className="text-neutral-500 mx-2">·</span>
          <span className="text-neutral-400">{current.disclaimer}</span>
        </div>
        <span className="text-neutral-400">Sample Size: <strong className="text-white">N = {current.sampleN}</strong></span>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Win Rate"
          value={`${current.winRate}%`}
          subValue="Realized Outcomes"
          trend="up"
          datasetType={activeDataset === 'BACKTEST' ? 'BACKTEST' : activeDataset === 'PAPER' ? 'PAPER' : 'LIVE_JOURNAL'}
        />
        <MetricCard
          label="Expectancy"
          value={`+${current.expectancyR} R`}
          subValue="Per Risk Unit"
          trend="up"
          datasetType={activeDataset === 'BACKTEST' ? 'BACKTEST' : activeDataset === 'PAPER' ? 'PAPER' : 'LIVE_JOURNAL'}
        />
        <MetricCard
          label="Profit Factor"
          value={current.profitFactor}
          subValue="Gross Gains / Losses"
          trend="up"
          datasetType={activeDataset === 'BACKTEST' ? 'BACKTEST' : activeDataset === 'PAPER' ? 'PAPER' : 'LIVE_JOURNAL'}
        />
        <MetricCard
          label="Max Drawdown"
          value={`-${current.maxDrawdownPct}%`}
          subValue="Peak-to-Trough"
          trend="down"
          datasetType={activeDataset === 'BACKTEST' ? 'BACKTEST' : activeDataset === 'PAPER' ? 'PAPER' : 'LIVE_JOURNAL'}
        />
        <MetricCard
          label="Net Return"
          value={`+${current.netReturnPct}%`}
          subValue={`+$${current.netPnlUsd.toLocaleString()}`}
          trend="up"
          datasetType={activeDataset === 'BACKTEST' ? 'BACKTEST' : activeDataset === 'PAPER' ? 'PAPER' : 'LIVE_JOURNAL'}
        />
        <MetricCard
          label="Sharpe Ratio"
          value={current.sharpe}
          subValue="Annualized"
          trend="up"
          datasetType={activeDataset === 'BACKTEST' ? 'BACKTEST' : activeDataset === 'PAPER' ? 'PAPER' : 'LIVE_JOURNAL'}
        />
      </div>

      {/* Direction & Timeframe Performance Breakdown Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* By Direction: Long (BUY) vs Short (SELL/EXIT) */}
        <div className="bg-[#111622] border border-[#1E2638] p-5 space-y-4">
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider pb-2 border-b border-[#1E2638]">
            Performance by Trade Direction
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#0B0E14] border border-emerald-500/30 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-[#1E2638]">
                <span className="font-bold text-emerald-400">BUY / ACCUMULATION</span>
                <span className="text-neutral-500">{current.directionStats.buy.trades} Trades</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Win Rate:</span>
                <span className="font-semibold text-white">{current.directionStats.buy.winRate}%</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Expectancy:</span>
                <span className="font-bold text-emerald-400">{current.directionStats.buy.expectancy}</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Profit Factor:</span>
                <span className="text-white">{current.directionStats.buy.pf}</span>
              </div>
            </div>

            <div className="p-4 bg-[#0B0E14] border border-rose-500/30 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-[#1E2638]">
                <span className="font-bold text-rose-400">SELL / DISTRIBUTION</span>
                <span className="text-neutral-500">{current.directionStats.sell.trades} Trades</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Win Rate:</span>
                <span className="font-semibold text-white">{current.directionStats.sell.winRate}%</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Expectancy:</span>
                <span className="font-bold text-emerald-400">{current.directionStats.sell.expectancy}</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Profit Factor:</span>
                <span className="text-white">{current.directionStats.sell.pf}</span>
              </div>
            </div>
          </div>
        </div>

        {/* By Timeframe */}
        <div className="bg-[#111622] border border-[#1E2638] p-5 space-y-4">
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider pb-2 border-b border-[#1E2638]">
            Performance by Timeframe Horizon
          </h2>

          <div className="space-y-2 font-mono text-xs">
            {current.timeframeStats.map((tf) => (
              <div
                key={tf.tf}
                className="p-2.5 bg-[#0B0E14] border border-[#1E2638] flex items-center justify-between"
              >
                <div className="font-bold text-white w-28">{tf.tf}</div>
                <div className="text-neutral-400 text-right w-20">
                  <span className="text-neutral-500 text-[10px] block">TRADES</span>
                  <span>{tf.trades}</span>
                </div>
                <div className="text-neutral-400 text-right w-24">
                  <span className="text-neutral-500 text-[10px] block">WIN RATE</span>
                  <span className="text-white">{tf.winRate}%</span>
                </div>
                <div className="text-neutral-400 text-right w-24">
                  <span className="text-neutral-500 text-[10px] block">PROFIT FACTOR</span>
                  <span className="text-white">{tf.pf}</span>
                </div>
                <div className="text-right w-24">
                  <span className="text-neutral-500 text-[10px] block">EXPECTANCY</span>
                  <span className="font-bold text-emerald-400">{tf.expectancy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Symbol Breakdown Table */}
      <div className="bg-[#111622] border border-[#1E2638] p-5">
        <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider pb-3 mb-3 border-b border-[#1E2638]">
          Symbol Performance Breakdown
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono tabular-nums">
            <thead>
              <tr className="border-b border-[#1E2638] text-neutral-400">
                <th className="py-2.5 px-3">Symbol</th>
                <th className="py-2.5 px-3 text-right">Trades Executed</th>
                <th className="py-2.5 px-3 text-right">Win Rate</th>
                <th className="py-2.5 px-3 text-right">Profit Factor</th>
                <th className="py-2.5 px-3 text-right">Net P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2638]">
              {current.symbolStats.map((s) => (
                <tr key={s.symbol} className="hover:bg-[#141A26]">
                  <td className="py-2.5 px-3 font-bold text-white">{s.symbol}</td>
                  <td className="py-2.5 px-3 text-right text-neutral-300">{s.trades}</td>
                  <td className="py-2.5 px-3 text-right text-white">{s.winRate}%</td>
                  <td className="py-2.5 px-3 text-right text-white">{s.pf}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{s.pnl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
