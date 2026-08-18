import { Zap, Globe2 } from 'lucide-react';

interface QuickPresetsBarProps {
  onSelectIp: (ip: string) => void;
  activeIp: string;
}

export const PRESET_NODES = [
  { ip: '8.8.8.8', name: 'Google DNS', loc: 'Mountain View, US', flag: 'us' },
  { ip: '1.1.1.1', name: 'Cloudflare', loc: 'San Francisco, US', flag: 'us' },
  { ip: '82.165.1.1', name: 'IONOS Hosting', loc: 'Berlin, DE', flag: 'de' },
  { ip: '208.67.222.222', name: 'Cisco OpenDNS', loc: 'San Jose, US', flag: 'us' },
  { ip: '9.9.9.9', name: 'Quad9 DNS', loc: 'Zurich, CH', flag: 'ch' },
  { ip: '151.101.0.81', name: 'BBC Fastly', loc: 'London, GB', flag: 'gb' },
  { ip: '133.242.18.232', name: 'Sakura Internet', loc: 'Tokyo, JP', flag: 'jp' },
  { ip: '13.70.151.250', name: 'Azure Cloud', loc: 'Sydney, AU', flag: 'au' },
];

export default function QuickPresetsBar({ onSelectIp, activeIp }: QuickPresetsBarProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm hover:border-sky-500/30 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
            Quick-Demo Global Nodes
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          One-click testing presets for project evaluation
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {PRESET_NODES.map((node) => {
          const isActive = activeIp === node.ip;
          return (
            <button
              key={node.ip}
              onClick={() => onSelectIp(node.ip)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap cursor-pointer border ${
                isActive
                  ? 'bg-sky-50 dark:bg-cyan-500/10 border-sky-500 dark:border-cyan-400 text-sky-700 dark:text-cyan-300 font-bold shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <img
                src={`https://flagcdn.com/${node.flag}.svg`}
                alt={node.loc}
                className="w-3.5 h-2.5 object-cover rounded shadow-xs"
              />
              <span className="font-semibold">{node.name}</span>
              <span className="text-[10px] opacity-70">({node.ip})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
