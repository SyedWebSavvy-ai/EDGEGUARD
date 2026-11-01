import React, { useState, useMemo } from 'react';
import { Candle, Timeframe } from '../../types';

interface CandlestickChartProps {
  symbol: string;
  candles: Candle[];
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
  showIndicators?: boolean;
  height?: number;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  symbol,
  candles,
  timeframe,
  onTimeframeChange,
  showIndicators = true,
  height = 440
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showEma20, setShowEma20] = useState(true);
  const [showEma50, setShowEma50] = useState(true);
  const [showEma200, setShowEma200] = useState(true);
  const [activeSubPane, setActiveSubPane] = useState<'RSI' | 'MACD' | 'ATR' | 'NONE'>('RSI');

  const timeframes: Timeframe[] = ['5M', '15M', '1H', '4H', '1D'];

  // Calculations for chart viewport
  const { minPrice, maxPrice, priceRange, maxVol } = useMemo(() => {
    if (!candles || candles.length === 0) {
      return { minPrice: 0, maxPrice: 100, priceRange: 100, maxVol: 100 };
    }
    let min = Infinity;
    let max = -Infinity;
    let vol = 0;

    candles.forEach((c) => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > vol) vol = c.volume;
    });

    const pad = (max - min) * 0.08 || 1;
    return {
      minPrice: min - pad,
      maxPrice: max + pad,
      priceRange: (max + pad) - (min - pad),
      maxVol: vol || 1
    };
  }, [candles]);

  const chartWidth = 900;
  const mainHeight = activeSubPane === 'NONE' ? height - 60 : height - 140;
  const subPaneHeight = 80;
  const candleSpacing = chartWidth / (candles.length || 1);
  const candleBodyWidth = Math.max(3, candleSpacing * 0.65);

  const getY = (val: number) => {
    if (priceRange === 0) return mainHeight / 2;
    return mainHeight - ((val - minPrice) / priceRange) * mainHeight;
  };

  const getVolY = (vol: number) => {
    const volHeight = mainHeight * 0.22;
    return mainHeight - (vol / maxVol) * volHeight;
  };

  // Generate SVG path for an EMA series
  const generateEmaPath = (key: 'ema20' | 'ema50' | 'ema200') => {
    return candles
      .map((c, i) => {
        const val = c[key];
        if (val === undefined || isNaN(val)) return '';
        const x = i * candleSpacing + candleSpacing / 2;
        const y = getY(val);
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .filter(Boolean)
      .join(' ');
  };

  // Active or latest inspected candle
  const activeCandle = hoveredIndex !== null && candles[hoveredIndex] 
    ? candles[hoveredIndex] 
    : candles[candles.length - 1];

  const formatPrice = (p: number) => {
    if (p === undefined) return '0.00';
    return p < 1 ? p.toFixed(6) : p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="w-full bg-[#111622] border border-[#1E2638] rounded-none flex flex-col select-none">
      {/* Chart Toolbar */}
      <div className="px-4 py-2.5 border-b border-[#1E2638] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-mono font-semibold text-white tracking-wider">{symbol} SPOT</span>
          <span className="text-neutral-500 font-mono">·</span>
          {/* Timeframe switch */}
          <div className="flex items-center bg-[#0B0E14] border border-[#1E2638] p-0.5">
            {timeframes.map((tf) => (
              <button
                key={tf}
                onClick={() => onTimeframeChange(tf)}
                className={`px-2.5 py-1 font-mono text-[11px] font-medium transition-colors ${
                  timeframe === tf
                    ? 'bg-[#1E2638] text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Indicator Toggles */}
        {showIndicators && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEma20(!showEma20)}
              className={`px-2 py-0.5 font-mono text-[11px] border transition-colors ${
                showEma20
                  ? 'border-sky-500/50 text-sky-400 bg-sky-500/10'
                  : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
            >
              EMA 20
            </button>
            <button
              onClick={() => setShowEma50(!showEma50)}
              className={`px-2 py-0.5 font-mono text-[11px] border transition-colors ${
                showEma50
                  ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                  : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
            >
              EMA 50
            </button>
            <button
              onClick={() => setShowEma200(!showEma200)}
              className={`px-2 py-0.5 font-mono text-[11px] border transition-colors ${
                showEma200
                  ? 'border-purple-500/50 text-purple-400 bg-purple-500/10'
                  : 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
            >
              EMA 200
            </button>

            <span className="text-neutral-700">|</span>

            {/* Sub-pane selector */}
            <div className="flex items-center gap-1 font-mono text-[11px]">
              <span className="text-neutral-500">Oscillator:</span>
              {(['RSI', 'MACD', 'ATR', 'NONE'] as const).map((pane) => (
                <button
                  key={pane}
                  onClick={() => setActiveSubPane(pane)}
                  className={`px-1.5 py-0.5 ${
                    activeSubPane === pane
                      ? 'text-emerald-400 font-semibold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {pane}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Real-time OHLC Bar Header */}
      {activeCandle && (
        <div className="px-4 py-1.5 bg-[#0D111A] border-b border-[#1E2638] flex flex-wrap items-center gap-4 text-[11px] font-mono tabular-nums text-neutral-400">
          <div>
            <span className="text-neutral-500">O: </span>
            <span className="text-white font-medium">{formatPrice(activeCandle.open)}</span>
          </div>
          <div>
            <span className="text-neutral-500">H: </span>
            <span className="text-white font-medium">{formatPrice(activeCandle.high)}</span>
          </div>
          <div>
            <span className="text-neutral-500">L: </span>
            <span className="text-white font-medium">{formatPrice(activeCandle.low)}</span>
          </div>
          <div>
            <span className="text-neutral-500">C: </span>
            <span className={activeCandle.close >= activeCandle.open ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
              {formatPrice(activeCandle.close)}
            </span>
          </div>
          <div>
            <span className="text-neutral-500">Vol: </span>
            <span className="text-white font-medium">{activeCandle.volume.toLocaleString()}</span>
          </div>
          {activeCandle.rsi !== undefined && (
            <div>
              <span className="text-neutral-500">RSI(14): </span>
              <span className={activeCandle.rsi > 70 ? 'text-rose-400' : activeCandle.rsi < 30 ? 'text-emerald-400' : 'text-sky-300'}>
                {activeCandle.rsi}
              </span>
            </div>
          )}
          {activeCandle.atr !== undefined && (
            <div>
              <span className="text-neutral-500">ATR: </span>
              <span className="text-amber-300">{formatPrice(activeCandle.atr)}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Chart Area */}
      <div className="relative w-full overflow-hidden bg-[#0B0E14] p-2">
        <svg
          viewBox={`0 0 ${chartWidth} ${mainHeight + (activeSubPane !== 'NONE' ? subPaneHeight : 0)}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const svgX = (mouseX / rect.width) * chartWidth;
            const idx = Math.floor(svgX / candleSpacing);
            if (idx >= 0 && idx < candles.length) {
              setHoveredIndex(idx);
            }
          }}
        >
          <defs>
            <linearGradient id="bullVolGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="bearVolGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF4444" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
            const price = minPrice + priceRange * (1 - ratio);
            const y = mainHeight * ratio;
            return (
              <g key={ratio}>
                <line
                  x1="0"
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#171F2E"
                  strokeDasharray="3 3"
                />
                <text
                  x={chartWidth - 6}
                  y={y - 4}
                  fill="#475569"
                  fontSize="9"
                  textAnchor="end"
                  fontFamily="monospace"
                >
                  {formatPrice(price)}
                </text>
              </g>
            );
          })}

          {/* Volume Bars */}
          {candles.map((c, i) => {
            const isBull = c.close >= c.open;
            const x = i * candleSpacing + (candleSpacing - candleBodyWidth) / 2;
            const volY = getVolY(c.volume);
            const h = mainHeight - volY;
            return (
              <rect
                key={`vol-${i}`}
                x={x}
                y={volY}
                width={candleBodyWidth}
                height={h}
                fill={isBull ? 'url(#bullVolGrad)' : 'url(#bearVolGrad)'}
              />
            );
          })}

          {/* EMA Lines */}
          {showIndicators && showEma200 && (
            <path
              d={generateEmaPath('ema200')}
              fill="none"
              stroke="#A855F7"
              strokeWidth="1.2"
              strokeOpacity="0.75"
            />
          )}
          {showIndicators && showEma50 && (
            <path
              d={generateEmaPath('ema50')}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="1.2"
              strokeOpacity="0.85"
            />
          )}
          {showIndicators && showEma20 && (
            <path
              d={generateEmaPath('ema20')}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1.4"
            />
          )}

          {/* Candlesticks */}
          {candles.map((c, i) => {
            const isBull = c.close >= c.open;
            const xCenter = i * candleSpacing + candleSpacing / 2;
            const openY = getY(c.open);
            const closeY = getY(c.close);
            const highY = getY(c.high);
            const lowY = getY(c.low);
            const bodyTop = Math.min(openY, closeY);
            const bodyHeight = Math.max(2, Math.abs(openY - closeY));
            const color = isBull ? '#10B981' : '#EF4444';

            return (
              <g key={`candle-${i}`}>
                {/* High/Low Wick */}
                <line
                  x1={xCenter}
                  y1={highY}
                  x2={xCenter}
                  y2={lowY}
                  stroke={color}
                  strokeWidth="1.2"
                />
                {/* Candle Body */}
                <rect
                  x={xCenter - candleBodyWidth / 2}
                  y={bodyTop}
                  width={candleBodyWidth}
                  height={bodyHeight}
                  fill={color}
                  stroke={color}
                  strokeWidth="0.5"
                />
              </g>
            );
          })}

          {/* Market Structure Annotations: Support / Resistance & Break of Structure */}
          {candles.length > 20 && (
            <g>
              {/* Local Support Level */}
              <line
                x1={chartWidth * 0.3}
                y1={getY(minPrice + priceRange * 0.22)}
                x2={chartWidth}
                y2={getY(minPrice + priceRange * 0.22)}
                stroke="#10B981"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.6"
              />
              <text
                x={chartWidth * 0.32}
                y={getY(minPrice + priceRange * 0.22) - 4}
                fill="#10B981"
                fontSize="9"
                fontFamily="monospace"
              >
                Demand Zone / S1
              </text>

              {/* Local Resistance Level */}
              <line
                x1={chartWidth * 0.45}
                y1={getY(maxPrice - priceRange * 0.15)}
                x2={chartWidth}
                y2={getY(maxPrice - priceRange * 0.15)}
                stroke="#EF4444"
                strokeWidth="1"
                strokeDasharray="4 4"
                strokeOpacity="0.6"
              />
              <text
                x={chartWidth * 0.47}
                y={getY(maxPrice - priceRange * 0.15) - 4}
                fill="#EF4444"
                fontSize="9"
                fontFamily="monospace"
              >
                Supply Ceiling / R1
              </text>
            </g>
          )}

          {/* Crosshair Cursor if Hovering */}
          {hoveredIndex !== null && candles[hoveredIndex] && (
            <g>
              <line
                x1={hoveredIndex * candleSpacing + candleSpacing / 2}
                y1={0}
                x2={hoveredIndex * candleSpacing + candleSpacing / 2}
                y2={mainHeight}
                stroke="#64748B"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
              <line
                x1={0}
                y1={getY(candles[hoveredIndex].close)}
                x2={chartWidth}
                y2={getY(candles[hoveredIndex].close)}
                stroke="#64748B"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
            </g>
          )}

          {/* Sub-pane Oscillator: RSI or MACD */}
          {activeSubPane !== 'NONE' && (
            <g transform={`translate(0, ${mainHeight})`}>
              {/* Divider */}
              <line x1="0" y1="0" x2={chartWidth} y2="0" stroke="#1E2638" strokeWidth="1" />
              
              {/* RSI Sub-pane */}
              {activeSubPane === 'RSI' && (
                <g>
                  {/* Oversold / Overbought 30/70 bands */}
                  <line x1="0" y1={subPaneHeight * 0.3} x2={chartWidth} y2={subPaneHeight * 0.3} stroke="#EF4444" strokeDasharray="2 2" strokeOpacity="0.4" />
                  <line x1="0" y1={subPaneHeight * 0.7} x2={chartWidth} y2={subPaneHeight * 0.7} stroke="#10B981" strokeDasharray="2 2" strokeOpacity="0.4" />
                  <text x={8} y={subPaneHeight * 0.3 - 2} fill="#EF4444" fontSize="8" fontFamily="monospace">70 OB</text>
                  <text x={8} y={subPaneHeight * 0.7 - 2} fill="#10B981" fontSize="8" fontFamily="monospace">30 OS</text>

                  {/* RSI curve */}
                  <path
                    d={candles
                      .map((c, i) => {
                        if (c.rsi === undefined) return '';
                        const x = i * candleSpacing + candleSpacing / 2;
                        const y = subPaneHeight - (c.rsi / 100) * subPaneHeight;
                        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                      })
                      .filter(Boolean)
                      .join(' ')}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="1.2"
                  />
                </g>
              )}

              {/* MACD Sub-pane */}
              {activeSubPane === 'MACD' && (
                <g>
                  <line x1="0" y1={subPaneHeight / 2} x2={chartWidth} y2={subPaneHeight / 2} stroke="#334155" strokeWidth="0.8" />
                  {candles.map((c, i) => {
                    if (!c.macd) return null;
                    const x = i * candleSpacing + (candleSpacing - candleBodyWidth) / 2;
                    const hist = c.macd.hist;
                    const isPositive = hist >= 0;
                    const maxH = subPaneHeight / 2;
                    const barH = Math.min(maxH, Math.abs(hist * 20));
                    const y = isPositive ? (subPaneHeight / 2 - barH) : (subPaneHeight / 2);
                    return (
                      <rect
                        key={`macd-hist-${i}`}
                        x={x}
                        y={y}
                        width={candleBodyWidth}
                        height={Math.max(1, barH)}
                        fill={isPositive ? '#10B981' : '#EF4444'}
                        opacity="0.65"
                      />
                    );
                  })}
                </g>
              )}

              {/* ATR Sub-pane */}
              {activeSubPane === 'ATR' && (
                <g>
                  <path
                    d={candles
                      .map((c, i) => {
                        if (c.atr === undefined) return '';
                        const x = i * candleSpacing + candleSpacing / 2;
                        const y = subPaneHeight - (Math.min(100, (c.atr / (c.close * 0.05)) * 100) / 100) * subPaneHeight;
                        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
                      })
                      .filter(Boolean)
                      .join(' ')}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="1.2"
                  />
                  <text x={8} y={14} fill="#F59E0B" fontSize="9" fontFamily="monospace">ATR Volatility Index</text>
                </g>
              )}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
