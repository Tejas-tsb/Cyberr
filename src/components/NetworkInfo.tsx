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
      accent: 'text-amber-400 border-amber-500/10 bg-amber-950/10',
    },
    {
      label: 'Service Provider (ISP)',
      value: data.isp,
      desc: 'Assigned internet routing provider',
      icon: Server,
      accent: 'text-cyan-400 border-cyan-500/10 bg-cyan-950/10',
    },
    {
      label: 'Registrant / Org',
      value: data.org,
      desc: 'Owner corporation or enterprise registry',
      icon: Network,
      accent: 'text-indigo-400 border-indigo-500/10 bg-indigo-950/10',
    },
    {
      label: 'Protocol Node Type',
      value: data.type,
      desc: 'IP family specification format type',
      icon: ShieldCheck,
      accent: 'text-emerald-400 border-emerald-500/10 bg-emerald-950/10',
    },
    {
      label: 'Regional Currency',
      value: `${data.currencyCode} (${data.currency})`,
      desc: 'Legal tender at geolocation target',
      icon: Coins,
      accent: 'text-pink-400 border-pink-500/10 bg-pink-950/10',
    },
    {
      label: 'Regional Dialing Prefix',
      value: data.callingCode,
      desc: 'Telecom calling prefix protocol',
      icon: PhoneCall,
      accent: 'text-violet-400 border-violet-500/10 bg-violet-950/10',
    },
  ];

  return (
    <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 h-full flex flex-col justify-between hover:border-cyan-500/10 transition-all duration-300">
      <div>
        <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h2 className="text-xs font-bold text-slate-100 tracking-wide uppercase">Network Footprint</h2>
          </div>
          <span className="text-[9px] px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded font-bold">
            LIVE
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {specs.map((spec, i) => {
            const Icon = spec.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/40 hover:border-slate-800 transition-colors"
              >
                <div className={`p-1.5 rounded border ${spec.accent}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider leading-none">
                    {spec.label}
                  </div>
                  <div className="text-xs font-bold text-slate-200 mt-1 truncate font-mono">
                    {spec.value || 'N/A'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Distribution widget from design mockup */}
        <div className="mt-5 pt-4 border-t border-slate-800/50">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-mono">Global Distribution load</p>
          <div className="flex h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="w-2/3 bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
            <div className="w-1/6 bg-slate-600"></div>
            <div className="w-1/6 bg-slate-700"></div>
          </div>
          <div className="flex justify-between mt-1.5 text-[9px] font-mono text-slate-400">
            <span>EU (67%)</span>
            <span>NA (16%)</span>
            <span>AS (17%)</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/60 text-[9px] font-mono text-slate-600 flex items-center justify-between">
        <span>ENCRYPTION: AES_256</span>
        <span>STATUS: SECURE</span>
      </div>
    </div>
  );
}
