import React from 'react';

export interface NotificationItem {
  id: string;
  timestamp: number;
  title: string;
  message: string;
  type: 'SIGNAL' | 'RISK' | 'REGIME' | 'SYSTEM';
  symbol?: string;
  score?: number;
}

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onSelectNotification: (item: NotificationItem) => void;
  onClearAll: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onSelectNotification,
  onClearAll
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-sm bg-[#0B0E14] border-l border-[#1E2638] h-full flex flex-col font-mono text-xs shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-[#1E2638] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white uppercase text-sm">
              Intelligence Alerts
            </span>
            <span className="text-[10px] text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 bg-emerald-500/10">
              {notifications.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2 border-b border-[#1E2638] flex justify-between items-center text-[11px] text-neutral-400">
          <span>Real-time Binance Spot Watcher</span>
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-neutral-400 hover:text-white underline"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#1E2638]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              No unread intelligence alerts. All monitored parameters nominal.
            </div>
          ) : (
            notifications.map((item) => {
              const timeStr = new Date(item.timestamp).toISOString().substring(11, 16);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectNotification(item);
                    onClose();
                  }}
                  className="p-4 hover:bg-[#111622] transition-colors cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 font-bold ${
                          item.type === 'SIGNAL'
                            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                            : item.type === 'RISK'
                            ? 'text-amber-400 bg-amber-500/10 border border-amber-500/30'
                            : 'text-sky-400 bg-sky-500/10 border border-sky-500/30'
                        }`}
                      >
                        {item.type}
                      </span>
                      {item.symbol && (
                        <span className="font-bold text-white">{item.symbol}</span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-500">{timeStr} UTC</span>
                  </div>

                  <div className="text-white font-medium text-xs">
                    {item.title}
                  </div>
                  <div className="text-neutral-400 text-[11px] leading-tight">
                    {item.message}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
