import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  datasetType?: 'BACKTEST' | 'PAPER' | 'LIVE_JOURNAL' | 'MARKET_SCAN';
  badgeNote?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subValue,
  trend,
  datasetType,
  badgeNote
}) => {
  return (
    <div className="bg-[#111622] border border-[#1E2638] p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
          {label}
        </span>
        {datasetType && (
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-tight">
            {datasetType === 'BACKTEST' && 'Sim Backtest'}
            {datasetType === 'PAPER' && 'Sim Paper'}
            {datasetType === 'LIVE_JOURNAL' && 'Manual Journal'}
            {datasetType === 'MARKET_SCAN' && 'Spot Live'}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-xl sm:text-2xl font-mono font-semibold tracking-tight text-white tabular-nums">
          {value}
        </span>
        {badgeNote && (
          <span className="text-xs font-mono text-neutral-400">
            {badgeNote}
          </span>
        )}
      </div>

      {subValue && (
        <div className="mt-2 pt-2 border-t border-[#1E2638]/60 flex items-center justify-between text-xs font-mono">
          <span
            className={
              trend === 'up'
                ? 'text-emerald-400 font-medium'
                : trend === 'down'
                ? 'text-rose-400 font-medium'
                : 'text-neutral-400'
            }
          >
            {subValue}
          </span>
        </div>
      )}
    </div>
  );
};
