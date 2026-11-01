import React, { useState } from 'react';
import { TerminalSettings } from '../types';

interface SettingsViewProps {
  settings: TerminalSettings;
  onSaveSettings: (newSettings: TerminalSettings) => void;
  onResetPaperData: () => void;
  onExportData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onSaveSettings,
  onResetPaperData,
  onExportData
}) => {
  const [formData, setFormData] = useState<TerminalSettings>({ ...settings });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="border-b border-[#1E2638] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-mono font-bold text-white tracking-wide uppercase">
            Terminal Configuration & Quantitative Parameters
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Customize scanning filters, fee structures, risk boundaries, and telemetry intervals.
          </p>
        </div>
        {saveSuccess && (
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1">
            ✓ Settings Applied Successfully
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Scanner & Filter Settings */}
        <div className="bg-[#111622] border border-[#1E2638] p-5 space-y-4">
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider pb-2 border-b border-[#1E2638]">
            1. Market Scanner Filters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-neutral-400 block mb-1">
                Minimum 24h Spot Volume (USDT)
              </label>
              <input
                type="number"
                value={formData.minVolumeUsdt}
                onChange={(e) => setFormData({ ...formData, minVolumeUsdt: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-2 text-white focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 mt-0.5 block">
                Filters out low-liquidity pairs with wide orderbook spreads.
              </span>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">
                Minimum Signal Quality Score (0-100)
              </label>
              <input
                type="number"
                min="50"
                max="95"
                value={formData.minQualityScore}
                onChange={(e) => setFormData({ ...formData, minQualityScore: parseInt(e.target.value) || 70 })}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-2 text-white focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 mt-0.5 block">
                Signals below this composite score will not trigger alerts.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Risk Management & Target Multipliers */}
        <div className="bg-[#111622] border border-[#1E2638] p-5 space-y-4">
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider pb-2 border-b border-[#1E2638]">
            2. Risk Management & Position Rules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <label className="text-neutral-400 block mb-1">
                Max Risk Per Trade (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.2"
                max="5.0"
                value={formData.maxRiskPerTrade}
                onChange={(e) => setFormData({ ...formData, maxRiskPerTrade: parseFloat(e.target.value) || 1.5 })}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-2 text-white focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 mt-0.5 block">
                Standard max risk is 1.5% of total capital.
              </span>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">
                Take-Profit 1 (R)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.defaultTp1R}
                onChange={(e) => setFormData({ ...formData, defaultTp1R: parseFloat(e.target.value) || 1.0 })}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-2 text-white focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 mt-0.5 block">
                Typically trim 33% at 1.0R.
              </span>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">
                Take-Profit 2 (R)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.defaultTp2R}
                onChange={(e) => setFormData({ ...formData, defaultTp2R: parseFloat(e.target.value) || 2.0 })}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-2 text-white focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 mt-0.5 block">
                Trim secondary 33% at 2.0R.
              </span>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">
                Take-Profit 3 (R)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.defaultTp3R}
                onChange={(e) => setFormData({ ...formData, defaultTp3R: parseFloat(e.target.value) || 3.5 })}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-2 text-white focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 mt-0.5 block">
                Runner target at 3.5R.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Binance Friction Model (Fees & Slippage) */}
        <div className="bg-[#111622] border border-[#1E2638] p-5 space-y-4">
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider pb-2 border-b border-[#1E2638]">
            3. Binance Friction & Cost Model
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="text-neutral-400 block mb-1">
                Binance Maker Fee Rate (%)
              </label>
              <input
                type="number"
                step="0.005"
                value={formData.makerFeeRate}
                onChange={(e) => setFormData({ ...formData, makerFeeRate: parseFloat(e.target.value) || 0.075 })}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-2 text-white focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 mt-0.5 block">
                Default Binance VIP0 with BNB discount: 0.075%.
              </span>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">
                Binance Taker Fee Rate (%)
              </label>
              <input
                type="number"
                step="0.005"
                value={formData.takerFeeRate}
                onChange={(e) => setFormData({ ...formData, takerFeeRate: parseFloat(e.target.value) || 0.075 })}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-2 text-white focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 mt-0.5 block">
                Applied on immediate market order entries.
              </span>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">
                Slippage Model Assumption (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.slippageAssumption}
                onChange={(e) => setFormData({ ...formData, slippageAssumption: parseFloat(e.target.value) || 0.05 })}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-2 text-white focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500 mt-0.5 block">
                Simulated execution friction on spot limit fills.
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Notifications & Telemetry */}
        <div className="bg-[#111622] border border-[#1E2638] p-5 space-y-4">
          <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider pb-2 border-b border-[#1E2638]">
            4. Notifications & Background Polling
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="audioAlerts"
                checked={formData.audioAlertsEnabled}
                onChange={(e) => setFormData({ ...formData, audioAlertsEnabled: e.target.checked })}
                className="accent-emerald-500 w-4 h-4"
              />
              <label htmlFor="audioAlerts" className="text-neutral-300 cursor-pointer">
                Enable Audible Ping on New Top-Tier Signal (Score ≥ 80)
              </label>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">
                Auto-Refresh Interval (Seconds)
              </label>
              <select
                value={formData.autoRefreshIntervalSeconds}
                onChange={(e) => setFormData({ ...formData, autoRefreshIntervalSeconds: parseInt(e.target.value) })}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-2 text-white focus:outline-none"
              >
                <option value="5">5 Seconds (High Frequency)</option>
                <option value="10">10 Seconds (Standard Nominal)</option>
                <option value="30">30 Seconds (Low Bandwidth)</option>
                <option value="60">60 Seconds (Passive)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 font-mono text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-xs"
          >
            Save Quantitative Configuration
          </button>
        </div>
      </form>

      {/* Section 5: Data Management & Export */}
      <div className="bg-[#111622] border border-[#1E2638] p-5 space-y-4">
        <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider pb-2 border-b border-[#1E2638]">
          5. Data Management & Audit Export
        </h2>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <button
            onClick={onExportData}
            className="px-4 py-2 border border-[#1E2638] text-white hover:bg-[#1E2638] bg-[#0B0E14] transition-colors"
          >
            Export Trade Journal & Paper Records (JSON)
          </button>

          <button
            onClick={onResetPaperData}
            className="px-4 py-2 border border-rose-500/40 text-rose-400 hover:bg-rose-500/10 bg-[#0B0E14] transition-colors"
          >
            Reset Paper Trading Account to Initial State
          </button>
        </div>
      </div>
    </div>
  );
};
