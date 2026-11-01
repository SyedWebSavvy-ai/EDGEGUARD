import React, { useState } from 'react';
import { TradeSignal, SignalDirection } from '../types';

interface SignalsCenterViewProps {
  signals: TradeSignal[];
  onSelectCoin: (symbol: string) => void;
  onOpenPaperOrder: (symbol: string, direction: SignalDirection, price: number, sl?: number, tp?: number) => void;
}

export const SignalsCenterView: React.FC<SignalsCenterViewProps> = ({
  signals,
  onSelectCoin,
  onOpenPaperOrder
}) => {
  const [directionFilter, setDirectionFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [selectedSignalId, setSelectedSignalId] = useState<string | null>(signals[0]?.id || null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const filteredSignals = signals.filter((s) => {
    if (directionFilter !== 'ALL' && s.direction !== directionFilter) return false;
    return true;
  });

  const activeSignal = signals.find((s) => s.id === selectedSignalId) || filteredSignals[0] || signals[0];

  const handleCopyParameters = (signal: TradeSignal) => {
    const text = `EDGEGUARD SPOT SIGNAL: ${signal.symbol} ${signal.direction}\nEntry: $${signal.entryMin} - $${signal.entryMax}\nStop Loss: $${signal.stopLoss}\nTP1 (1.0R): $${signal.takeProfit1}\nTP2 (2.0R): $${signal.takeProfit2}\nTP3 (3.5R): $${signal.takeProfit3}\nMax Risk: 1.5%`;
    navigator.clipboard?.writeText(text);
    setCopyFeedback(signal.id);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  const formatPrice = (p: number) => {
    return p < 1 ? p.toFixed(6) : p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Disclosures */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2638] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-mono font-bold text-white tracking-wide uppercase">
              Signals Center
            </h1>
            <span className="text-xs font-mono text-emerald-400 border border-emerald-500/30 px-2 py-0.5 bg-emerald-500/10">
              {signals.length} ACTIVE SETUPS
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Institutional multi-timeframe quantitative setups. Designed for manual Binance Spot execution with pre-calculated ATR risk bands.
          </p>
        </div>

        {/* Direction Filter Bar */}
        <div className="flex items-center gap-1 font-mono text-xs">
          <span className="text-neutral-500 mr-1">Direction:</span>
          {(['ALL', 'BUY', 'SELL'] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => setDirectionFilter(dir)}
              className={`px-3 py-1 font-medium border transition-colors ${
                directionFilter === dir
                  ? dir === 'BUY'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                    : dir === 'SELL'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                    : 'bg-[#1E2638] text-white border-neutral-600'
                  : 'bg-[#0B0E14] text-neutral-400 border-[#1E2638] hover:text-white'
              }`}
            >
              {dir}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Split: Signal Card Grid & Deep Reasoning Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Signal Cards List (5 columns) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-mono uppercase text-neutral-400 pb-1 flex justify-between">
            <span>Available Signals</span>
            <span>Sorted by Composite Score</span>
          </div>

          <div className="space-y-3 max-h-[820px] overflow-y-auto pr-1">
            {filteredSignals.map((sig) => {
              const isSelected = sig.id === activeSignal?.id;
              const isBuy = sig.direction === 'BUY';
              return (
                <div
                  key={sig.id}
                  onClick={() => setSelectedSignalId(sig.id)}
                  className={`p-4 bg-[#111622] border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-[#141A26]'
                      : 'border-[#1E2638] hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#1E2638]/70">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-base">
                        {sig.symbol}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 font-bold ${
                          isBuy
                            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                            : 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
                        }`}
                      >
                        {sig.direction}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-neutral-500 block uppercase font-mono">Score</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                        {sig.qualityScore}/100
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono tabular-nums text-neutral-400 my-2.5">
                    <div>
                      <span className="text-neutral-500 text-[10px] block">ENTRY ZONE</span>
                      <span className="text-white font-medium">${formatPrice(sig.entryMin)} - ${formatPrice(sig.entryMax)}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">STOP LOSS</span>
                      <span className="text-rose-400 font-medium">${formatPrice(sig.stopLoss)} (-{sig.riskPercent}%)</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">TARGET 1 (1.0R)</span>
                      <span className="text-emerald-400 font-medium">${formatPrice(sig.takeProfit1)}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 text-[10px] block">RISK / REWARD</span>
                      <span className="text-white font-medium">1:{sig.riskRewardRatio}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#1E2638]/50 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                    <span>{sig.regime}</span>
                    <span>Expiry: 6h 40m</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Comprehensive Signal Deep Dive & Confirmation Inspector (7 columns) */}
        {activeSignal && (
          <div className="lg:col-span-7 bg-[#111622] border border-[#1E2638] p-6 space-y-6">
            {/* Header Lockup */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-[#1E2638]">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-mono font-bold text-white tracking-tight">
                    {activeSignal.symbol} SPOT
                  </h2>
                  <span
                    className={`text-xs font-mono px-2 py-0.5 font-bold ${
                      activeSignal.direction === 'BUY'
                        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                        : 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
                    }`}
                  >
                    {activeSignal.direction}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    ID: {activeSignal.id}
                  </span>
                </div>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Strategy: <strong className="text-neutral-200">{activeSignal.strategyName}</strong> ({activeSignal.strategyVersion}) · Regime: <strong className="text-neutral-200">{activeSignal.regime}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyParameters(activeSignal)}
                  className="px-3 py-1.5 text-xs font-mono border border-[#1E2638] text-neutral-300 hover:text-white bg-[#0B0E14] transition-colors"
                >
                  {copyFeedback === activeSignal.id ? '✓ Parameters Copied' : 'Copy Parameters'}
                </button>
                <button
                  onClick={() =>
                    onOpenPaperOrder(
                      activeSignal.symbol,
                      activeSignal.direction,
                      activeSignal.entryPrice,
                      activeSignal.stopLoss,
                      activeSignal.takeProfit2
                    )
                  }
                  className="px-3 py-1.5 text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors"
                >
                  Simulate in Paper Trading
                </button>
                <button
                  onClick={() => onSelectCoin(activeSignal.symbol)}
                  className="px-3 py-1.5 text-xs font-mono text-sky-400 border border-sky-500/30 hover:border-sky-500/60 bg-sky-500/10"
                >
                  Inspect Chart
                </button>
              </div>
            </div>

            {/* Execution Parameter Matrix */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider mb-2">
                Execution Parameters (Spot Market Order / Limit Zone)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#0B0E14] border border-[#1E2638] p-4 text-xs font-mono tabular-nums">
                <div>
                  <span className="text-neutral-500 block text-[10px]">ENTRY ACCUMULATION ZONE</span>
                  <span className="text-white font-semibold text-sm">
                    ${formatPrice(activeSignal.entryMin)} - ${formatPrice(activeSignal.entryMax)}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">HARD STOP-LOSS</span>
                  <span className="text-rose-400 font-semibold text-sm">
                    ${formatPrice(activeSignal.stopLoss)} (-{activeSignal.riskPercent}%)
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">TAKE-PROFIT 1 (1.0R)</span>
                  <span className="text-emerald-400 font-semibold text-sm">
                    ${formatPrice(activeSignal.takeProfit1)}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">TAKE-PROFIT 2 (2.0R)</span>
                  <span className="text-emerald-400 font-semibold text-sm">
                    ${formatPrice(activeSignal.takeProfit2)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono text-neutral-500 px-1 mt-1">
                <span>Extended Target 3 (3.5R): ${formatPrice(activeSignal.takeProfit3)}</span>
                <span>Max Position Risk: 1.5% equity cap</span>
              </div>
            </div>

            {/* Multi-Timeframe Confirmation Matrix */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-neutral-400 tracking-wider mb-2">
                Multi-Timeframe Confirmation Checklist
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {Object.values(activeSignal.confirmations).map((c) => (
                  <div
                    key={c.timeframe}
                    className="p-3 bg-[#0B0E14] border border-[#1E2638] space-y-1.5 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between border-b border-[#1E2638] pb-1">
                      <span className="font-bold text-white">{c.timeframe}</span>
                      <span
                        className={`text-[10px] font-bold ${
                          c.bias === 'BULLISH'
                            ? 'text-emerald-400'
                            : c.bias === 'BEARISH'
                            ? 'text-rose-400'
                            : 'text-neutral-400'
                        }`}
                      >
                        {c.bias}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400 leading-tight">
                      {c.description}
                    </div>
                    <div className="text-[10px] text-neutral-500 pt-1 border-t border-[#1E2638]">
                      RSI: <span className="text-neutral-300">{c.rsiValue}</span> · Structure: <span className="text-neutral-300">{c.structure}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Systematic Reasoning & Evidence Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bullish Evidence */}
              <div className="p-4 bg-[#0B0E14] border border-[#1E2638] space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500"></span> Bullish Technical Evidence
                </span>
                <ul className="space-y-1.5 text-xs font-mono text-neutral-300">
                  {activeSignal.reasoning.bullishEvidence.map((ev, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-500">✓</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bearish Counter-Evidence & Counter-Arguments */}
              <div className="p-4 bg-[#0B0E14] border border-[#1E2638] space-y-2">
                <span className="text-xs font-mono font-bold uppercase text-rose-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-rose-500"></span> Bearish Counter-Evidence & Headwinds
                </span>
                <ul className="space-y-1.5 text-xs font-mono text-neutral-300">
                  {activeSignal.reasoning.bearishCounterEvidence.map((ev, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-500">⚠</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Invalidation Criteria & Risk Warnings */}
            <div className="p-4 bg-[#0B0E14] border border-amber-500/20 space-y-2">
              <span className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-amber-500"></span> Strict Invalidation Conditions & Risk Advisory
              </span>
              <div className="space-y-1 text-xs font-mono text-neutral-300">
                {activeSignal.reasoning.invalidationCriteria.map((inv, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500">✕</span>
                    <span>{inv}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] font-mono text-neutral-500 pt-2 border-t border-[#1E2638]">
                EDGEGUARD does NOT automatically execute orders. If invalidation triggers, manually exit or cancel resting orders on Binance.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
