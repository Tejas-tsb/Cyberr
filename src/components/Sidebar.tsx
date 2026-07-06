import { LayoutDashboard, Search, BarChart3, History, Shield, Radio, Terminal } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userIp?: string;
  onDetectMyIp: () => void;
  isDetecting: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, userIp, onDetectMyIp, isDetecting }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'DASHBOARD', icon: LayoutDashboard, desc: 'Unified network console' },
    { id: 'lookup', name: 'INTEL FEED', icon: Search, desc: 'Deep-dive geolocate' },
    { id: 'analytics', name: 'ANALYTICS', icon: BarChart3, desc: 'Country footprint charts' },
    { id: 'history', name: 'HISTORY', icon: History, desc: 'Recent telemetry records' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0f172a] border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30 font-sans">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-8 h-8 bg-cyan-500/20 border border-cyan-500/30 rounded flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-slate-100">IP MAPPER PRO</h1>
            <span className="text-[9px] font-mono text-cyan-400 tracking-widest block font-bold leading-none mt-0.5">GEOLOC INSTRUMENT</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wider transition-all duration-200 text-left cursor-pointer border-r-2 ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-400'
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="uppercase">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-6 border-t border-slate-800/60">
        <div className="bg-slate-800/40 p-4 rounded-lg border border-slate-700/50 flex flex-col gap-3">
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1.5">My IP Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-xs font-mono text-cyan-400 font-bold truncate">
                {userIp ? userIp : 'Detecting...'}
              </p>
            </div>
          </div>

          <button
            onClick={onDetectMyIp}
            disabled={isDetecting}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 disabled:opacity-50"
          >
            <Radio className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : 'animate-pulse'}`} />
            <span>{isDetecting ? 'Tracing...' : 'Trace My Node'}</span>
          </button>
        </div>

        {/* System Terminal Log style lines */}
        <div className="flex items-center gap-2 text-[9px] font-mono text-slate-600 px-1 mt-4">
          <Terminal className="w-3 h-3 text-cyan-500/60" />
          <span>SYS_STATUS: ONLINE</span>
        </div>
      </div>
    </aside>
  );
}
