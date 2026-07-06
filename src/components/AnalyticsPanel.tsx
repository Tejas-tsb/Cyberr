import { SearchHistoryItem } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BarChart3, PieChartIcon, ShieldCheck, HelpCircle } from 'lucide-react';

interface AnalyticsPanelProps {
  history: SearchHistoryItem[];
}

const COLORS = [
  '#0ea5e9', // Cyan 500
  '#10b981', // Emerald 500
  '#6366f1', // Indigo 500
  '#f59e0b', // Amber 500
  '#ec4899', // Pink 500
  '#8b5cf6', // Violet 500
  '#14b8a6', // Teal 500
  '#ef4444', // Red 500
];

export default function AnalyticsPanel({ history }: AnalyticsPanelProps) {
  // Aggregate search history metrics
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

  // Sort descending by value
  chartData.sort((a, b) => b.value - a.value);

  const totalSearches = history.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Country Distribution Pie Card */}
      <div className="lg:col-span-1 bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/10 transition-all duration-300">
        <div>
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
            <PieChartIcon className="w-4 h-4 text-cyan-400" />
            <h2 className="text-xs font-bold text-slate-100 tracking-wide uppercase">
              Country Footprint
            </h2>
          </div>

          {totalSearches === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-600">
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                    }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-mono text-slate-100">{totalSearches}</span>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Pings</span>
              </div>
            </div>
          )}
        </div>

        {totalSearches > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mt-4">
            {chartData.slice(0, 4).map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800/80 text-[9px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-slate-400 truncate max-w-[65px]">{entry.name}</span>
                <span className="text-cyan-400 font-bold">{entry.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Query Load Bar Chart */}
      <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-cyan-500/10 transition-all duration-300">
        <div>
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h2 className="text-xs font-bold text-slate-100 tracking-wide uppercase">
                Load Telemetry Comparison
              </h2>
            </div>
            <span className="text-[9px] font-mono text-slate-500">SORT_DESC</span>
          </div>

          {totalSearches === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-slate-600">
              <BarChart3 className="w-8 h-8 mb-3" />
              <p className="text-xs font-mono">No historical records available</p>
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#475569"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => (val.length > 8 ? `${val.substring(0, 8)}..` : val)}
                  />
                  <YAxis stroke="#475569" fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#1e293b',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '11px',
                    }}
                    itemStyle={{ color: '#0ea5e9' }}
                  />
                  <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={30}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800/60 text-[9px] font-mono text-slate-600 flex items-center justify-between">
          <span>GRAPHIC_SYSTEM: RECHARTS_SVG</span>
          <span>DOCK_STATUS: STABLE</span>
        </div>
      </div>
    </div>
  );
}
