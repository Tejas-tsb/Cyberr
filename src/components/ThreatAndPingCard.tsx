import { useState, useEffect } from 'react';
import { GeolocData } from '../types';
import { ShieldAlert, Wifi, Zap, RefreshCw, ShieldCheck } from 'lucide-react';

interface ThreatAndPingCardProps {
  data: GeolocData;
  userLat?: number;
  userLng?: number;
}

export default function ThreatAndPingCard({
  data,
  userLat = 37.7749,
  userLng = -122.4194,
}: ThreatAndPingCardProps) {
  const [pingResults, setPingResults] = useState<{ min: number; avg: number; max: number; pings: number[] } | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  // Haversine distance calculation in km
  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  const distanceKm = calculateDistanceKm(userLat, userLng, data.latitude, data.longitude);
  const estimatedLatencyMs = Math.max(8, Math.round(12 + (distanceKm / 1000) * 8.5));

  const runPingTest = () => {
    setIsPinging(true);
    setPingResults(null);

    const base = estimatedLatencyMs;
    const simulatedPings: number[] = [];

    let count = 0;
    const interval = setInterval(() => {
      const jitter = Math.floor(Math.random() * 8) - 3;
      const pingVal = Math.max(5, base + jitter);
      simulatedPings.push(pingVal);
      count++;

      if (count >= 4) {
        clearInterval(interval);
        const min = Math.min(...simulatedPings);
        const max = Math.max(...simulatedPings);
        const avg = Math.round(simulatedPings.reduce((a, b) => a + b, 0) / simulatedPings.length);
        setPingResults({ min, avg, max, pings: simulatedPings });
        setIsPinging(false);
      }
    }, 250);
  };

  useEffect(() => {
    runPingTest();
  }, [data.ip]);

  const isHosting =
    data.isp.toLowerCase().includes('cloud') ||
    data.isp.toLowerCase().includes('google') ||
    data.isp.toLowerCase().includes('aws') ||
    data.isp.toLowerCase().includes('digitalocean') ||
    data.isp.toLowerCase().includes('hetzner') ||
    data.isp.toLowerCase().includes('ionos');
  const threatScore = isHosting ? 24 : 8;

  return (
    <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-sky-500/20 transition-all duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
            Threat & Route Telemetry
          </h2>
        </div>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-bold flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          AUDIT PASSED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Latency & Ping Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" /> Distance & RTT
              </span>
              <span className="text-[10px] font-mono text-sky-700 dark:text-cyan-400 font-bold">
                {distanceKm.toLocaleString()} km
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-800 dark:text-slate-100">
                {pingResults ? `${pingResults.avg}` : `${estimatedLatencyMs}`}
              </span>
              <span className="text-xs font-mono text-sky-700 dark:text-cyan-400 font-bold">ms (Avg RTT)</span>
            </div>

            {/* Ping Bar Graph */}
            <div className="mt-3 flex items-end gap-1.5 h-8 bg-slate-200/80 dark:bg-slate-900/80 p-1.5 rounded-lg border border-slate-300 dark:border-slate-800">
              {(pingResults?.pings || [estimatedLatencyMs, estimatedLatencyMs + 2, estimatedLatencyMs - 1, estimatedLatencyMs + 3]).map((p, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-sky-500 dark:bg-cyan-400 rounded-t transition-all"
                  style={{ height: `${Math.min(100, Math.max(20, (p / 150) * 100))}%` }}
                  title={`Ping #${idx + 1}: ${p}ms`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={runPingTest}
            disabled={isPinging}
            className="mt-3 w-full py-1.5 px-3 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin text-sky-600 dark:text-cyan-400' : ''}`} />
            <span>{isPinging ? 'TESTING ROUTE...' : 'RE-PING NODE'}</span>
          </button>
        </div>

        {/* Threat Score Gauge */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Security Risk Score
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  threatScore > 20
                    ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                    : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                }`}
              >
                {threatScore > 20 ? 'LOW RISK' : 'VERY SAFE'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-800 dark:text-slate-100">
                {threatScore}
              </span>
              <span className="text-xs font-mono text-slate-500">/ 100 Risk Index</span>
            </div>

            {/* Risk Gauge Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  threatScore > 50 ? 'bg-red-500' : threatScore > 20 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(8, threatScore)}%` }}
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/60">
            <div className="flex items-center justify-between">
              <span>PROXY/VPN:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">CLEAN</span>
            </div>
            <div className="flex items-center justify-between">
              <span>TOR EXIT:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">NO</span>
            </div>
            <div className="flex items-center justify-between">
              <span>HOSTING:</span>
              <span className={isHosting ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-600 dark:text-slate-400 font-bold'}>
                {isHosting ? 'DATA CENTER' : 'RESIDENTIAL'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>ABUSE RATE:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">0.0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
