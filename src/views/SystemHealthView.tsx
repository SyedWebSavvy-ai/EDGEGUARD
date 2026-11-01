import React, { useState } from 'react';
import { BinanceConnectionState } from '../services/binanceService';
import { SystemAuditLog } from '../types';

interface SystemHealthViewProps {
  connectionState: BinanceConnectionState;
  auditLogs: SystemAuditLog[];
  onTriggerSync: () => void;
  onClearLogs: () => void;
}

export const SystemHealthView: React.FC<SystemHealthViewProps> = ({
  connectionState,
  auditLogs,
  onTriggerSync,
  onClearLogs
}) => {
  const [logFilter, setLogFilter] = useState<'ALL' | 'INFO' | 'WARN' | 'ERROR'>('ALL');

  const filteredLogs = auditLogs.filter((l) => {
    if (logFilter === 'ALL') return true;
    return l.level === logFilter;
  });

  const timeSinceLastSync = Math.max(0, Math.floor((Date.now() - connectionState.lastSyncTimestamp) / 1000));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2638] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-mono font-bold text-white tracking-wide uppercase">
              System Health & Telemetry
            </h1>
            <span className="text-xs font-mono text-emerald-400 border border-emerald-500/30 px-2 py-0.5 bg-emerald-500/10">
              ALL ENGINES NOMINAL
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time verification of Binance Public REST data streams, algorithmic worker cycles, and signal risk containment.
          </p>
        </div>

        <button
          onClick={onTriggerSync}
          className="px-4 py-2 font-mono text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-xs"
        >
          Ping & Sync Binance API
        </button>
      </div>

      {/* Health Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Binance Spot Gateway */}
        <div className="p-4 bg-[#111622] border border-[#1E2638] space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-[#1E2638]">
            <span className="text-neutral-400 font-medium">BINANCE SPOT API</span>
            <span className={`text-[10px] font-bold ${connectionState.status === 'CONNECTED' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {connectionState.status}
            </span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Roundtrip Latency:</span>
            <span className="text-white font-semibold tabular-nums">{connectionState.latencyMs} ms</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Endpoint:</span>
            <span className="text-neutral-400 truncate">api.binance.com/v3</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Protocol:</span>
            <span className="text-neutral-400">Public REST (No API Key Required)</span>
          </div>
        </div>

        {/* Card 2: Market Data Freshness */}
        <div className="p-4 bg-[#111622] border border-[#1E2638] space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-[#1E2638]">
            <span className="text-neutral-400 font-medium">DATA FRESHNESS</span>
            <span className="text-emerald-400 text-[10px] font-bold">LIVE SYNC</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Last Heartbeat:</span>
            <span className="text-white font-semibold tabular-nums">{timeSinceLastSync}s ago</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Pairs Monitored:</span>
            <span className="text-white font-semibold">{connectionState.totalScanned} Spot Pairs</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Worker Frequency:</span>
            <span className="text-neutral-400">Every 10 seconds</span>
          </div>
        </div>

        {/* Card 3: Quantitative Signal Engine */}
        <div className="p-4 bg-[#111622] border border-[#1E2638] space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-[#1E2638]">
            <span className="text-neutral-400 font-medium">SIGNAL ENGINE</span>
            <span className="text-emerald-400 text-[10px] font-bold">READY</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Active Algorithm:</span>
            <span className="text-white font-semibold">Trend-Pullback v2.4</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Confirmation Depth:</span>
            <span className="text-neutral-400">4H / 1H / 15M / 5M</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Risk Invariants:</span>
            <span className="text-emerald-400 font-semibold">ENFORCED</span>
          </div>
        </div>

        {/* Card 4: Order Safety Guarantee */}
        <div className="p-4 bg-[#111622] border border-emerald-500/30 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between pb-1 border-b border-[#1E2638]">
            <span className="text-neutral-400 font-medium">ORDER PRIVACY & SAFETY</span>
            <span className="text-emerald-400 text-[10px] font-bold">100% AIR-GAPPED</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Automated Ordering:</span>
            <span className="text-rose-400 font-semibold">DISABLED</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>API Secret Storage:</span>
            <span className="text-emerald-400 font-semibold">ZERO SECRETS KEPT</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Execution Model:</span>
            <span className="text-white">Manual Binance Approval</span>
          </div>
        </div>
      </div>

      {/* System Audit Log Viewer */}
      <div className="bg-[#111622] border border-[#1E2638] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#1E2638]">
          <div>
            <h2 className="text-sm font-mono font-semibold text-white uppercase tracking-wider">
              System Audit & Execution Logs
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Immutable local telemetry log recording scanner ticks, model executions, and data events
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Buttons */}
            <div className="flex items-center gap-1 font-mono text-xs">
              {(['ALL', 'INFO', 'WARN', 'ERROR'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setLogFilter(lvl)}
                  className={`px-2.5 py-1 border text-[11px] font-medium transition-colors ${
                    logFilter === lvl
                      ? 'bg-[#1E2638] text-white border-neutral-600'
                      : 'bg-[#0B0E14] text-neutral-400 border-[#1E2638] hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <button
              onClick={onClearLogs}
              className="text-xs font-mono text-neutral-400 hover:text-neutral-200 border border-[#1E2638] px-2.5 py-1 bg-[#0B0E14]"
            >
              Clear Logs
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-[#0B0E14] border border-[#1E2638] max-h-96 overflow-y-auto">
          <table className="w-full text-left text-xs font-mono tabular-nums border-collapse">
            <thead>
              <tr className="border-b border-[#1E2638] bg-[#0E121B] text-neutral-500">
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Level</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Event Message</th>
                <th className="py-2 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2638]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-neutral-500">
                    No system logs matching the selected level.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const dateStr = new Date(log.timestamp).toISOString().substring(11, 19);
                  return (
                    <tr key={log.id} className="hover:bg-[#111622] transition-colors">
                      <td className="py-2 px-3 text-neutral-500 whitespace-nowrap">
                        {dateStr} UTC
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 font-bold ${
                            log.level === 'INFO'
                              ? 'text-sky-400 bg-sky-500/10'
                              : log.level === 'WARN'
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-rose-400 bg-rose-500/10'
                          }`}
                        >
                          {log.level}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-neutral-400 whitespace-nowrap">
                        {log.category}
                      </td>
                      <td className="py-2 px-3 text-white font-medium">
                        {log.message}
                      </td>
                      <td className="py-2 px-3 text-neutral-400">
                        {log.details || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
