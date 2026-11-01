import React, { useState, useEffect } from 'react';
import { BinanceConnectionState } from '../../services/binanceService';
import { MarketTicker } from '../../types';

interface HeaderProps {
  connectionState: BinanceConnectionState;
  btcTicker?: MarketTicker;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenNotifications: () => void;
  onOpenQuickJournal: () => void;
  notificationCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  connectionState,
  btcTicker,
  onRefresh,
  isRefreshing,
  onOpenNotifications,
  onOpenQuickJournal,
  notificationCount
}) => {
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const iso = now.toISOString().replace('T', ' ').substring(0, 19);
      setUtcTime(`${iso} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const btcPrice = btcTicker ? btcTicker.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '96,420.00';
  const btcChange = btcTicker ? btcTicker.change24h : 2.45;
  const isPositive = btcChange >= 0;

  return (
    <header className="h-14 bg-[#0B0E14] border-b border-[#1E2638] px-4 sm:px-6 flex items-center justify-between gap-6 shrink-0 select-none z-30">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2">
          {/* Institutional geometric shield logo */}
          <div className="w-7 h-7 bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-base font-bold tracking-wider text-white uppercase whitespace-nowrap">
              EDGEGUARD
            </span>
          </div>
        </div>
        <span className="hidden lg:inline text-neutral-600 font-mono">|</span>
        <span className="hidden lg:inline text-[11px] font-mono text-neutral-400 uppercase tracking-wider">
          Binance Spot Quantitative Intelligence
        </span>
      </div>

      {/* Zone 2: Market Telemetry & Tickers (Clean Tabular Numbers, Zero Pill Slop) */}
      <div className="hidden md:flex items-center gap-6 text-xs font-mono shrink-0">
        {/* BTC Spot Quick Glance */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-medium">BTC/USDT</span>
          <span className="text-white font-semibold tabular-nums">${btcPrice}</span>
          <span className={`tabular-nums font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? `+${btcChange}%` : `${btcChange}%`}
          </span>
        </div>

        <span className="text-neutral-700">·</span>

        {/* Global Regime */}
        <div className="flex items-center gap-1.5 text-neutral-300">
          <span className="text-neutral-400">Regime:</span>
          <span className="text-neutral-200 font-medium">Bullish Expansion</span>
        </div>

        <span className="text-neutral-700">·</span>

        {/* Binance Connection Status */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400">Binance API:</span>
          <span className={`font-mono ${connectionState.status === 'CONNECTED' ? 'text-emerald-400' : 'text-amber-400'}`}>
            {connectionState.status === 'CONNECTED' ? `Live (${connectionState.latencyMs}ms)` : 'Sim Feed'}
          </span>
        </div>

        <span className="text-neutral-700">·</span>

        {/* Live UTC Clock */}
        <div className="text-neutral-400 tabular-nums">
          {utcTime || '2026-10-31 00:00:00 UTC'}
        </div>
      </div>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Binance Spot Ticker Data"
          className="p-1.5 text-neutral-400 hover:text-white border border-[#1E2638] hover:border-neutral-700 bg-[#111622] transition-colors disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
        </button>

        {/* Notifications Trigger */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 text-neutral-400 hover:text-white border border-[#1E2638] hover:border-neutral-700 bg-[#111622] transition-colors"
          title="Signal Alerts & Engine Updates"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-[#0B0E14] text-[9px] font-mono font-bold flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Primary Manual Execution Journal Action */}
        <button
          onClick={onOpenQuickJournal}
          className="px-3.5 py-1.5 text-xs font-mono font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors whitespace-nowrap shadow-xs"
        >
          + Record Binance Trade
        </button>
      </div>
    </header>
  );
};
