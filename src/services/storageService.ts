import { PaperPosition, ClosedPaperTrade, JournalEntry, TerminalSettings, SystemAuditLog, BacktestResult } from '../types';

const STORAGE_KEYS = {
  PAPER_BALANCE: 'edgeguard_paper_balance',
  PAPER_POSITIONS: 'edgeguard_paper_positions',
  PAPER_HISTORY: 'edgeguard_paper_history',
  TRADE_JOURNAL: 'edgeguard_trade_journal',
  SETTINGS: 'edgeguard_settings',
  AUDIT_LOGS: 'edgeguard_audit_logs',
  LATEST_BACKTEST: 'edgeguard_latest_backtest'
};

const DEFAULT_SETTINGS: TerminalSettings = {
  minVolumeUsdt: 25000000,
  minQualityScore: 70,
  maxRiskPerTrade: 1.5,
  defaultTp1R: 1.0,
  defaultTp2R: 2.0,
  defaultTp3R: 3.5,
  makerFeeRate: 0.075,
  takerFeeRate: 0.075,
  slippageAssumption: 0.05,
  audioAlertsEnabled: true,
  autoRefreshIntervalSeconds: 10,
  selectedMarkets: ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'AVAXUSDT', 'LINKUSDT', 'SUIUSDT']
};

class StorageService {
  // Paper Trading
  public getPaperBalance(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.PAPER_BALANCE);
      return val ? parseFloat(val) : 100000.0;
    } catch {
      return 100000.0;
    }
  }

  public setPaperBalance(balance: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PAPER_BALANCE, balance.toString());
    } catch (e) {
      console.warn('Storage failed', e);
    }
  }

  public getPaperPositions(): PaperPosition[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAPER_POSITIONS);
      if (data) return JSON.parse(data);
    } catch {}
    
    // Default initial demonstration position
    return [
      {
        id: 'POS-BTC-01',
        symbol: 'BTCUSDT',
        direction: 'BUY',
        entryPrice: 95400,
        currentPrice: 96420,
        quantity: 0.15,
        initialValue: 14310,
        currentValue: 14463,
        stopLoss: 93800,
        takeProfit: 98600,
        unrealizedPnl: 153.0,
        unrealizedPnlPercent: 1.07,
        pnlR: 0.64,
        openTimestamp: Date.now() - 14 * 3600 * 1000,
        signalId: 'EG-SIG-BTC-1000',
        leverage: 1
      },
      {
        id: 'POS-SOL-02',
        symbol: 'SOLUSDT',
        direction: 'BUY',
        entryPrice: 191.2,
        currentPrice: 194.5,
        quantity: 45,
        initialValue: 8604,
        currentValue: 8752.5,
        stopLoss: 186.0,
        takeProfit: 204.0,
        unrealizedPnl: 148.5,
        unrealizedPnlPercent: 1.73,
        pnlR: 0.63,
        openTimestamp: Date.now() - 8 * 3600 * 1000,
        signalId: 'EG-SIG-SOL-1002',
        leverage: 1
      }
    ];
  }

  public savePaperPositions(positions: PaperPosition[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PAPER_POSITIONS, JSON.stringify(positions));
    } catch (e) {
      console.warn(e);
    }
  }

  public getClosedPaperTrades(): ClosedPaperTrade[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAPER_HISTORY);
      if (data) return JSON.parse(data);
    } catch {}

    const now = Date.now();
    return [
      {
        id: 'CPT-101',
        symbol: 'ETHUSDT',
        direction: 'BUY',
        entryPrice: 2760,
        exitPrice: 2845,
        quantity: 3.5,
        fees: 7.35,
        realizedPnl: 290.15,
        realizedPnlPercent: 3.08,
        pnlR: 2.1,
        openTimestamp: now - 3 * 86400 * 1000,
        closeTimestamp: now - 2 * 86400 * 1000,
        exitReason: 'TAKE_PROFIT',
        signalId: 'EG-SIG-ETH-992'
      },
      {
        id: 'CPT-102',
        symbol: 'AVAXUSDT',
        direction: 'BUY',
        entryPrice: 36.4,
        exitPrice: 38.8,
        quantity: 200,
        fees: 5.64,
        realizedPnl: 474.36,
        realizedPnlPercent: 6.59,
        pnlR: 2.4,
        openTimestamp: now - 5 * 86400 * 1000,
        closeTimestamp: now - 3 * 86400 * 1000,
        exitReason: 'TAKE_PROFIT',
        signalId: 'EG-SIG-AVAX-985'
      },
      {
        id: 'CPT-103',
        symbol: 'LINKUSDT',
        direction: 'BUY',
        entryPrice: 22.1,
        exitPrice: 21.4,
        quantity: 300,
        fees: 4.89,
        realizedPnl: -214.89,
        realizedPnlPercent: -3.17,
        pnlR: -1.0,
        openTimestamp: now - 7 * 86400 * 1000,
        closeTimestamp: now - 6 * 86400 * 1000,
        exitReason: 'STOP_LOSS',
        signalId: 'EG-SIG-LINK-972'
      },
      {
        id: 'CPT-104',
        symbol: 'NEARUSDT',
        direction: 'BUY',
        entryPrice: 6.35,
        exitPrice: 6.92,
        quantity: 1200,
        fees: 6.36,
        realizedPnl: 677.64,
        realizedPnlPercent: 8.98,
        pnlR: 2.8,
        openTimestamp: now - 9 * 86400 * 1000,
        closeTimestamp: now - 7 * 86400 * 1000,
        exitReason: 'TAKE_PROFIT',
        signalId: 'EG-SIG-NEAR-964'
      }
    ];
  }

  public saveClosedPaperTrades(trades: ClosedPaperTrade[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PAPER_HISTORY, JSON.stringify(trades));
    } catch (e) {
      console.warn(e);
    }
  }

  // Trade Journal
  public getJournalEntries(): JournalEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRADE_JOURNAL);
      if (data) return JSON.parse(data);
    } catch {}

    return [
      {
        id: 'TJ-2026-001',
        symbol: 'BTCUSDT',
        direction: 'BUY',
        entryPrice: 94800,
        exitPrice: 96250,
        stopLoss: 93500,
        quantity: 0.1,
        fees: 14.3,
        netPnl: 130.7,
        openDate: '2026-10-28 09:30 UTC',
        closeDate: '2026-10-29 16:45 UTC',
        reasonForEntry: 'Confluence with EDGEGUARD 4H signal #EG-SIG-BTC-1000 and 50 EMA bounce.',
        reasonForExit: 'Hit Take-Profit 1 level at $96,250. Trimmed full size ahead of resistance.',
        signalReference: 'EG-SIG-BTC-1000',
        disciplineRating: 5,
        notes: 'Strict adherence to risk parameters. Max risk was 1.3% of account equity.',
        marketRegime: 'Bullish Trending'
      },
      {
        id: 'TJ-2026-002',
        symbol: 'SOLUSDT',
        direction: 'BUY',
        entryPrice: 188.5,
        exitPrice: 194.2,
        stopLoss: 184.0,
        quantity: 30,
        fees: 8.6,
        netPnl: 162.4,
        openDate: '2026-10-29 14:10 UTC',
        closeDate: '2026-10-30 20:15 UTC',
        reasonForEntry: 'Break of structure on 15M with high volume node support on Binance Spot.',
        reasonForExit: 'Trailing stop triggered after 1.8R move.',
        signalReference: 'EG-SIG-SOL-1002',
        disciplineRating: 4,
        notes: 'Solid execution. Waited for 15M candle close before triggering market order.',
        marketRegime: 'Bullish Trending'
      },
      {
        id: 'TJ-2026-003',
        symbol: 'ETHUSDT',
        direction: 'BUY',
        entryPrice: 2810,
        exitPrice: 2772,
        stopLoss: 2770,
        quantity: 1.5,
        fees: 6.2,
        netPnl: -63.2,
        openDate: '2026-10-25 11:00 UTC',
        closeDate: '2026-10-26 04:20 UTC',
        reasonForEntry: 'Anticipated 4H break of resistance. Entered before confirmation candle closed.',
        reasonForExit: 'Stop loss hit exactly at $2770. Prevented larger drawdown.',
        signalReference: 'Manual Setup',
        disciplineRating: 3,
        notes: 'Impatience: entered before signal quality score reached 75+ threshold.',
        marketRegime: 'Range-Bound Consolidation'
      }
    ];
  }

  public saveJournalEntries(entries: JournalEntry[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TRADE_JOURNAL, JSON.stringify(entries));
    } catch (e) {
      console.warn(e);
    }
  }

  // Settings
  public getSettings(): TerminalSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {}
    return { ...DEFAULT_SETTINGS };
  }

  public saveSettings(settings: TerminalSettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn(e);
    }
  }

  // Audit Logs
  public getAuditLogs(): SystemAuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (data) return JSON.parse(data);
    } catch {}

    const now = Date.now();
    return [
      {
        id: 'LOG-001',
        timestamp: now - 35000,
        level: 'INFO',
        category: 'BINANCE_API',
        message: 'Binance Spot REST 24hr ticker batch sync completed.',
        details: '24 market pairs synced successfully in 42ms.'
      },
      {
        id: 'LOG-002',
        timestamp: now - 30000,
        level: 'INFO',
        category: 'SIGNAL_ENGINE',
        message: 'Multi-timeframe confirmation pipeline evaluated 24 pairs.',
        details: 'Evaluated 4H, 1H, 15M and 5M structure with ATR risk parameters.'
      },
      {
        id: 'LOG-003',
        timestamp: now - 22000,
        level: 'INFO',
        category: 'RISK_MODEL',
        message: 'Risk parameters validated: 0 automated orders placed (Read-Only manual advisory).'
      },
      {
        id: 'LOG-004',
        timestamp: now - 15000,
        level: 'WARN',
        category: 'SCANNER',
        message: 'High market volatility regime detected for SUIUSDT (ATR 4.2%).',
        details: 'Increased stop-loss distance recommendations dynamically to prevent wick-outs.'
      }
    ];
  }

  public appendAuditLog(log: Omit<SystemAuditLog, 'id' | 'timestamp'>): void {
    try {
      const current = this.getAuditLogs();
      const newLog: SystemAuditLog = {
        ...log,
        id: `LOG-${Date.now().toString().slice(-6)}`,
        timestamp: Date.now()
      };
      const updated = [newLog, ...current].slice(0, 100);
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
  }

  public resetAllPaperData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PAPER_BALANCE);
      localStorage.removeItem(STORAGE_KEYS.PAPER_POSITIONS);
      localStorage.removeItem(STORAGE_KEYS.PAPER_HISTORY);
    } catch {}
  }
}

export const storageService = new StorageService();
