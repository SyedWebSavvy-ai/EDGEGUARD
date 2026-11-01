import React from 'react';

export type ActiveView = 
  | 'overview'
  | 'scanner'
  | 'signals'
  | 'market_analysis'
  | 'backtesting'
  | 'research'
  | 'paper_trading'
  | 'trade_journal'
  | 'performance'
  | 'system_health'
  | 'settings';

interface SidebarProps {
  activeView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  signalCount?: number;
  openPositionCount?: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  signalCount = 0,
  openPositionCount = 0,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const navSections: {
    title: string;
    items: {
      id: ActiveView;
      label: string;
      icon: React.ReactNode;
      badge?: string | number;
      badgeColor?: string;
    }[];
  }[] = [
    {
      title: 'INTELLIGENCE',
      items: [
        {
          id: 'overview',
          label: 'Overview',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9"/>
              <rect x="14" y="3" width="7" height="5"/>
              <rect x="14" y="12" width="7" height="9"/>
              <rect x="3" y="16" width="7" height="5"/>
            </svg>
          )
        },
        {
          id: 'scanner',
          label: 'Market Scanner',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          ),
          badge: '24 Pairs'
        },
        {
          id: 'signals',
          label: 'Signals Center',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          ),
          badge: signalCount > 0 ? `${signalCount} Active` : undefined,
          badgeColor: 'text-emerald-400'
        },
        {
          id: 'market_analysis',
          label: 'Coin Details',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          )
        }
      ]
    },
    {
      title: 'QUANTITATIVE LAB',
      items: [
        {
          id: 'backtesting',
          label: 'Backtesting Lab',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"/>
              <path d="m19 9-5 5-4-4-3 3"/>
            </svg>
          )
        },
        {
          id: 'research',
          label: 'Strategy Research',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          )
        }
      ]
    },
    {
      title: 'EXECUTION & AUDIT',
      items: [
        {
          id: 'paper_trading',
          label: 'Paper Trading',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          ),
          badge: openPositionCount > 0 ? `${openPositionCount} Open` : undefined
        },
        {
          id: 'trade_journal',
          label: 'Trade Journal',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          )
        },
        {
          id: 'performance',
          label: 'Performance Analytics',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
              <path d="M22 12A10 10 0 0 0 12 2v10z"/>
            </svg>
          )
        }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        {
          id: 'system_health',
          label: 'System Health',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          )
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          )
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-[#0B0E14] border-r border-[#1E2638] flex flex-col justify-between z-40 transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto py-4">
          {/* Mobile close button header */}
          <div className="flex items-center justify-between px-5 pb-3 lg:hidden border-b border-[#1E2638]">
            <span className="font-mono text-sm font-bold text-white uppercase">Menu</span>
            <button onClick={onCloseMobile} className="text-neutral-400 hover:text-white p-1">
              ✕
            </button>
          </div>

          <div className="px-3 space-y-6">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="px-3 text-[10px] font-mono font-medium text-neutral-500 uppercase tracking-widest">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectView(item.id);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors border-l-2 ${
                          isActive
                            ? 'bg-[#141A26] border-emerald-500 text-white font-semibold'
                            : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-[#111622]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className={isActive ? 'text-emerald-400' : 'text-neutral-500'}>
                            {item.icon}
                          </span>
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-mono tabular-nums ${item.badgeColor || 'text-neutral-500'}`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisory & Spot Compliance Footer */}
        <div className="p-4 border-t border-[#1E2638] bg-[#0E121B] text-[11px] font-mono text-neutral-400 space-y-2 select-none">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Execution Mode:</span>
            <span className="text-neutral-200 font-semibold">MANUAL ADVISORY</span>
          </div>
          <p className="text-[10px] leading-relaxed text-neutral-400">
            Automated ordering disabled by design. All trades require manual Binance authorization.
          </p>
        </div>
      </aside>
    </>
  );
};
