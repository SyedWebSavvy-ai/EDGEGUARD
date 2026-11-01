import React, { useState } from 'react';

export const StrategyResearchView: React.FC = () => {
  const [activeStrategyVersion, setActiveStrategyVersion] = useState<'v2.4' | 'v2.0' | 'v1.8' | 'v3.0_EXP'>('v2.4');
  const [selectedSensitivityParam, setSelectedSensitivityParam] = useState<'ATR_SL_MULT' | 'TP_RATIO' | 'RVOL_THRESHOLD'>('ATR_SL_MULT');

  const strategyModels = [
    {
      id: 'v2.4',
      name: 'Alpha Trend-Pullback Confluence',
      status: 'PRODUCTION VALIDATED',
      expectancyR: 0.44,
      winRate: 58.4,
      profitFactor: 1.89,
      maxDd: 7.8,
      sharpe: 1.84,
      sampleSize: 482,
      inSamplePeriod: '2024-2025',
      outOfSamplePeriod: '2026 (Live Shadow)'
    },
    {
      id: 'v2.0',
      name: 'Multi-Timeframe Structure v2.0',
      status: 'DEPRECATED BENCHMARK',
      expectancyR: 0.31,
      winRate: 52.8,
      profitFactor: 1.54,
      maxDd: 11.4,
      sharpe: 1.42,
      sampleSize: 610,
      inSamplePeriod: '2023-2024',
      outOfSamplePeriod: '2025'
    },
    {
      id: 'v1.8',
      name: 'Volume Breakout Momentum v1.8',
      status: 'REGIME RESTRICTED',
      expectancyR: 0.28,
      winRate: 46.2,
      profitFactor: 1.62,
      maxDd: 14.2,
      sharpe: 1.25,
      sampleSize: 340,
      inSamplePeriod: '2024',
      outOfSamplePeriod: '2025'
    },
    {
      id: 'v3.0_EXP',
      name: 'Volatility Expansion & Liquidity Sweep (Beta)',
      status: 'EXPLORATORY RESEARCH',
      expectancyR: 0.52,
      winRate: 61.2,
      profitFactor: 2.12,
      maxDd: 8.9,
      sharpe: 1.95,
      sampleSize: 185,
      inSamplePeriod: '2025-2026',
      outOfSamplePeriod: 'PENDING VALIDATION'
    }
  ];

  // Feature attribution weights for v2.4
  const featureAttributions = [
    { factor: '4H Market Structure & EMA Slope', weight: 34, impact: 'Primary Trend Filter' },
    { factor: 'Binance Spot Relative Volume (RVOL)', weight: 24, impact: 'Liquidity Participation' },
    { factor: 'Key Demand/Supply Zone Reaction', weight: 21, impact: 'Asymmetric R:R Anchor' },
    { factor: '15M Momentum (RSI Slope & Divergence)', weight: 13, impact: 'Trigger Precision' },
    { factor: 'BTC Correlation Breadth Index', weight: 8, impact: 'Systemic Beta Protection' }
  ];

  // Regime breakdown metrics
  const regimePerformance = [
    { regime: 'Bullish Trending', winRate: 64.2, pf: 2.24, expectancy: '+0.62 R', trades: 210 },
    { regime: 'Range-Bound Consolidation', winRate: 54.0, pf: 1.65, expectancy: '+0.32 R', trades: 145 },
    { regime: 'Volatile Expansion', winRate: 51.5, pf: 1.48, expectancy: '+0.25 R', trades: 82 },
    { regime: 'Bearish Trending', winRate: 48.0, pf: 1.22, expectancy: '+0.12 R', trades: 45 }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2638] pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-white tracking-wide uppercase">
            Strategy Research & Quantitative Validation
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Factor analysis, Maximum Adverse Excursion (MAE), walk-forward validation and parameter stability testing.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-neutral-500">Active Model:</span>
          <span className="text-emerald-400 font-bold border border-emerald-500/30 px-2 py-0.5 bg-emerald-500/10">
            {activeStrategyVersion}
          </span>
        </div>
      </div>

      {/* Model Version Comparison Matrix */}
      <div className="bg-[#111622] border border-[#1E2638] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#1E2638] mb-4">
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
            Quantitative Model Comparison Matrix
          </h2>
          <span className="text-[11px] font-mono text-neutral-400">
            Standardized over Spot USDT pairs with 1.0R risk unit
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono tabular-nums">
            <thead>
              <tr className="border-b border-[#1E2638] text-neutral-400">
                <th className="py-2.5 px-3">Model Version</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Expectancy (R)</th>
                <th className="py-2.5 px-3 text-right">Win Rate</th>
                <th className="py-2.5 px-3 text-right">Profit Factor</th>
                <th className="py-2.5 px-3 text-right">Max DD</th>
                <th className="py-2.5 px-3 text-right">Sharpe</th>
                <th className="py-2.5 px-3 text-right">Sample N</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2638]">
              {strategyModels.map((m) => {
                const isSelected = activeStrategyVersion === m.id;
                return (
                  <tr
                    key={m.id}
                    className={`hover:bg-[#141A26] transition-colors ${
                      isSelected ? 'bg-[#141A26]' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-white">
                      <div>{m.name}</div>
                      <div className="text-[10px] text-neutral-500">{m.id}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 font-bold ${
                          m.status.includes('VALIDATED')
                            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                            : m.status.includes('EXPLORATORY')
                            ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                            : 'text-neutral-400 bg-neutral-800'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-400">
                      +{m.expectancyR} R
                    </td>
                    <td className="py-3 px-3 text-right text-white">
                      {m.winRate}%
                    </td>
                    <td className="py-3 px-3 text-right text-white">
                      {m.profitFactor}
                    </td>
                    <td className="py-3 px-3 text-right text-rose-400">
                      -{m.maxDd}%
                    </td>
                    <td className="py-3 px-3 text-right text-sky-400">
                      {m.sharpe}
                    </td>
                    <td className="py-3 px-3 text-right text-neutral-400">
                      {m.sampleSize}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setActiveStrategyVersion(m.id as any)}
                        className={`px-2 py-1 text-[11px] border ${
                          isSelected
                            ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                            : 'border-[#1E2638] text-neutral-400 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Active Target' : 'Select Model'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feature Attribution & MFE / MAE Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Factor Attribution (5 cols) */}
        <div className="lg:col-span-5 bg-[#111622] border border-[#1E2638] p-5 space-y-4">
          <div className="border-b border-[#1E2638] pb-2">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Feature Attribution & Factor Weights
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Relative importance contribution to signal quality score
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {featureAttributions.map((feat) => (
              <div key={feat.factor} className="space-y-1">
                <div className="flex justify-between text-neutral-200">
                  <span>{feat.factor}</span>
                  <span className="text-emerald-400 font-bold tabular-nums">{feat.weight}%</span>
                </div>
                <div className="w-full bg-[#0B0E14] h-2">
                  <div className="bg-emerald-500 h-2" style={{ width: `${feat.weight}%` }}></div>
                </div>
                <div className="text-[10px] text-neutral-500">
                  Role: {feat.impact}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#1E2638] text-[11px] font-mono text-neutral-500">
            Model Type: Multi-Factor Weighted Scoring Engine (No black-box hallucination)
          </div>
        </div>

        {/* MFE vs MAE Scatter & Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-[#111622] border border-[#1E2638] p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-[#1E2638] pb-2 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                  MFE vs MAE Excursion Distribution
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Max Adverse Excursion (Risk Drawdown) vs Max Favorable Excursion (Run-up in R)
                </p>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                Optimal SL: 1.5 ATR
              </span>
            </div>

            {/* Scatter SVG */}
            <div className="h-56 w-full pt-4">
              <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
                {/* Axes */}
                <line x1="40" y1="170" x2="480" y2="170" stroke="#334155" strokeWidth="1" />
                <line x1="40" y1="20" x2="40" y2="170" stroke="#334155" strokeWidth="1" />

                <text x="480" y="190" fill="#64748B" fontSize="9" textAnchor="end" fontFamily="monospace">MAE (Drawdown in R)</text>
                <text x="10" y="30" fill="#64748B" fontSize="9" fontFamily="monospace">MFE (+R)</text>

                {/* Grid */}
                <line x1="40" y1="120" x2="480" y2="120" stroke="#1E2638" strokeDasharray="3 3" />
                <line x1="40" y1="70" x2="480" y2="70" stroke="#1E2638" strokeDasharray="3 3" />
                <line x1="260" y1="20" x2="260" y2="170" stroke="#1E2638" strokeDasharray="3 3" />

                {/* Winning Trades (High MFE, Low MAE) */}
                <circle cx="80" cy="50" r="3.5" fill="#10B981" opacity="0.75" />
                <circle cx="110" cy="40" r="3.5" fill="#10B981" opacity="0.75" />
                <circle cx="130" cy="65" r="3.5" fill="#10B981" opacity="0.75" />
                <circle cx="160" cy="35" r="3.5" fill="#10B981" opacity="0.75" />
                <circle cx="190" cy="80" r="3.5" fill="#10B981" opacity="0.75" />
                <circle cx="100" cy="90" r="3.5" fill="#10B981" opacity="0.75" />
                <circle cx="140" cy="45" r="3.5" fill="#10B981" opacity="0.75" />
                <circle cx="210" cy="60" r="3.5" fill="#10B981" opacity="0.75" />

                {/* Losing Trades (Stopped out at 1.0R MAE) */}
                <circle cx="340" cy="155" r="3.5" fill="#EF4444" opacity="0.7" />
                <circle cx="370" cy="160" r="3.5" fill="#EF4444" opacity="0.7" />
                <circle cx="390" cy="148" r="3.5" fill="#EF4444" opacity="0.7" />
                <circle cx="410" cy="158" r="3.5" fill="#EF4444" opacity="0.7" />

                {/* Optimal Stop Threshold Boundary */}
                <line x1="320" y1="20" x2="320" y2="170" stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="4 4" />
                <text x="325" y="45" fill="#F59E0B" fontSize="9" fontFamily="monospace">Hard Stop Band (1.5R)</text>
              </svg>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1E2638] flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>Median Run-up: <strong className="text-emerald-400">+2.4R</strong></span>
            <span>Median Drawdown before Target: <strong className="text-white">0.45R</strong></span>
            <span>Early Exit Inefficiency: <strong className="text-neutral-300">12.4%</strong></span>
          </div>
        </div>
      </div>

      {/* Market Regime Performance Breakdown Table */}
      <div className="bg-[#111622] border border-[#1E2638] p-5">
        <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider mb-3 pb-2 border-b border-[#1E2638]">
          Market Regime Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {regimePerformance.map((rp) => (
            <div key={rp.regime} className="p-3 bg-[#0B0E14] border border-[#1E2638] space-y-1.5 font-mono text-xs">
              <span className="font-bold text-white block">{rp.regime}</span>
              <div className="flex justify-between text-neutral-400">
                <span>Expectancy:</span>
                <span className="text-emerald-400 font-bold">{rp.expectancy}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Win Rate:</span>
                <span className="text-white">{rp.winRate}%</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Profit Factor:</span>
                <span className="text-white">{rp.pf}</span>
              </div>
              <div className="flex justify-between text-neutral-500 text-[10px] pt-1 border-t border-[#1E2638]">
                <span>Sample Size:</span>
                <span>N = {rp.trades}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
