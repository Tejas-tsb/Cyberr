import { SearchHistoryItem } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BarChart3, PieChartIcon, ShieldCheck, HelpCircle } from 'lucide-react';

interface AnalyticsPanelProps {
  history: SearchHistoryItem[];
  isDark?: boolean;
}

const COLORS = [
  '#0284c7', // Sky 600
  '#10b981', // Emerald 500
  '#6366f1', // Indigo 500
  '#f59e0b', // Amber 500
  '#ec4899', // Pink 500
  '#8b5cf6', // Violet 500
  '#14b8a6', // Teal 500
  '#ef4444', // Red 500
];

export default function AnalyticsPanel({ history, isDark = false }: AnalyticsPanelProps) {
  const countryCounts = history.reduce((acc: Record<string, { value: number; code: string }>, item) => {
    const name = item.country || 'Unknown';
    if (!acc[name]) {
      acc[name] = { value: 0, code: item.countryCode || 'US' };
    }
    acc[name].value += 1;
    return acc;
  }, {});

  const chartData = Object.entries(countryCounts).map(([name, stat]) => ({
    name,
    value: stat.value,
    code: stat.code,
  }));

  chartData.sort((a, b) => b.value - a.value);
  const totalSearches = history.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Country Distribution Pie Card */}
      <div className="lg:col-span-1 bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-sky-500/20 transition-all duration-300">
        <div>
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <PieChartIcon className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
              Country Footprint
            </h2>
          </div>

          {totalSearches === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-400">
              <HelpCircle className="w-8 h-8 mb-3" />
              <p className="text-xs font-mono">Telemetry required</p>
            </div>
          ) : (
            <div className="h-56 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke={isDark ? '#0f172a' : '#ffffff'}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#1e293b' : '#e2e8f0',
                      borderRadius: '12px',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    itemStyle={{ color: isDark ? '#e2e8f0' : '#0f172a' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-100">
                  {totalSearches}
                </span>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Pings</span>
              </div>
            </div>
          )}
        </div>

        {totalSearches > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {chartData.slice(0, 4).map((entry, idx) => (
              <div
                key={entry.name}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-mono text-slate-700 dark:text-slate-300"
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="truncate max-w-[90px] font-bold">{entry.name}</span>
                <span className="text-slate-400">({entry.value})</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bar Chart History Distribution */}
      <div className="lg:col-span-2 bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xs hover:border-sky-500/20 transition-all duration-300">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
              <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
                Geographic Traffic Volume
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">HISTORIC AGGREGATE</span>
          </div>

          {totalSearches === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
              <p className="text-xs font-mono">Execute queries to populate regional traffic volume</p>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)'}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke={isDark ? '#64748b' : '#94a3b8'}
                    fontSize={10}
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }}
                  />
                  <YAxis
                    stroke={isDark ? '#64748b' : '#94a3b8'}
                    fontSize={10}
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={{ stroke: isDark ? '#334155' : '#e2e8f0' }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#1e293b' : '#e2e8f0',
                      borderRadius: '12px',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                    itemStyle={{ color: isDark ? '#e2e8f0' : '#0f172a' }}
                    cursor={{ fill: isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(241, 245, 249, 0.6)' }}
                  />
                  <Bar dataKey="value" fill="#0284c7" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <span>SAMPLE SIZE: {totalSearches} NODES</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
            <ShieldCheck className="w-3 h-3" />
            TELEMETRY REFRESH: REALTIME
          </span>
        </div>
      </div>
    </div>
  );
}
