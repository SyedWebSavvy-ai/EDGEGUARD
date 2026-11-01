import React, { useState } from 'react';
import { MarketTicker, SignalDirection, PaperPosition } from '../../types';

interface NewPaperOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pos: Omit<PaperPosition, 'id' | 'openTimestamp' | 'unrealizedPnl' | 'unrealizedPnlPercent' | 'pnlR' | 'currentValue'>) => void;
  tickers: MarketTicker[];
  initialSymbol?: string;
  initialDirection?: SignalDirection;
  initialPrice?: number;
  initialSl?: number;
  initialTp?: number;
  paperBalance: number;
}

export const NewPaperOrderModal: React.FC<NewPaperOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tickers,
  initialSymbol = 'BTCUSDT',
  initialDirection = 'BUY',
  initialPrice,
  initialSl,
  initialTp,
  paperBalance
}) => {
  const [symbol, setSymbol] = useState(initialSymbol);
  const [direction, setDirection] = useState<SignalDirection>(initialDirection);
  
  const currentTicker = tickers.find((t) => t.symbol === symbol) || tickers[0];
  const defaultPrice = initialPrice || currentTicker?.price || 96420;

  const [entryPrice, setEntryPrice] = useState<number>(defaultPrice);
  const [stopLoss, setStopLoss] = useState<number>(initialSl || Number((defaultPrice * (direction === 'BUY' ? 0.98 : 1.02)).toFixed(defaultPrice < 1 ? 6 : 2)));
  const [takeProfit, setTakeProfit] = useState<number>(initialTp || Number((defaultPrice * (direction === 'BUY' ? 1.04 : 0.96)).toFixed(defaultPrice < 1 ? 6 : 2)));
  const [positionSizeUsd, setPositionSizeUsd] = useState<number>(10000);

  if (!isOpen) return null;

  const quantity = Number((positionSizeUsd / (entryPrice || 1)).toFixed(entryPrice < 1 ? 2 : 4));
  const riskDist = Math.abs(entryPrice - stopLoss);
  const riskDollar = Number((riskDist * quantity).toFixed(2));
  const riskPctOfEquity = Number(((riskDollar / paperBalance) * 100).toFixed(2));
  const rewardDist = Math.abs(takeProfit - entryPrice);
  const rewardRiskRatio = riskDist > 0 ? Number((rewardDist / riskDist).toFixed(2)) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      symbol,
      direction,
      entryPrice,
      currentPrice: entryPrice,
      quantity,
      initialValue: positionSizeUsd,
      stopLoss,
      takeProfit,
      leverage: 1
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="w-full max-w-lg bg-[#111622] border border-[#1E2638] shadow-2xl flex flex-col font-mono text-xs">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#1E2638] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase text-sm">
              New Simulated Paper Position
            </span>
            <span className="text-[10px] text-amber-400 border border-amber-500/30 px-1.5 py-0.5 bg-amber-500/10">
              Binance Spot 1x
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 text-base leading-none"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-neutral-400 block mb-1">Trading Asset</label>
              <select
                value={symbol}
                onChange={(e) => {
                  const s = e.target.value;
                  setSymbol(s);
                  const t = tickers.find((x) => x.symbol === s);
                  if (t) {
                    setEntryPrice(t.price);
                    setStopLoss(Number((t.price * 0.98).toFixed(t.price < 1 ? 6 : 2)));
                    setTakeProfit(Number((t.price * 1.04).toFixed(t.price < 1 ? 6 : 2)));
                  }
                }}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-1.5 text-white focus:outline-none"
              >
                {tickers.map((t) => (
                  <option key={t.symbol} value={t.symbol}>
                    {t.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Direction</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('BUY')}
                  className={`flex-1 py-1.5 font-bold border transition-colors ${
                    direction === 'BUY'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                      : 'bg-[#0B0E14] text-neutral-500 border-[#1E2638]'
                  }`}
                >
                  BUY / LONG
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('SELL')}
                  className={`flex-1 py-1.5 font-bold border transition-colors ${
                    direction === 'SELL'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                      : 'bg-[#0B0E14] text-neutral-500 border-[#1E2638]'
                  }`}
                >
                  SELL / EXIT
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-neutral-400 block mb-1">Entry Price ($)</label>
              <input
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-1.5 text-white focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Stop-Loss ($)</label>
              <input
                type="number"
                step="any"
                value={stopLoss}
                onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-1.5 text-rose-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Take-Profit ($)</label>
              <input
                type="number"
                step="any"
                value={takeProfit}
                onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-1.5 text-emerald-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-neutral-400">Position Allocation (USDT)</label>
              <span className="text-neutral-500 text-[11px]">
                Available: ${paperBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <input
              type="number"
              value={positionSizeUsd}
              onChange={(e) => setPositionSizeUsd(parseFloat(e.target.value) || 100)}
              className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-1.5 text-white focus:outline-none"
              required
            />
            {/* Quick % chips */}
            <div className="flex gap-2 mt-2">
              {[5, 10, 20, 25].map((pct) => (
                <button
                  type="button"
                  key={pct}
                  onClick={() => setPositionSizeUsd(Math.round((paperBalance * pct) / 100))}
                  className="px-2 py-0.5 bg-[#0B0E14] border border-[#1E2638] hover:border-neutral-500 text-[10px] text-neutral-400"
                >
                  {pct}% (${Math.round((paperBalance * pct) / 100).toLocaleString()})
                </button>
              ))}
            </div>
          </div>

          {/* Risk & Execution Assessment Box */}
          <div className="p-3 bg-[#0B0E14] border border-[#1E2638] space-y-1.5 text-neutral-300">
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span className="text-white font-semibold">{quantity} {symbol.replace('USDT', '')}</span>
            </div>
            <div className="flex justify-between">
              <span>Dollar Risk on Stop-Loss:</span>
              <span className="text-rose-400 font-bold">${riskDollar} ({riskPctOfEquity}% of equity)</span>
            </div>
            <div className="flex justify-between">
              <span>Calculated Risk / Reward:</span>
              <span className="text-emerald-400 font-bold">1:{rewardRiskRatio}</span>
            </div>
          </div>

          {/* Compliance notice */}
          <p className="text-[10px] text-neutral-500 leading-tight">
            Simulated paper order only. No real orders are sent to Binance.
          </p>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#1E2638]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
            >
              Open Simulated Position
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
