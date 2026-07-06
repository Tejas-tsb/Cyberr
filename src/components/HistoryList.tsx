import { SearchHistoryItem } from '../types';
import { Trash2, ShieldAlert, Navigation, ArrowRight, Trash, Calendar } from 'lucide-react';

interface HistoryListProps {
  history: SearchHistoryItem[];
  onSelectIp: (ip: string) => void;
  onDeleteHistory: (id: string) => void;
  onClearHistory: () => void;
}

export default function HistoryList({ history, onSelectIp, onDeleteHistory, onClearHistory }: HistoryListProps) {
  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 h-full flex flex-col justify-between hover:border-cyan-500/10 transition-all duration-300">
      <div>
        {/* Header bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-slate-100 tracking-wide uppercase">Recent Audits</h2>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-[10px] text-cyan-400 hover:underline tracking-wider font-semibold font-mono uppercase cursor-pointer"
            >
              CLEAR ALL
            </button>
          )}
        </div>

        {/* List of history logs */}
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 rounded-full bg-[#0f172a] border border-slate-800 flex items-center justify-center text-slate-600 mb-3">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <p className="text-xs text-slate-400 font-semibold">No recent telemetry records found</p>
            <p className="text-[10px] text-slate-600 font-mono mt-1">Queries are logged locally in secure sandboxed cache.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
            {history.map((item, index) => (
              <div
                key={item.id}
                className="group flex items-center justify-between p-2.5 rounded hover:bg-slate-800/50 border border-transparent hover:border-slate-700 transition-all duration-200"
              >
                {/* Clickable Area to Select IP */}
                <div
                  onClick={() => onSelectIp(item.ip)}
                  className="flex items-center gap-3 flex-grow cursor-pointer min-w-0"
                >
                  <span className="text-[10px] text-slate-600 font-mono">#{index + 1}</span>
                  <img
                    src={`https://flagcdn.com/${item.countryCode.toLowerCase()}.svg`}
                    alt={item.country}
                    referrerPolicy="no-referrer"
                    className="w-5 h-3.5 object-cover rounded shadow-sm border border-slate-800"
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                        {item.ip}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono truncate max-w-[100px]">
                        ({item.city})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Date & Trigger Actions */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                    {item.countryCode} · {item.timestamp.split(' ').slice(0, 2).join(' ')}
                  </span>
                  
                  <button
                    onClick={() => onDeleteHistory(item.id)}
                    title="Delete Record"
                    className="p-1 rounded hover:bg-red-950/40 text-slate-600 hover:text-red-400 border border-transparent hover:border-red-500/10 transition-all"
                  >
                    <Trash className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/60 text-[9px] font-mono text-slate-600 flex items-center justify-between">
        <span>HISTORY CAP: 10 RECORDS</span>
        <span>SANDBOXED CACHE: LOCALSTORAGE</span>
      </div>
    </div>
  );
}
