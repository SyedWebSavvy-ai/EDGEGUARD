import React, { useState, useEffect } from 'react';
import { MarketTicker, Timeframe, Candle, TradeSignal, SignalDirection } from '../types';
import { binanceService } from '../services/binanceService';
import { CandlestickChart } from '../components/common/CandlestickChart';

interface CoinDetailViewProps {
  selectedSymbol: string;
  tickers: MarketTicker[];
  signals: TradeSignal[];
  onSelectCoin: (symbol: string) => void;
  onOpenPaperOrder: (symbol: string, direction: SignalDirection, price: number) => void;
}

export const CoinDetailView: React.FC<CoinDetailViewProps> = ({
  selectedSymbol,
  tickers,
  signals,
  onSelectCoin,
  onOpenPaperOrder
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1H');
  const [candles, setCandles] = useState<Candle[]>([]);

  const currentTicker = tickers.find((t) => t.symbol === selectedSymbol) || tickers[0];
  const currentSignal = signals.find((s) => s.symbol === selectedSymbol);

  useEffect(() => {
    if (currentTicker) {
      const generated = binanceService.generateCandles(currentTicker.symbol, timeframe, 65);
      setCandles(generated);
    }
  }, [selectedSymbol, timeframe, currentTicker?.price]);

  const formatPrice = (p: number) => {
    if (p === undefined) return '0.00';
    return p < 1 ? p.toFixed(6) : p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const isBuy = currentTicker?.signalDirection === 'BUY';
  const isSell = currentTicker?.signalDirection === 'SELL';

  // Multi-timeframe summary metrics
  const mtfData = [
    { tf: '1D', trend: 'Bullish Trend', rsi: 62.4, structure: 'Higher Highs (HH)', macd: 'Bullish Expansion' },
    { tf: '4H', trend: 'Strong Bull', rsi: 59.8, structure: 'Break of Structure (BOS)', macd: 'Positive Histogram' },
    { tf: '1H', trend: 'Consolidation', rsi: 54.1, structure: 'Demand Zone Hold', macd: 'Neutral Re-cross' },
    { tf: '15M', trend: 'Bullish Momentum', rsi: 61.2, structure: 'Higher Low (HL)', macd: 'Bullish Crossover' },
    { tf: '5M', trend: 'Volume Expansion', rsi: 58.5, structure: 'Breakout Squeeze', macd: 'Expanding Positive' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Symbol Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E2638] pb-4">
        <div className="flex items-center gap-4">
          {/* Symbol Select Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-500">Asset:</span>
            <select
              value={currentTicker.symbol}
              onChange={(e) => onSelectCoin(e.target.value)}
              className="bg-[#0B0E14] border border-[#1E2638] px-3 py-1.5 text-sm font-mono font-bold text-white focus:outline-none"
            >
              {tickers.map((t) => (
                <option key={t.symbol} value={t.symbol}>
                  {t.symbol} — {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-lg font-bold text-white tabular-nums">${formatPrice(currentTicker.price)}</span>
            <span className={`font-semibold tabular-nums ${currentTicker.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {currentTicker.change24h >= 0 ? '+' : ''}{currentTicker.change24h}%
            </span>
          </div>
        </div>

        {/* Action Button & Meta */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenPaperOrder(currentTicker.symbol, isSell ? 'SELL' : 'BUY', currentTicker.price)}
            className="px-3.5 py-1.5 text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-xs"
          >
            + Simulate Paper Order
          </button>
        </div>
      </div>

      {/* Candlestick & Volume Chart */}
      <div className="w-full">
        <CandlestickChart
          symbol={currentTicker.symbol}
          candles={candles}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
          height={480}
        />
      </div>

      {/* Two Column Analysis: Multi-Timeframe Matrix + Signal Reasoning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Multi-Timeframe Structural Analysis (5 cols) */}
        <div className="lg:col-span-5 bg-[#111622] border border-[#1E2638] p-5 space-y-4">
          <div className="border-b border-[#1E2638] pb-2">
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              Multi-Timeframe Structure Matrix
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Comparative analysis across 5 key institutional timeframes
            </p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {mtfData.map((item) => (
              <div
                key={item.tf}
                className="p-3 bg-[#0B0E14] border border-[#1E2638] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{item.tf}</span>
                  <span className="text-emerald-400 font-semibold">{item.trend}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                  <span>Market Structure:</span>
                  <span className="text-neutral-200">{item.structure}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                  <span>RSI(14) Momentum:</span>
                  <span className="text-neutral-200 tabular-nums">{item.rsi}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                  <span>MACD Cycle:</span>
                  <span className="text-sky-300">{item.macd}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#1E2638] text-[11px] font-mono text-neutral-500">
            Confluence Consensus: <strong className="text-emerald-400 font-semibold">4/5 Bullish Structural Alignment</strong>
          </div>
        </div>

        {/* Right Column: Algorithmic Signal Reasoning & Price Targets (7 cols) */}
        <div className="lg:col-span-7 bg-[#111622] border border-[#1E2638] p-5 space-y-5">
          <div className="border-b border-[#1E2638] pb-2 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
                Systematic Trading Thesis & Reasoning
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Mathematical model output based on liquidity nodes and volatility
              </p>
            </div>
            {currentSignal && (
              <span className="text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30 px-2 py-0.5 bg-emerald-500/10">
                Score: {currentSignal.qualityScore}/100
              </span>
            )}
          </div>

          {currentSignal ? (
            <div className="space-y-4">
              <div className="p-3 bg-[#0B0E14] border border-[#1E2638] text-xs font-mono text-neutral-300 leading-relaxed">
                {currentSignal.reasoning.summary}
              </div>

              {/* Targets and Stop loss grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-mono tabular-nums">
                <div className="p-2.5 bg-[#0B0E14] border border-[#1E2638]">
                  <span className="text-[10px] text-neutral-500 block">ENTRY ZONE</span>
                  <span className="text-white font-semibold">${formatPrice(currentSignal.entryMin)} - ${formatPrice(currentSignal.entryMax)}</span>
                </div>
                <div className="p-2.5 bg-[#0B0E14] border border-[#1E2638]">
                  <span className="text-[10px] text-neutral-500 block">STOP-LOSS</span>
                  <span className="text-rose-400 font-semibold">${formatPrice(currentSignal.stopLoss)} (-{currentSignal.riskPercent}%)</span>
                </div>
                <div className="p-2.5 bg-[#0B0E14] border border-[#1E2638]">
                  <span className="text-[10px] text-neutral-500 block">TP1 (1.0R)</span>
                  <span className="text-emerald-400 font-semibold">${formatPrice(currentSignal.takeProfit1)}</span>
                </div>
                <div className="p-2.5 bg-[#0B0E14] border border-[#1E2638]">
                  <span className="text-[10px] text-neutral-500 block">TP2 (2.0R)</span>
                  <span className="text-emerald-400 font-semibold">${formatPrice(currentSignal.takeProfit2)}</span>
                </div>
              </div>

              {/* Bullish & Bearish Points */}
              <div className="space-y-3">
                <div className="p-3 bg-[#0B0E14] border border-[#1E2638] text-xs font-mono">
                  <span className="font-bold text-emerald-400 block mb-1">Algorithmic Support Points:</span>
                  <ul className="space-y-1 text-neutral-300">
                    {currentSignal.reasoning.bullishEvidence.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">✓</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-[#0B0E14] border border-[#1E2638] text-xs font-mono">
                  <span className="font-bold text-amber-400 block mb-1">Key Invalidation Thresholds:</span>
                  <ul className="space-y-1 text-neutral-300">
                    {currentSignal.reasoning.invalidationCriteria.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">✕</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs font-mono text-neutral-500">
              No high-conviction signal setup currently active for this symbol. Market condition is currently classified as {currentTicker.regime}.
            </div>
          )}

          {/* Binance Spot Orderbook & Liquidity Depth Summary */}
          <div className="p-4 bg-[#0B0E14] border border-[#1E2638] flex flex-wrap items-center justify-between text-xs font-mono text-neutral-400">
            <div>
              <span>Liquidity Tier: <strong className="text-neutral-200">{currentTicker.liquidityTier}</strong></span>
              <span className="mx-2 text-neutral-700">·</span>
              <span>24h Relative Volume: <strong className="text-sky-300">{currentTicker.rvol}x</strong></span>
            </div>
            <div>
              <span>Spread: <strong className="text-emerald-400">0.01%</strong> (Optimal for manual entry)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
