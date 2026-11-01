import React, { useState } from 'react';
import { PaperPosition, ClosedPaperTrade, MarketTicker, SignalDirection } from '../types';
import { MetricCard } from '../components/common/MetricCard';

interface PaperTradingViewProps {
  paperBalance: number;
  openPositions: PaperPosition[];
  closedTrades: ClosedPaperTrade[];
  tickers: MarketTicker[];
  onClosePosition: (positionId: string, exitPrice: number) => void;
  onOpenOrderModal: () => void;
  onResetBalance: () => void;
}

export const PaperTradingView: React.FC<PaperTradingViewProps> = ({
  paperBalance,
  openPositions,
  closedTrades,
  tickers,
  onClosePosition,
  onOpenOrderModal,
  onResetBalance
}) => {
  const [activeTab, setActiveTab] = useState<'OPEN' | 'HISTORY'>('OPEN');

  const totalUnrealizedPnl = openPositions.reduce((acc, p) => acc + p.unrealizedPnl, 0);
  const totalOpenValue = openPositions.reduce((acc, p) => acc + p.currentValue, 0);
  const totalEquity = paperBalance + totalUnrealizedPnl;

  const totalRealizedPnl = closedTrades.reduce((acc, t) => acc + t.realizedPnl, 0);
  const winningTrades = closedTrades.filter((t) => t.realizedPnl > 0);
  const winRate = closedTrades.length > 0 ? ((winningTrades.length / closedTrades.length) * 100).toFixed(1) : '0.0';

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
              Paper Trading Simulation
            </h1>
            <span className="text-xs font-mono text-amber-400 border border-amber-500/30 px-2 py-0.5 bg-amber-500/10">
              VIRTUAL SPOT WALLET
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Simulate manual execution in live market conditions without capital risk. Strictly 1x Spot trading.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onResetBalance}
            className="px-3 py-1.5 text-xs font-mono border border-[#1E2638] text-neutral-400 hover:text-white bg-[#0B0E14] transition-colors"
          >
            Reset to $100k
          </button>
          <button
            onClick={onOpenOrderModal}
            className="px-4 py-1.5 text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-xs"
          >
            + New Simulated Order
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Total Equity"
          value={`$${totalEquity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue={`Cash: $${paperBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          trend={totalUnrealizedPnl >= 0 ? 'up' : 'down'}
          datasetType="PAPER"
        />
        <MetricCard
          label="Open Unrealized P&L"
          value={`${totalUnrealizedPnl >= 0 ? '+' : ''}$${totalUnrealizedPnl.toFixed(2)}`}
          subValue={`${openPositions.length} Active Positions`}
          trend={totalUnrealizedPnl >= 0 ? 'up' : 'down'}
          datasetType="PAPER"
        />
        <MetricCard
          label="Closed Realized P&L"
          value={`${totalRealizedPnl >= 0 ? '+' : ''}$${totalRealizedPnl.toFixed(2)}`}
          subValue={`${closedTrades.length} Completed Trades`}
          trend={totalRealizedPnl >= 0 ? 'up' : 'down'}
          datasetType="PAPER"
        />
        <MetricCard
          label="Simulated Win Rate"
          value={`${winRate}%`}
          subValue={`${winningTrades.length} Wins / ${closedTrades.length - winningTrades.length} Losses`}
          trend="up"
          datasetType="PAPER"
        />
        <MetricCard
          label="Capital In Use"
          value={`$${totalOpenValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subValue={`${((totalOpenValue / totalEquity) * 100).toFixed(1)}% of Equity`}
          trend="neutral"
          datasetType="PAPER"
        />
        <MetricCard
          label="Leverage Profile"
          value="1.0x (Spot Only)"
          subValue="Zero Liquidation Risk"
          trend="neutral"
          datasetType="PAPER"
        />
      </div>

      {/* Tabs: Active Positions vs Closed History */}
      <div className="flex items-center gap-1 border-b border-[#1E2638]">
        <button
          onClick={() => setActiveTab('OPEN')}
          className={`px-4 py-2 font-mono text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'OPEN'
              ? 'border-emerald-500 text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Open Positions ({openPositions.length})
        </button>
        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`px-4 py-2 font-mono text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'HISTORY'
              ? 'border-emerald-500 text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-200'
          }`}
        >
          Closed Trade History ({closedTrades.length})
        </button>
      </div>

      {/* View Content */}
      {activeTab === 'OPEN' ? (
        <div className="bg-[#111622] border border-[#1E2638] overflow-x-auto">
          <table className="w-full text-left text-xs font-mono tabular-nums border-collapse">
            <thead>
              <tr className="border-b border-[#1E2638] bg-[#0E121B] text-neutral-400 select-none">
                <th className="py-3 px-4">Symbol</th>
                <th className="py-3 px-4">Side</th>
                <th className="py-3 px-4 text-right">Entry Price</th>
                <th className="py-3 px-4 text-right">Mark Price</th>
                <th className="py-3 px-4 text-right">Size</th>
                <th className="py-3 px-4 text-right">Initial Value</th>
                <th className="py-3 px-4 text-right">Stop Loss</th>
                <th className="py-3 px-4 text-right">Take Profit</th>
                <th className="py-3 px-4 text-right">Unrealized P&L</th>
                <th className="py-3 px-4 text-right">R-Multiple</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2638]">
              {openPositions.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-neutral-500">
                    No active simulated paper positions. Click "+ New Simulated Order" or launch from Signals Center.
                  </td>
                </tr>
              ) : (
                openPositions.map((pos) => {
                  const isPos = pos.unrealizedPnl >= 0;
                  return (
                    <tr key={pos.id} className="hover:bg-[#141A26] transition-colors">
                      <td className="py-3 px-4 font-bold text-white">
                        {pos.symbol}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 font-bold ${
                            pos.direction === 'BUY'
                              ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                              : 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
                          }`}
                        >
                          {pos.direction}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-white">
                        ${formatPrice(pos.entryPrice)}
                      </td>
                      <td className="py-3 px-4 text-right text-white font-medium">
                        ${formatPrice(pos.currentPrice)}
                      </td>
                      <td className="py-3 px-4 text-right text-neutral-300">
                        {pos.quantity}
                      </td>
                      <td className="py-3 px-4 text-right text-neutral-300">
                        ${pos.initialValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-right text-rose-400">
                        ${formatPrice(pos.stopLoss)}
                      </td>
                      <td className="py-3 px-4 text-right text-emerald-400">
                        ${formatPrice(pos.takeProfit)}
                      </td>
                      <td className={`py-3 px-4 text-right font-semibold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPos ? '+' : ''}${pos.unrealizedPnl.toFixed(2)} ({pos.unrealizedPnlPercent}%)
                      </td>
                      <td className={`py-3 px-4 text-right font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPos ? `+${pos.pnlR}` : `${pos.pnlR}`} R
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onClosePosition(pos.id, pos.currentPrice)}
                          className="px-2.5 py-1 text-[11px] bg-rose-500/10 border border-rose-500/40 text-rose-400 hover:bg-rose-500/20 font-medium"
                        >
                          Close Position
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-[#111622] border border-[#1E2638] overflow-x-auto">
          <table className="w-full text-left text-xs font-mono tabular-nums border-collapse">
            <thead>
              <tr className="border-b border-[#1E2638] bg-[#0E121B] text-neutral-400 select-none">
                <th className="py-3 px-4">Symbol</th>
                <th className="py-3 px-4">Side</th>
                <th className="py-3 px-4 text-right">Entry Price</th>
                <th className="py-3 px-4 text-right">Exit Price</th>
                <th className="py-3 px-4 text-right">Size</th>
                <th className="py-3 px-4 text-right">Fees (0.075%)</th>
                <th className="py-3 px-4 text-right">Realized P&L</th>
                <th className="py-3 px-4 text-right">R-Multiple</th>
                <th className="py-3 px-4">Exit Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2638]">
              {closedTrades.map((trade) => {
                const isPos = trade.realizedPnl >= 0;
                return (
                  <tr key={trade.id} className="hover:bg-[#141A26] transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      {trade.symbol}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 font-bold ${
                          trade.direction === 'BUY'
                            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                            : 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
                        }`}
                      >
                        {trade.direction}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-white">
                      ${formatPrice(trade.entryPrice)}
                    </td>
                    <td className="py-3 px-4 text-right text-white font-medium">
                      ${formatPrice(trade.exitPrice)}
                    </td>
                    <td className="py-3 px-4 text-right text-neutral-300">
                      {trade.quantity}
                    </td>
                    <td className="py-3 px-4 text-right text-neutral-400">
                      ${trade.fees.toFixed(2)}
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPos ? '+' : ''}${trade.realizedPnl.toFixed(2)} ({trade.realizedPnlPercent}%)
                    </td>
                    <td className={`py-3 px-4 text-right font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPos ? `+${trade.pnlR}` : `${trade.pnlR}`} R
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-neutral-300 text-[11px]">
                        {trade.exitReason === 'TAKE_PROFIT' && 'Target Hit'}
                        {trade.exitReason === 'STOP_LOSS' && 'Stop Triggered'}
                        {trade.exitReason === 'MANUAL_CLOSE' && 'Manual Close'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
