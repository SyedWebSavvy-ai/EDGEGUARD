import React, { useState } from 'react';
import { JournalEntry, SignalDirection, MarketRegimeType, MarketTicker } from '../../types';

interface NewJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: JournalEntry) => void;
  tickers: MarketTicker[];
}

export const NewJournalEntryModal: React.FC<NewJournalEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tickers
}) => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [direction, setDirection] = useState<SignalDirection>('BUY');
  const [entryPrice, setEntryPrice] = useState<number>(95200);
  const [exitPrice, setExitPrice] = useState<number>(96800);
  const [stopLoss, setStopLoss] = useState<number>(94100);
  const [quantity, setQuantity] = useState<number>(0.1);
  const [fees, setFees] = useState<number>(14.5);
  const [reasonForEntry, setReasonForEntry] = useState('EDGEGUARD 4H signal confluence with 50 EMA bounce');
  const [reasonForExit, setReasonForExit] = useState('Hit TP1 target. Scaled out 100% position size.');
  const [signalReference, setSignalReference] = useState('EG-SIG-BTC-1000');
  const [disciplineRating, setDisciplineRating] = useState<number>(5);
  const [notes, setNotes] = useState('Strict execution. Patiently waited for 15M candle to close.');
  const [marketRegime, setMarketRegime] = useState<MarketRegimeType>('Bullish Trending');

  if (!isOpen) return null;

  const grossPnl = direction === 'BUY'
    ? (exitPrice - entryPrice) * quantity
    : (entryPrice - exitPrice) * quantity;
  const netPnl = Number((grossPnl - fees).toFixed(2));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

    const newEntry: JournalEntry = {
      id: `TJ-${Date.now().toString().slice(-6)}`,
      symbol,
      direction,
      entryPrice,
      exitPrice,
      stopLoss,
      quantity,
      fees,
      netPnl,
      openDate: dateStr,
      closeDate: dateStr,
      reasonForEntry,
      reasonForExit,
      signalReference,
      disciplineRating,
      notes,
      marketRegime
    };

    onSubmit(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="w-full max-w-xl bg-[#111622] border border-[#1E2638] shadow-2xl flex flex-col font-mono text-xs">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1E2638] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase text-sm">
              Record Binance Spot Manual Trade
            </span>
            <span className="text-[10px] text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 bg-emerald-500/10">
              Audit Journal
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 text-base leading-none"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-neutral-400 block mb-1">Asset</label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-2.5 py-1.5 text-white focus:outline-none"
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
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as SignalDirection)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-2.5 py-1.5 text-white focus:outline-none"
              >
                <option value="BUY">BUY / LONG</option>
                <option value="SELL">SELL / SHORT</option>
              </select>
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Market Regime</label>
              <select
                value={marketRegime}
                onChange={(e) => setMarketRegime(e.target.value as MarketRegimeType)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-2.5 py-1.5 text-white focus:outline-none"
              >
                <option value="Bullish Trending">Bullish Trending</option>
                <option value="Bearish Trending">Bearish Trending</option>
                <option value="Range-Bound Consolidation">Range Consolidation</option>
                <option value="Volatile Expansion">Volatile Expansion</option>
              </select>
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
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-2.5 py-1.5 text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Exit Price ($)</label>
              <input
                type="number"
                step="any"
                value={exitPrice}
                onChange={(e) => setExitPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-2.5 py-1.5 text-white focus:outline-none"
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
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-2.5 py-1.5 text-rose-400 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-400 block mb-1">Quantity (Units)</label>
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-2.5 py-1.5 text-white focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Binance Fees Paid ($)</label>
              <input
                type="number"
                step="any"
                value={fees}
                onChange={(e) => setFees(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-2.5 py-1.5 text-neutral-300 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="p-3 bg-[#0B0E14] border border-[#1E2638] flex items-center justify-between">
            <span className="text-neutral-400">Calculated Net P&L:</span>
            <span className={`text-sm font-bold ${netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netPnl >= 0 ? '+' : ''}${netPnl} USD
            </span>
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Reason for Entry</label>
            <input
              type="text"
              value={reasonForEntry}
              onChange={(e) => setReasonForEntry(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-1.5 text-white focus:outline-none"
              placeholder="e.g. Signal confluence, 4H break of structure..."
              required
            />
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Reason for Exit</label>
            <input
              type="text"
              value={reasonForExit}
              onChange={(e) => setReasonForExit(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-1.5 text-white focus:outline-none"
              placeholder="e.g. Hit Take-Profit 1, trailing stop triggered..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-400 block mb-1">Signal Reference</label>
              <input
                type="text"
                value={signalReference}
                onChange={(e) => setSignalReference(e.target.value)}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-1.5 text-neutral-300 focus:outline-none"
                placeholder="EG-SIG-BTC-1000 or Manual"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1">Discipline Rating (1-5)</label>
              <select
                value={disciplineRating}
                onChange={(e) => setDisciplineRating(parseInt(e.target.value))}
                className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-1.5 text-amber-400 focus:outline-none"
              >
                <option value="5">★★★★★ (5/5 Flawless Plan Adherence)</option>
                <option value="4">★★★★☆ (4/5 Solid Execution)</option>
                <option value="3">★★★☆☆ (3/5 Minor FOMO / Hesitation)</option>
                <option value="2">★★☆☆☆ (2/5 Broke Risk Limits)</option>
                <option value="1">★☆☆☆☆ (1/5 Pure Impulse / Revenge)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-neutral-400 block mb-1">Execution & Mindset Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-1.5 text-white focus:outline-none"
              placeholder="Reflections on execution, orderbook depth observations, emotions..."
            />
          </div>

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
              Save to Trade Journal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
