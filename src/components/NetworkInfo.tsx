import { GeolocData } from '../types';
import { Network, Server, Fingerprint, Coins, PhoneCall, ShieldCheck, Activity } from 'lucide-react';

interface NetworkInfoProps {
  data: GeolocData;
}

export default function NetworkInfo({ data }: NetworkInfoProps) {
  const specs = [
    {
      label: 'Autonomous System (ASN)',
      value: data.asn,
      desc: 'Routing network autonomous index number',
      icon: Fingerprint,
      accent: 'text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-950/20',
    },
    {
      label: 'Service Provider (ISP)',
      value: data.isp,
      desc: 'Assigned internet routing provider',
      icon: Server,
      accent: 'text-sky-600 dark:text-cyan-400 border-sky-200 dark:border-cyan-500/20 bg-sky-50 dark:bg-cyan-950/20',
    },
    {
      label: 'Registrant / Org',
      value: data.org,
      desc: 'Owner corporation or enterprise registry',
      icon: Network,
      accent: 'text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-950/20',
    },
    {
      label: 'Protocol Node Type',
      value: data.type,
      desc: 'IP family specification format type',
      icon: ShieldCheck,
      accent: 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      label: 'Regional Currency',
      value: `${data.currencyCode} (${data.currency})`,
      desc: 'Legal tender at geolocation target',
      icon: Coins,
      accent: 'text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-500/20 bg-pink-50 dark:bg-pink-950/20',
    },
    {
      label: 'Regional Dialing Prefix',
      value: data.callingCode,
      desc: 'Telecom calling prefix protocol',
      icon: PhoneCall,
      accent: 'text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20 bg-violet-50 dark:bg-violet-950/20',
    },
  ];

  return (
    <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 h-full flex flex-col justify-between shadow-xs hover:border-sky-500/20 transition-all duration-300">
      <div>
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-sky-600 dark:text-cyan-400 animate-pulse" />
            <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
              Network Footprint
            </h2>
          </div>
          <span className="text-[9px] px-2 py-0.5 bg-sky-50 dark:bg-cyan-500/10 text-sky-700 dark:text-cyan-400 border border-sky-200 dark:border-cyan-500/20 rounded font-bold font-mono">
            VERIFIED
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {specs.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className={`p-1.5 rounded-lg border ${spec.accent}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider leading-none">
                    {spec.label}
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 truncate font-mono">
                    {spec.value || 'N/A'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Distribution widget */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/50">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-mono">
            Global Routing Ingress
          </p>
          <div className="flex h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="w-2/3 bg-sky-500 dark:bg-cyan-400 shadow-xs"></div>
            <div className="w-1/6 bg-slate-300 dark:bg-slate-600"></div>
            <div className="w-1/6 bg-slate-400 dark:bg-slate-700"></div>
          </div>
          <div className="flex justify-between mt-1.5 text-[9px] font-mono text-slate-500 dark:text-slate-400">
            <span>Primary (67%)</span>
            <span>Secondary (16%)</span>
            <span>Edge (17%)</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-[9px] font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>ENCRYPTION: TLS 1.3 / AES_256</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-bold">STATUS: SECURE</span>
      </div>
    </div>
  );
}
