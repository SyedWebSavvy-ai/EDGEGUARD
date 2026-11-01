import React, { useState, useMemo } from 'react';
import { MarketTicker, MarketRegimeType, SignalDirection } from '../types';

interface MarketScannerViewProps {
  tickers: MarketTicker[];
  onSelectCoin: (symbol: string) => void;
  onOpenSignal: (symbol: string) => void;
  onOpenPaperOrder: (symbol: string, direction: SignalDirection, price: number) => void;
}

export const MarketScannerView: React.FC<MarketScannerViewProps> = ({
  tickers,
  onSelectCoin,
  onOpenSignal,
  onOpenPaperOrder
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState<'ALL' | 'BUY' | 'SELL' | 'NEUTRAL'>('ALL');
  const [regimeFilter, setRegimeFilter] = useState<'ALL' | MarketRegimeType>('ALL');
  const [minScore, setMinScore] = useState<number>(60);
  const [sortField, setSortField] = useState<keyof MarketTicker>('signalScore');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [viewScope, setViewScope] = useState<'TOP_3' | 'TOP_10' | 'ALL'>('ALL');

  // Filter & sort logic
  const filteredTickers = useMemo(() => {
    return tickers
      .filter((t) => {
        // Search
        const matchesSearch =
          t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        // Direction filter
        if (directionFilter !== 'ALL' && t.signalDirection !== directionFilter) {
          return false;
        }

        // Regime filter
        if (regimeFilter !== 'ALL' && t.regime !== regimeFilter) {
          return false;
        }

        // Min score filter
        if (t.signalScore < minScore) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        return sortAsc
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [tickers, searchQuery, directionFilter, regimeFilter, minScore, sortField, sortAsc]);

  const displayedTickers = useMemo(() => {
    if (viewScope === 'TOP_3') return filteredTickers.slice(0, 3);
    if (viewScope === 'TOP_10') return filteredTickers.slice(0, 10);
    return filteredTickers;
  }, [filteredTickers, viewScope]);

  const handleSort = (field: keyof MarketTicker) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const formatPrice = (p: number) => {
    return p < 1 ? p.toFixed(6) : p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatVol = (val: number) => {
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  const top3 = useMemo(() => {
    return [...tickers]
      .filter((t) => t.signalDirection === 'BUY')
      .sort((a, b) => b.signalScore - a.signalScore)
      .slice(0, 3);
  }, [tickers]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Disclaimers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1E2638] pb-4">
        <div>
          <h1 className="text-xl font-mono font-bold text-white tracking-wide uppercase">
            Market Scanner — Binance Spot USDT
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Algorithmic multi-factor scanning across spot order flow, volume velocity, and multi-timeframe structural alignment.
          </p>
        </div>

        {/* Scope Tabs: Top 3, Top 10, All 24+ */}
        <div className="flex items-center bg-[#0B0E14] border border-[#1E2638] p-0.5 self-start">
          <button
            onClick={() => setViewScope('TOP_3')}
            className={`px-3 py-1 font-mono text-xs font-medium transition-colors ${
              viewScope === 'TOP_3' ? 'bg-[#1E2638] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Top 3 High Conviction
          </button>
          <button
            onClick={() => setViewScope('TOP_10')}
            className={`px-3 py-1 font-mono text-xs font-medium transition-colors ${
              viewScope === 'TOP_10' ? 'bg-[#1E2638] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Top 10 Focus
          </button>
          <button
            onClick={() => setViewScope('ALL')}
            className={`px-3 py-1 font-mono text-xs font-medium transition-colors ${
              viewScope === 'ALL' ? 'bg-[#1E2638] text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Candidates ({tickers.length})
          </button>
        </div>
      </div>

      {/* Top 3 Research Highlight Cards */}
      {viewScope !== 'TOP_10' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {top3.map((coin, index) => (
            <div
              key={coin.symbol}
              className="bg-[#111622] border border-emerald-500/30 p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1E2638]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-emerald-400 font-bold">
                      RANK #{index + 1}
                    </span>
                    <span className="font-mono font-bold text-white text-base">
                      {coin.symbol}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                    Score: {coin.signalScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono tabular-nums text-neutral-400 my-3">
                  <div>
                    <span className="text-neutral-500 block text-[10px]">SPOT PRICE</span>
                    <span className="text-white font-semibold">${formatPrice(coin.price)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">24H CHANGE</span>
                    <span className={coin.change24h >= 0 ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h}%
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">RVOL VELOCITY</span>
                    <span className="text-sky-300 font-medium">{coin.rvol}x standard</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">REGIME</span>
                    <span className="text-neutral-200 truncate block">{coin.regime}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1E2638] flex items-center justify-between text-xs font-mono">
                <button
                  onClick={() => onSelectCoin(coin.symbol)}
                  className="text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Analyze Chart →
                </button>
                <button
                  onClick={() => onOpenPaperOrder(coin.symbol, 'BUY', coin.price)}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  Paper Trade
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="p-4 bg-[#111622] border border-[#1E2638] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Search symbol (e.g. BTC, SOL, ETH)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#1E2638] px-3 py-1.5 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
            />
          </div>

          {/* Direction Filter */}
          <div className="flex items-center gap-1 font-mono text-xs">
            <span className="text-neutral-500 mr-1">Direction:</span>
            {(['ALL', 'BUY', 'SELL', 'NEUTRAL'] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => setDirectionFilter(dir)}
                className={`px-2.5 py-1 border transition-colors ${
                  directionFilter === dir
                    ? dir === 'BUY'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                      : dir === 'SELL'
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                      : 'bg-[#1E2638] text-white border-neutral-600'
                    : 'bg-[#0B0E14] text-neutral-400 border-[#1E2638] hover:text-white'
                }`}
              >
                {dir}
              </button>
            ))}
          </div>

          {/* Regime Filter Dropdown */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-neutral-500">Regime:</span>
            <select
              value={regimeFilter}
              onChange={(e) => setRegimeFilter(e.target.value as any)}
              className="bg-[#0B0E14] border border-[#1E2638] px-2.5 py-1 text-xs font-mono text-white focus:outline-none"
            >
              <option value="ALL">All Regimes</option>
              <option value="Bullish Trending">Bullish Trending</option>
              <option value="Bearish Trending">Bearish Trending</option>
              <option value="Range-Bound Consolidation">Range Consolidation</option>
              <option value="Volatile Expansion">Volatile Expansion</option>
              <option value="Compression / Squeeze">Compression / Squeeze</option>
            </select>
          </div>

          {/* Min Score Slider */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-neutral-500">Min Score:</span>
            <input
              type="range"
              min="40"
              max="90"
              value={minScore}
              onChange={(e) => setMinScore(parseInt(e.target.value))}
              className="w-24 accent-emerald-500"
            />
            <span className="text-white font-semibold w-7 tabular-nums">{minScore}+</span>
          </div>
        </div>

        {/* Compliance Research Note */}
        <div className="pt-2 border-t border-[#1E2638] text-[11px] font-mono text-neutral-500 flex items-center justify-between">
          <span>
            Rankings and scores reflect mathematical multi-factor alignment, NOT guaranteed probabilities or investment advice.
          </span>
          <span className="tabular-nums">
            Showing {displayedTickers.length} of {tickers.length} evaluated
          </span>
        </div>
      </div>

      {/* Main High-Density Data Grid */}
      <div className="bg-[#111622] border border-[#1E2638] overflow-x-auto">
        <table className="w-full text-left text-xs font-mono tabular-nums border-collapse">
          <thead>
            <tr className="border-b border-[#1E2638] bg-[#0E121B] text-neutral-400 select-none">
              <th
                onClick={() => handleSort('symbol')}
                className="py-3 px-4 font-medium cursor-pointer hover:text-white"
              >
                Symbol {sortField === 'symbol' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => handleSort('price')}
                className="py-3 px-4 font-medium text-right cursor-pointer hover:text-white"
              >
                Price (USDT) {sortField === 'price' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => handleSort('change24h')}
                className="py-3 px-4 font-medium text-right cursor-pointer hover:text-white"
              >
                24h Change {sortField === 'change24h' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => handleSort('volumeUsdt')}
                className="py-3 px-4 font-medium text-right cursor-pointer hover:text-white"
              >
                24h Volume {sortField === 'volumeUsdt' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th
                onClick={() => handleSort('rvol')}
                className="py-3 px-4 font-medium text-right cursor-pointer hover:text-white"
              >
                RVOL {sortField === 'rvol' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th className="py-3 px-4 font-medium">Market Regime</th>
              <th className="py-3 px-4 font-medium">Trend Strength</th>
              <th
                onClick={() => handleSort('volatilityAtrPercent')}
                className="py-3 px-4 font-medium text-right cursor-pointer hover:text-white"
              >
                ATR % {sortField === 'volatilityAtrPercent' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th className="py-3 px-4 font-medium text-center">Direction</th>
              <th
                onClick={() => handleSort('signalScore')}
                className="py-3 px-4 font-medium text-right cursor-pointer hover:text-white"
              >
                Score {sortField === 'signalScore' ? (sortAsc ? '↑' : '↓') : ''}
              </th>
              <th className="py-3 px-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E2638]">
            {displayedTickers.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-neutral-500">
                  No assets match current scanner criteria. Try lowering the minimum score or clearing filters.
                </td>
              </tr>
            ) : (
              displayedTickers.map((coin) => {
                const isBuy = coin.signalDirection === 'BUY';
                const isSell = coin.signalDirection === 'SELL';
                return (
                  <tr
                    key={coin.symbol}
                    className="hover:bg-[#141A26] transition-colors group"
                  >
                    <td className="py-2.5 px-4 font-bold text-white whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{coin.symbol}</span>
                        <span className="text-[10px] text-neutral-500 font-normal">
                          {coin.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-white whitespace-nowrap">
                      ${formatPrice(coin.price)}
                    </td>
                    <td
                      className={`py-2.5 px-4 text-right font-medium whitespace-nowrap ${
                        coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {coin.change24h >= 0 ? `+${coin.change24h}%` : `${coin.change24h}%`}
                    </td>
                    <td className="py-2.5 px-4 text-right text-neutral-300 whitespace-nowrap">
                      {formatVol(coin.volumeUsdt)}
                    </td>
                    <td className="py-2.5 px-4 text-right text-sky-400 font-medium whitespace-nowrap">
                      {coin.rvol}x
                    </td>
                    <td className="py-2.5 px-4 text-neutral-300 text-xs whitespace-nowrap">
                      {coin.regime}
                    </td>
                    <td className="py-2.5 px-4 text-xs whitespace-nowrap">
                      <span
                        className={
                          coin.trendStrength.includes('Bull')
                            ? 'text-emerald-400 font-medium'
                            : coin.trendStrength.includes('Bear')
                            ? 'text-rose-400 font-medium'
                            : 'text-neutral-400'
                        }
                      >
                        {coin.trendStrength}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right text-neutral-300 whitespace-nowrap">
                      {coin.volatilityAtrPercent}%
                    </td>
                    <td className="py-2.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 ${
                          isBuy
                            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                            : isSell
                            ? 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
                            : 'text-neutral-400 bg-neutral-800/40 border border-neutral-700/40'
                        }`}
                      >
                        {coin.signalDirection || 'NEUTRAL'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      <span
                        className={`font-bold ${
                          coin.signalScore >= 80
                            ? 'text-emerald-400'
                            : coin.signalScore >= 70
                            ? 'text-sky-300'
                            : 'text-neutral-400'
                        }`}
                      >
                        {coin.signalScore}
                      </span>
                      <span className="text-[10px] text-neutral-500">/100</span>
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectCoin(coin.symbol)}
                          className="px-2 py-1 text-[11px] text-neutral-300 hover:text-white border border-[#1E2638] hover:border-neutral-600 bg-[#0B0E14]"
                          title="Open Chart Terminal"
                        >
                          Chart
                        </button>
                        <button
                          onClick={() => onOpenSignal(coin.symbol)}
                          className="px-2 py-1 text-[11px] text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/10"
                          title="View Signal Intel"
                        >
                          Intel
                        </button>
                        <button
                          onClick={() => onOpenPaperOrder(coin.symbol, coin.signalDirection === 'SELL' ? 'SELL' : 'BUY', coin.price)}
                          className="px-2 py-1 text-[11px] text-white bg-neutral-800 hover:bg-neutral-700"
                          title="Simulate in Paper Trading"
                        >
                          Paper
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
