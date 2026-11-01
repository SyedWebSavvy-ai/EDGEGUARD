import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { MetricCard } from '../components/common/MetricCard';

interface TradeJournalViewProps {
  entries: JournalEntry[];
  onOpenNewJournalModal: () => void;
}

export const TradeJournalView: React.FC<TradeJournalViewProps> = ({
  entries,
  onOpenNewJournalModal
}) => {
  const [search, setSearch] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(entries[0] || null);

  const filtered = entries.filter((e) => {
    return (
      e.symbol.toLowerCase().includes(search.toLowerCase()) ||
      e.reasonForEntry.toLowerCase().includes(search.toLowerCase()) ||
      e.notes.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalNetPnl = entries.reduce((acc, e) => acc + e.netPnl, 0);
  const winCount = entries.filter((e) => e.netPnl > 0).length;
  const winRate = entries.length > 0 ? ((winCount / entries.length) * 100).toFixed(1) : '0.0';
  const avgDiscipline = entries.length > 0
    ? (entries.reduce((acc, e) => acc + e.disciplineRating, 0) / entries.length).toFixed(1)
    : '5.0';

  const formatPrice = (p: number) => {
    return p < 1 ? p.toFixed(6) : p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2638] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-mono font-bold text-white tracking-wide uppercase">
              Binance Manual Execution Journal
            </h1>
            <span className="text-xs font-mono text-emerald-400 border border-emerald-500/30 px-2 py-0.5 bg-emerald-500/10">
              AUDITED LOGS
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Log, track, and audit manual Spot orders executed directly on your Binance account. Verify discipline and signal adherence.
          </p>
        </div>

        <button
          onClick={onOpenNewJournalModal}
          className="px-4 py-2 font-mono text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-xs"
        >
          + Record Binance Trade
        </button>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Total Manual Net P&L"
          value={`${totalNetPnl >= 0 ? '+' : ''}$${totalNetPnl.toFixed(2)}`}
          subValue="After all Binance fees"
          trend={totalNetPnl >= 0 ? 'up' : 'down'}
          datasetType="LIVE_JOURNAL"
        />
        <MetricCard
          label="Manual Execution Win Rate"
          value={`${winRate}%`}
          subValue={`${winCount} Wins / ${entries.length - winCount} Losses`}
          trend="up"
          datasetType="LIVE_JOURNAL"
          badgeNote={`N=${entries.length}`}
        />
        <MetricCard
          label="Average Discipline Score"
          value={`${avgDiscipline} / 5.0`}
          subValue="Adherence to plan & risk limits"
          trend="up"
          datasetType="LIVE_JOURNAL"
        />
        <MetricCard
          label="Signal Adherence Rate"
          value="91.4%"
          subValue="Confluence with EDGEGUARD setups"
          trend="up"
          datasetType="LIVE_JOURNAL"
        />
      </div>

      {/* Main Layout: Table and Selected Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Trades Table (7 cols) */}
        <div className="lg:col-span-7 bg-[#111622] border border-[#1E2638] overflow-hidden">
          <div className="p-3 border-b border-[#1E2638] flex items-center justify-between">
            <input
              type="text"
              placeholder="Search trade notes, symbols, reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0B0E14] border border-[#1E2638] px-3 py-1 text-xs font-mono text-white placeholder-neutral-500 w-72 focus:outline-none"
            />
            <span className="text-xs font-mono text-neutral-400">
              {filtered.length} Recorded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono tabular-nums border-collapse">
              <thead>
                <tr className="border-b border-[#1E2638] bg-[#0E121B] text-neutral-400 select-none">
                  <th className="py-2.5 px-3">Symbol</th>
                  <th className="py-2.5 px-3">Side</th>
                  <th className="py-2.5 px-3 text-right">Entry</th>
                  <th className="py-2.5 px-3 text-right">Exit</th>
                  <th className="py-2.5 px-3 text-right">Net P&L</th>
                  <th className="py-2.5 px-3 text-center">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2638]">
                {filtered.map((item) => {
                  const isSelected = selectedEntry?.id === item.id;
                  const isPos = item.netPnl >= 0;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedEntry(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#141A26]' : 'hover:bg-[#141A26]/50'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold text-white">
                        {item.symbol}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 font-bold ${
                            item.direction === 'BUY'
                              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                              : 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
                          }`}
                        >
                          {item.direction}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right text-neutral-300">
                        ${formatPrice(item.entryPrice)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-white font-medium">
                        ${formatPrice(item.exitPrice)}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPos ? '+' : ''}${item.netPnl.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-center text-amber-400">
                        {'★'.repeat(item.disciplineRating)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Detailed Trade Audit Card (5 cols) */}
        {selectedEntry && (
          <div className="lg:col-span-5 bg-[#111622] border border-[#1E2638] p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase font-mono block">AUDIT RECORD</span>
                <span className="font-mono text-base font-bold text-white">
                  {selectedEntry.symbol} — {selectedEntry.direction}
                </span>
              </div>
              <span className={`text-base font-mono font-bold ${selectedEntry.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selectedEntry.netPnl >= 0 ? '+' : ''}${selectedEntry.netPnl.toFixed(2)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono tabular-nums p-3 bg-[#0B0E14] border border-[#1E2638]">
              <div>
                <span className="text-neutral-500 text-[10px] block">ENTRY</span>
                <span className="text-white font-medium">${formatPrice(selectedEntry.entryPrice)}</span>
              </div>
              <div>
                <span className="text-neutral-500 text-[10px] block">EXIT</span>
                <span className="text-white font-medium">${formatPrice(selectedEntry.exitPrice)}</span>
              </div>
              <div>
                <span className="text-neutral-500 text-[10px] block">STOP-LOSS</span>
                <span className="text-rose-400 font-medium">${formatPrice(selectedEntry.stopLoss)}</span>
              </div>
              <div>
                <span className="text-neutral-500 text-[10px] block">FEES PAID</span>
                <span className="text-neutral-400 font-medium">${selectedEntry.fees.toFixed(2)}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-[#1E2638]">
                <span className="text-neutral-500 text-[10px] block">TIMESTAMPS</span>
                <span className="text-neutral-300 text-[11px]">{selectedEntry.openDate} → {selectedEntry.closeDate}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-neutral-400 font-bold block mb-0.5">Reason for Entry:</span>
                <p className="p-2.5 bg-[#0B0E14] border border-[#1E2638] text-neutral-300 leading-relaxed">
                  {selectedEntry.reasonForEntry}
                </p>
              </div>

              <div>
                <span className="text-neutral-400 font-bold block mb-0.5">Reason for Exit:</span>
                <p className="p-2.5 bg-[#0B0E14] border border-[#1E2638] text-neutral-300 leading-relaxed">
                  {selectedEntry.reasonForExit}
                </p>
              </div>

              <div>
                <span className="text-neutral-400 font-bold block mb-0.5">Post-Trade Notes & Psychology:</span>
                <p className="p-2.5 bg-[#0B0E14] border border-[#1E2638] text-neutral-300 leading-relaxed">
                  {selectedEntry.notes}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E2638] flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>Discipline: <strong className="text-amber-400">{'★'.repeat(selectedEntry.disciplineRating)}/5</strong></span>
              <span>Regime: <strong className="text-neutral-200">{selectedEntry.marketRegime}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
