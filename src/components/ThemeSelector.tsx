import { Sparkles, Sun, Zap } from 'lucide-react';

export type DashboardTheme = 'titanium' | 'cyber' | 'aurora';

interface ThemeSelectorProps {
  currentTheme: DashboardTheme;
  onSelectTheme: (theme: DashboardTheme) => void;
}

export default function ThemeSelector({ currentTheme, onSelectTheme }: ThemeSelectorProps) {
  const themes: { id: DashboardTheme; name: string; icon: any; desc: string }[] = [
    {
      id: 'titanium',
      name: 'Light Theme',
      icon: Sun,
      desc: 'Clean, modern high-contrast presentation mode',
    },
    {
      id: 'cyber',
      name: 'Dark Cyber',
      icon: Zap,
      desc: 'Obsidian cyan telemetry dark grid',
    },
    {
      id: 'aurora',
      name: 'Aurora Dark',
      icon: Sparkles,
      desc: 'Indigo & amethyst glow theme',
    },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-slate-200/90 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-800 shadow-sm backdrop-blur-md">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = currentTheme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelectTheme(t.id)}
            title={`${t.name} - ${t.desc}`}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer ${
              isActive
                ? 'bg-sky-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm shadow-sky-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline uppercase">{t.name}</span>
          </button>
        );
      })}
    </div>
  );
}
