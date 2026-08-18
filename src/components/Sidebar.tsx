import { LayoutDashboard, Search, BarChart3, History, Shield, Radio, Terminal, GraduationCap } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userIp?: string;
  onDetectMyIp: () => void;
  isDetecting: boolean;
  onOpenExamModal: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  userIp,
  onDetectMyIp,
  isDetecting,
  onOpenExamModal,
}: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'DASHBOARD', icon: LayoutDashboard, desc: 'Unified network console' },
    { id: 'lookup', name: 'INTEL & SUBNET', icon: Search, desc: 'Deep-dive geolocate & CIDR' },
    { id: 'analytics', name: 'ANALYTICS', icon: BarChart3, desc: 'Country footprint charts' },
    { id: 'history', name: 'HISTORY', icon: History, desc: 'Recent telemetry records' },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white/90 dark:bg-slate-950/90 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-screen sticky top-0 z-30 font-sans shadow-xs backdrop-blur-md">
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800/80">
          <div className="w-9 h-9 bg-sky-500/10 dark:bg-cyan-500/20 border border-sky-500/30 dark:border-cyan-500/30 rounded-xl flex items-center justify-center text-sky-600 dark:text-cyan-400 shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-slate-900 dark:text-slate-100">
              IP MAPPER PRO
            </h1>
            <span className="text-[9px] font-mono text-sky-600 dark:text-cyan-400 tracking-widest block font-bold leading-none mt-0.5">
              TELEMETRY SUITE
            </span>
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
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold tracking-wider transition-all duration-200 text-left cursor-pointer rounded-xl ${
                  isActive
                    ? 'bg-sky-50 dark:bg-cyan-500/10 text-sky-700 dark:text-cyan-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-sky-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <span className="uppercase">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-5 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
        {/* Exam Defense Sheet Quick Trigger */}
        <button
          onClick={onOpenExamModal}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-[11px] font-mono font-bold tracking-wider uppercase transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          <GraduationCap className="w-4 h-4" />
          <span>EXAM DEFENSE SHEET</span>
        </button>

        {/* My IP Detector */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
          <div>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">
              Local Node Status
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <p className="text-xs font-mono text-slate-800 dark:text-cyan-400 font-bold truncate">
                {userIp ? userIp : 'Detecting...'}
              </p>
            </div>
          </div>

          <button
            onClick={onDetectMyIp}
            disabled={isDetecting}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-mono font-bold tracking-wider uppercase transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Radio className={`w-3 h-3 ${isDetecting ? 'animate-spin text-sky-600' : 'animate-pulse text-sky-600 dark:text-cyan-400'}`} />
            <span>{isDetecting ? 'Tracing...' : 'Trace My Node'}</span>
          </button>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 px-1">
          <Terminal className="w-3 h-3 text-sky-600 dark:text-cyan-400" />
          <span>SYS_STATUS: READY</span>
        </div>
      </div>
    </aside>
  );
}
