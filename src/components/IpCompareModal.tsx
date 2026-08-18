import React, { useState } from 'react';
import { GeolocData } from '../types';
import { fetchIpData, isValidIp } from '../services/api';
import { X, ArrowRightLeft, Search, Loader2, Radio } from 'lucide-react';

interface IpCompareModalProps {
  currentData: GeolocData;
  isOpen: boolean;
  onClose: () => void;
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function IpCompareModal({ currentData, isOpen, onClose, onToast }: IpCompareModalProps) {
  const [compareIpInput, setCompareIpInput] = useState('');
  const [compareData, setCompareData] = useState<GeolocData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleFetchCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = compareIpInput.trim();
    if (!query) {
      onToast('Enter an IP address to compare.', 'error');
      return;
    }
    if (!isValidIp(query)) {
      onToast('Invalid IP syntax format.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetchIpData(query);
      setCompareData(res);
      onToast(`Comparing ${currentData.ip} against ${res.ip}`, 'success');
    } catch (err: any) {
      onToast(err.message || 'Failed to resolve comparison IP', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/30 text-sky-600 dark:text-cyan-400">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-wide uppercase">
                Dual IP Telemetry Inspector
              </h2>
              <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                Compare geolocation, ASN, routing & timezone parameters side-by-side
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Target input form */}
          <form onSubmit={handleFetchCompare} className="flex gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                value={compareIpInput}
                onChange={(e) => setCompareIpInput(e.target.value)}
                placeholder="Enter 2nd IP address to compare (e.g. 1.1.1.1 or 82.165.1.1)"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-xl py-2.5 px-10 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 font-mono shadow-xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-bold font-mono rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 whitespace-nowrap shadow-xs"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
              <span>COMPARE NOW</span>
            </button>
          </form>

          {/* Comparison Table Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary IP Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-sky-700 dark:text-cyan-400 uppercase tracking-widest font-bold">
                  Node A (Active)
                </span>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100 bg-sky-100 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/20 px-2 py-0.5 rounded">
                  {currentData.ip}
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500">Location:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5">
                    <img src={currentData.countryFlag} className="w-4 h-3 object-cover rounded" alt="flag" />
                    {currentData.city}, {currentData.countryCode}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500">ASN / ISP:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[170px]">
                    {currentData.asn} - {currentData.isp}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500">Calling Code:</span>
                  <span className="text-sky-700 dark:text-cyan-400 font-bold">{currentData.callingCode}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-slate-500">Timezone:</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {currentData.timezone} ({currentData.utcOffset})
                  </span>
                </div>
                <div className="flex justify-between items-center py-1.5">
                  <span className="text-slate-500">Coordinates:</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {currentData.latitude.toFixed(4)}, {currentData.longitude.toFixed(4)}
                  </span>
                </div>
              </div>
            </div>

            {/* Comparison Target IP Card */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-bold">
                  Node B (Comparison)
                </span>
                {compareData ? (
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2 py-0.5 rounded">
                    {compareData.ip}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400">AWAITING TARGET</span>
                )}
              </div>

              {compareData ? (
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5">
                      <img src={compareData.countryFlag} className="w-4 h-3 object-cover rounded" alt="flag" />
                      {compareData.city}, {compareData.countryCode}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-slate-500">ASN / ISP:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold truncate max-w-[170px]">
                      {compareData.asn} - {compareData.isp}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-slate-500">Calling Code:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{compareData.callingCode}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-slate-500">Timezone:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {compareData.timezone} ({compareData.utcOffset})
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-500">Coordinates:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {compareData.latitude.toFixed(4)}, {compareData.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center text-slate-400 space-y-2">
                  <Radio className="w-8 h-8 text-slate-300 dark:text-slate-600 animate-pulse" />
                  <p className="text-xs font-mono">
                    Enter an IP address above to begin comparative telemetry inspection.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
