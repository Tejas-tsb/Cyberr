import React, { useState } from 'react';
import { Search, Loader2, Copy, Check, ArrowRightLeft, GraduationCap } from 'lucide-react';
import { isValidIp } from '../services/api';
import ThemeSelector, { DashboardTheme } from './ThemeSelector';

interface HeaderProps {
  onSearch: (ip: string) => void;
  isSearching: boolean;
  currentIp?: string;
  timezone?: string;
  utcOffset?: string;
  currentTheme: DashboardTheme;
  onSelectTheme: (theme: DashboardTheme) => void;
  onOpenCompare: () => void;
  onOpenExamModal: () => void;
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function Header({
  onSearch,
  isSearching,
  currentIp,
  timezone,
  utcOffset,
  currentTheme,
  onSelectTheme,
  onOpenCompare,
  onOpenExamModal,
  onToast,
}: HeaderProps) {
  const [searchInput, setSearchInput] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) {
      onToast('Please enter an IP address or domain.', 'error');
      return;
    }
    if (!isValidIp(query)) {
      onToast('Invalid IP syntax format. (e.g. 8.8.8.8 or 82.165.1.1)', 'error');
      return;
    }
    onSearch(query);
    setSearchInput('');
  };

  const handleCopyCurrentIp = () => {
    if (currentIp) {
      navigator.clipboard.writeText(currentIp);
      setIsCopied(true);
      onToast(`Copied ${currentIp} to clipboard`, 'success');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between px-6 lg:px-8 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-20 sticky top-0 gap-4 shadow-xs">
      {/* Search Input Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <form onSubmit={handleSubmit} className="relative w-full flex items-center gap-3">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter IP Address (e.g. 8.8.8.8 or 82.165.1.1)"
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700/80 rounded-full py-2 px-10 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 transition-all font-mono shadow-xs"
              disabled={isSearching}
            />
            <div className="absolute left-3.5 top-2.5 text-slate-400">
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin text-sky-600 dark:text-cyan-400" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-bold rounded-full transition-all whitespace-nowrap shadow-sm disabled:opacity-50 flex items-center gap-1.5 cursor-pointer font-mono"
          >
            {isSearching ? 'MAPPING...' : 'MAP IP'}
          </button>
        </form>
      </div>

      <div className="flex items-center gap-2.5 lg:gap-4">
        {/* Dual Compare Inspector Button */}
        <button
          onClick={onOpenCompare}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
          <span>DUAL COMPARE</span>
        </button>

        {/* Academic Defense Sheet Button */}
        <button
          onClick={onOpenExamModal}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono font-bold text-indigo-700 dark:text-indigo-300 transition-all cursor-pointer shadow-xs"
        >
          <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>DEFENSE REPORT</span>
        </button>

        {/* Theme Selector */}
        <ThemeSelector currentTheme={currentTheme} onSelectTheme={onSelectTheme} />

        {/* Current IP quick badge */}
        {currentIp && (
          <div className="hidden xl:flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-full px-3 py-1 text-xs">
            <span className="font-mono text-[11px] text-sky-700 dark:text-cyan-400 font-bold">{currentIp}</span>
            <button
              onClick={handleCopyCurrentIp}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
              title="Copy IP"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
