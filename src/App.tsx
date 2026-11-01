/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MarketTicker, TradeSignal, PaperPosition, ClosedPaperTrade, JournalEntry, TerminalSettings, SystemAuditLog, SignalDirection } from './types';
import { binanceService, BinanceConnectionState, TRACKED_SYMBOLS } from './services/binanceService';
import { SignalEngine } from './services/signalEngine';
import { storageService } from './services/storageService';

// Layout Components
import { Header } from './components/layout/Header';
import { Sidebar, ActiveView } from './components/layout/Sidebar';

// Views
import { OverviewView } from './views/OverviewView';
import { MarketScannerView } from './views/MarketScannerView';
import { SignalsCenterView } from './views/SignalsCenterView';
import { CoinDetailView } from './views/CoinDetailView';
import { BacktestingLabView } from './views/BacktestingLabView';
import { StrategyResearchView } from './views/StrategyResearchView';
import { PaperTradingView } from './views/PaperTradingView';
import { TradeJournalView } from './views/TradeJournalView';
import { PerformanceAnalyticsView } from './views/PerformanceAnalyticsView';
import { SystemHealthView } from './views/SystemHealthView';
import { SettingsView } from './views/SettingsView';

// Modals
import { NewPaperOrderModal } from './components/modals/NewPaperOrderModal';
import { NewJournalEntryModal } from './components/modals/NewJournalEntryModal';
import { NotificationsDrawer, NotificationItem } from './components/modals/NotificationsDrawer';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('overview');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTCUSDT');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Core Data States
  const [tickers, setTickers] = useState<MarketTicker[]>([]);
  const [signals, setSignals] = useState<TradeSignal[]>([]);
  const [connectionState, setConnectionState] = useState<BinanceConnectionState>(binanceService.getConnectionState());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Persistent States
  const [paperBalance, setPaperBalance] = useState<number>(() => storageService.getPaperBalance());
  const [openPositions, setOpenPositions] = useState<PaperPosition[]>(() => storageService.getPaperPositions());
  const [closedTrades, setClosedTrades] = useState<ClosedPaperTrade[]>(() => storageService.getClosedPaperTrades());
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => storageService.getJournalEntries());
  const [settings, setSettings] = useState<TerminalSettings>(() => storageService.getSettings());
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(() => storageService.getAuditLogs());

  // Modals & Notifications
  const [isPaperModalOpen, setIsPaperModalOpen] = useState(false);
  const [paperModalProps, setPaperModalProps] = useState<{
    symbol?: string;
    direction?: SignalDirection;
    price?: number;
    sl?: number;
    tp?: number;
  }>({});
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      timestamp: Date.now() - 15 * 60 * 1000,
      title: 'High-Conviction Setup: BTCUSDT BUY',
      message: 'Composite score 91/100 confirmed with 4H structural break & volume expansion.',
      type: 'SIGNAL',
      symbol: 'BTCUSDT',
      score: 91
    },
    {
      id: 'notif-2',
      timestamp: Date.now() - 45 * 60 * 1000,
      title: 'Volatility Regime Expansion Detected',
      message: 'SOLUSDT relative volume exceeded 2.2x baseline on Binance Spot orderbook.',
      type: 'REGIME',
      symbol: 'SOLUSDT'
    },
    {
      id: 'notif-3',
      timestamp: Date.now() - 90 * 60 * 1000,
      title: 'Risk Boundary Verification',
      message: 'Confirmed air-gapped manual execution mode. Zero automated order risks.',
      type: 'RISK'
    }
  ]);

  // Initial Data Fetch
  const syncTickers = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const fetched = await binanceService.fetchTickers();
      setTickers(fetched);
      setConnectionState(binanceService.getConnectionState());

      // Generate quantitative signals from fresh tickers
      const generatedSignals = SignalEngine.generateSignals(fetched);
      setSignals(generatedSignals);

      // Re-evaluate open paper positions with new mark prices
      setOpenPositions((prev) => {
        const tickerMap = new Map<string, number>();
        fetched.forEach((t) => tickerMap.set(t.symbol, t.price));

        const updated = prev.map((pos) => {
          const currentPrice = tickerMap.get(pos.symbol) || pos.currentPrice;
          const currentValue = Number((pos.quantity * currentPrice).toFixed(2));
          const unrealizedPnl = pos.direction === 'BUY'
            ? Number(((currentPrice - pos.entryPrice) * pos.quantity).toFixed(2))
            : Number(((pos.entryPrice - currentPrice) * pos.quantity).toFixed(2));
          const unrealizedPnlPercent = Number(((unrealizedPnl / pos.initialValue) * 100).toFixed(2));
          const riskDistance = Math.abs(pos.entryPrice - pos.stopLoss) || 1;
          const pnlR = Number((unrealizedPnl / (riskDistance * pos.quantity)).toFixed(2));

          return {
            ...pos,
            currentPrice,
            currentValue,
            unrealizedPnl,
            unrealizedPnlPercent,
            pnlR
          };
        });

        storageService.savePaperPositions(updated);
        return updated;
      });
    } catch (err) {
      console.warn('Sync failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    syncTickers();
  }, [syncTickers]);

  // Polling Interval
  useEffect(() => {
    const intervalMs = (settings.autoRefreshIntervalSeconds || 10) * 1000;
    const interval = setInterval(() => {
      syncTickers();
    }, intervalMs);
    return () => clearInterval(interval);
  }, [settings.autoRefreshIntervalSeconds, syncTickers]);

  // Handlers for Navigation & Coin selection
  const handleSelectCoin = (symbol: string) => {
    setSelectedSymbol(symbol);
    setActiveView('market_analysis');
  };

  const handleOpenSignal = (symbol: string) => {
    setSelectedSymbol(symbol);
    setActiveView('signals');
  };

  const handleOpenPaperOrder = (symbol: string, direction: SignalDirection, price: number, sl?: number, tp?: number) => {
    setPaperModalProps({ symbol, direction, price, sl, tp });
    setIsPaperModalOpen(true);
  };

  const handleCreatePaperPosition = (newPosData: Omit<PaperPosition, 'id' | 'openTimestamp' | 'unrealizedPnl' | 'unrealizedPnlPercent' | 'pnlR' | 'currentValue'>) => {
    const newPos: PaperPosition = {
      ...newPosData,
      id: `POS-${newPosData.symbol.replace('USDT', '')}-${Date.now().toString().slice(-4)}`,
      openTimestamp: Date.now(),
      currentValue: newPosData.initialValue,
      unrealizedPnl: 0,
      unrealizedPnlPercent: 0,
      pnlR: 0
    };

    const updated = [newPos, ...openPositions];
    setOpenPositions(updated);
    storageService.savePaperPositions(updated);

    storageService.appendAuditLog({
      level: 'INFO',
      category: 'STORAGE',
      message: `Simulated paper position opened for ${newPos.symbol} (${newPos.direction}).`,
      details: `Entry: $${newPos.entryPrice}, Size: ${newPos.quantity}`
    });
    setAuditLogs(storageService.getAuditLogs());
  };

  const handleClosePaperPosition = (positionId: string, exitPrice: number) => {
    const pos = openPositions.find((p) => p.id === positionId);
    if (!pos) return;

    const fees = Number((pos.quantity * exitPrice * (settings.takerFeeRate / 100)).toFixed(2));
    const grossPnl = pos.direction === 'BUY'
      ? (exitPrice - pos.entryPrice) * pos.quantity
      : (pos.entryPrice - exitPrice) * pos.quantity;
    const realizedPnl = Number((grossPnl - fees).toFixed(2));
    const realizedPnlPercent = Number(((realizedPnl / pos.initialValue) * 100).toFixed(2));
    const riskDistance = Math.abs(pos.entryPrice - pos.stopLoss) || 1;
    const pnlR = Number((realizedPnl / (riskDistance * pos.quantity)).toFixed(2));

    const closed: ClosedPaperTrade = {
      id: `CPT-${Date.now().toString().slice(-4)}`,
      symbol: pos.symbol,
      direction: pos.direction,
      entryPrice: pos.entryPrice,
      exitPrice,
      quantity: pos.quantity,
      fees,
      realizedPnl,
      realizedPnlPercent,
      pnlR,
      openTimestamp: pos.openTimestamp,
      closeTimestamp: Date.now(),
      exitReason: 'MANUAL_CLOSE',
      signalId: pos.signalId
    };

    const remainingPositions = openPositions.filter((p) => p.id !== positionId);
    const updatedClosed = [closed, ...closedTrades];
    const newBalance = Number((paperBalance + realizedPnl).toFixed(2));

    setOpenPositions(remainingPositions);
    setClosedTrades(updatedClosed);
    setPaperBalance(newBalance);

    storageService.savePaperPositions(remainingPositions);
    storageService.saveClosedPaperTrades(updatedClosed);
    storageService.setPaperBalance(newBalance);

    storageService.appendAuditLog({
      level: 'INFO',
      category: 'STORAGE',
      message: `Paper position closed: ${pos.symbol} P&L $${realizedPnl} (${pnlR}R).`
    });
    setAuditLogs(storageService.getAuditLogs());
  };

  const handleCreateJournalEntry = (entry: JournalEntry) => {
    const updated = [entry, ...journalEntries];
    setJournalEntries(updated);
    storageService.saveJournalEntries(updated);

    storageService.appendAuditLog({
      level: 'INFO',
      category: 'STORAGE',
      message: `New manual Binance trade recorded: ${entry.symbol} (${entry.direction}) P&L $${entry.netPnl}.`
    });
    setAuditLogs(storageService.getAuditLogs());
  };

  const handleSaveSettings = (newSettings: TerminalSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  const handleResetPaperData = () => {
    storageService.resetAllPaperData();
    setPaperBalance(100000.0);
    setOpenPositions([]);
    setClosedTrades([]);
  };

  const handleExportData = () => {
    const payload = {
      app: 'EDGEGUARD',
      exportDate: new Date().toISOString(),
      paperTrading: {
        balance: paperBalance,
        openPositions,
        closedTrades
      },
      tradeJournal: journalEntries,
      settings
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `edgeguard_backup_${new Date().toISOString().substring(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const btcTicker = useMemo(() => tickers.find((t) => t.symbol === 'BTCUSDT'), [tickers]);

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E2E8F0] flex flex-col font-sans antialiased">
      {/* Top Bar Header */}
      <Header
        connectionState={connectionState}
        btcTicker={btcTicker}
        onRefresh={syncTickers}
        isRefreshing={isRefreshing}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenQuickJournal={() => setIsJournalModalOpen(true)}
        notificationCount={notifications.length}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeView={activeView}
          onSelectView={setActiveView}
          signalCount={signals.length}
          openPositionCount={openPositions.length}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Mobile hamburger navigation bar */}
          <div className="flex items-center justify-between pb-4 lg:hidden border-b border-[#1E2638] mb-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="px-3 py-1.5 border border-[#1E2638] text-xs font-mono text-neutral-300 bg-[#111622] flex items-center gap-2"
            >
              <span>☰</span>
              <span>Terminal Menu</span>
            </button>
            <span className="font-mono text-xs uppercase font-bold text-white">
              {activeView.replace('_', ' ')}
            </span>
          </div>

          {/* Render Active View */}
          {activeView === 'overview' && (
            <OverviewView
              tickers={tickers}
              signals={signals}
              paperBalance={paperBalance}
              openPositions={openPositions}
              closedTrades={closedTrades}
              onSelectCoin={handleSelectCoin}
              onNavigateToSignals={() => setActiveView('signals')}
              onNavigateToScanner={() => setActiveView('scanner')}
            />
          )}

          {activeView === 'scanner' && (
            <MarketScannerView
              tickers={tickers}
              onSelectCoin={handleSelectCoin}
              onOpenSignal={handleOpenSignal}
              onOpenPaperOrder={(sym, dir, prc) => handleOpenPaperOrder(sym, dir, prc)}
            />
          )}

          {activeView === 'signals' && (
            <SignalsCenterView
              signals={signals}
              onSelectCoin={handleSelectCoin}
              onOpenPaperOrder={(sym, dir, prc, sl, tp) => handleOpenPaperOrder(sym, dir, prc, sl, tp)}
            />
          )}

          {activeView === 'market_analysis' && (
            <CoinDetailView
              selectedSymbol={selectedSymbol}
              tickers={tickers}
              signals={signals}
              onSelectCoin={setSelectedSymbol}
              onOpenPaperOrder={(sym, dir, prc) => handleOpenPaperOrder(sym, dir, prc)}
            />
          )}

          {activeView === 'backtesting' && <BacktestingLabView />}

          {activeView === 'research' && <StrategyResearchView />}

          {activeView === 'paper_trading' && (
            <PaperTradingView
              paperBalance={paperBalance}
              openPositions={openPositions}
              closedTrades={closedTrades}
              tickers={tickers}
              onClosePosition={handleClosePaperPosition}
              onOpenOrderModal={() => handleOpenPaperOrder('BTCUSDT', 'BUY', btcTicker?.price || 96420)}
              onResetBalance={() => setPaperBalance(100000.0)}
            />
          )}

          {activeView === 'trade_journal' && (
            <TradeJournalView
              entries={journalEntries}
              onOpenNewJournalModal={() => setIsJournalModalOpen(true)}
            />
          )}

          {activeView === 'performance' && <PerformanceAnalyticsView />}

          {activeView === 'system_health' && (
            <SystemHealthView
              connectionState={connectionState}
              auditLogs={auditLogs}
              onTriggerSync={syncTickers}
              onClearLogs={() => {
                storageService.saveSettings(settings);
                setAuditLogs([]);
              }}
            />
          )}

          {activeView === 'settings' && (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onResetPaperData={handleResetPaperData}
              onExportData={handleExportData}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <NewPaperOrderModal
        isOpen={isPaperModalOpen}
        onClose={() => setIsPaperModalOpen(false)}
        onSubmit={handleCreatePaperPosition}
        tickers={tickers}
        initialSymbol={paperModalProps.symbol}
        initialDirection={paperModalProps.direction}
        initialPrice={paperModalProps.price}
        initialSl={paperModalProps.sl}
        initialTp={paperModalProps.tp}
        paperBalance={paperBalance}
      />

      <NewJournalEntryModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        onSubmit={handleCreateJournalEntry}
        tickers={tickers}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onSelectNotification={(item) => {
          if (item.symbol) {
            handleSelectCoin(item.symbol);
          }
        }}
        onClearAll={() => setNotifications([])}
      />
    </div>
  );
}
