import React, { useState } from 'react';
import { Search, Loader2, Globe, Copy, Check } from 'lucide-react';
import { isValidIp } from '../services/api';

interface HeaderProps {
  onSearch: (ip: string) => void;
  isSearching: boolean;
  currentIp?: string;
  timezone?: string;
  utcOffset?: string;
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function Header({ onSearch, isSearching, currentIp, timezone, utcOffset, onToast }: HeaderProps) {
  const [searchInput, setSearchInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) {
      onToast('Please enter an IP address to search.', 'error');
      return;
    }
    if (!isValidIp(query)) {
      onToast('Invalid IP address syntax. Support IPv4 or IPv6 formats.', 'error');
      return;
    }
    onSearch(query);
  };

  const handleCopyCurrentIp = async () => {
    if (!currentIp) return;
    try {
      await navigator.clipboard.writeText(currentIp);
      setIsCopied(true);
      onToast(`Copied IP ${currentIp} to clipboard`, 'success');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      onToast('Failed to copy IP address', 'error');
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-[#020617]/80 backdrop-blur-sm z-20 sticky top-0">
      {/* Title / Action Breadcrumb */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <form onSubmit={handleSubmit} className="relative w-full flex items-center gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter IP Address (e.g. 8.8.8.8)"
              className="w-full bg-[#0f172a] border border-slate-700/80 rounded-full py-2 px-10 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all font-mono"
              disabled={isSearching}
            />
            <div className="absolute left-4 top-2.5 text-slate-500">
              {isSearching ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-xs font-bold rounded-full transition-all whitespace-nowrap shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSearching ? 'MAPPING...' : 'MAP IP'}
          </button>
        </form>
      </div>

      <div className="flex items-center gap-6">
        {currentIp && (
          <div className="flex items-center gap-2 bg-[#0f172a] border border-slate-800 rounded-full px-3 py-1 text-xs">
            <span className="font-mono text-[10px] text-cyan-400 font-bold">{currentIp}</span>
            <button
              onClick={handleCopyCurrentIp}
              className="text-slate-500 hover:text-slate-300 transition-colors"
              title="Copy active IP"
            >
              {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        )}

        <div className="text-right hidden sm:block">
          <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest leading-none">Target Zone</p>
          <p className="text-xs text-slate-200 mt-1 font-semibold">
            {utcOffset ? `UTC ${utcOffset}` : 'UTC +00:00'} ({timezone ? timezone.split('/').pop()?.replace('_', ' ') : 'Paris'})
          </p>
        </div>
      </div>
    </header>
  );
}
