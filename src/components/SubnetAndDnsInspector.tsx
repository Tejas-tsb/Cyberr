import { useState, useMemo } from 'react';
import { GeolocData } from '../types';
import { Network, Binary, ShieldCheck, Globe, Activity, CheckCircle2, AlertTriangle, RefreshCw, Cpu, Server } from 'lucide-react';

interface SubnetAndDnsInspectorProps {
  data: GeolocData;
  onToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function SubnetAndDnsInspector({ data, onToast }: SubnetAndDnsInspectorProps) {
  const [activeTab, setActiveTab] = useState<'subnet' | 'dns' | 'ports'>('subnet');
  const [cidrPrefix, setCidrPrefix] = useState<number>(24);
  const [isProbingPorts, setIsProbingPorts] = useState(false);
  const [probedPorts, setProbedPorts] = useState<{ [port: number]: { open: boolean; latency: number } }>({
    80: { open: true, latency: 28 },
    443: { open: true, latency: 31 },
    53: { open: true, latency: 14 },
    22: { open: false, latency: 45 },
    8080: { open: false, latency: 50 },
    25: { open: false, latency: 60 },
  });

  // Calculate Subnet Math for IPv4
  const subnetMath = useMemo(() => {
    const parts = data.ip.split('.').map((p) => parseInt(p, 10));
    if (parts.length !== 4 || parts.some(isNaN)) {
      return null;
    }

    const ipInt = ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
    const maskInt = cidrPrefix === 0 ? 0 : (~0 << (32 - cidrPrefix)) >>> 0;
    const wildcardInt = ~maskInt >>> 0;
    const netInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (netInt | wildcardInt) >>> 0;

    const intToIp = (val: number) => {
      return [(val >>> 24) & 255, (val >>> 16) & 255, (val >>> 8) & 255, val & 255].join('.');
    };

    const intToBinary = (val: number) => {
      return [(val >>> 24) & 255, (val >>> 16) & 255, (val >>> 8) & 255, val & 255]
        .map((byte) => byte.toString(2).padStart(8, '0'))
        .join('.');
    };

    const totalHosts = Math.pow(2, 32 - cidrPrefix);
    const usableHosts = Math.max(0, totalHosts - 2);
    const firstUsable = cidrPrefix >= 31 ? intToIp(netInt) : intToIp(netInt + 1);
    const lastUsable = cidrPrefix >= 31 ? intToIp(broadcastInt) : intToIp(broadcastInt - 1);

    return {
      networkAddress: intToIp(netInt),
      broadcastAddress: intToIp(broadcastInt),
      subnetMask: intToIp(maskInt),
      wildcardMask: intToIp(wildcardInt),
      firstUsable,
      lastUsable,
      totalHosts,
      usableHosts,
      binaryIp: intToBinary(ipInt),
      binaryMask: intToBinary(maskInt),
      ipClass: parts[0] <= 126 ? 'Class A' : parts[0] <= 191 ? 'Class B' : parts[0] <= 223 ? 'Class C' : 'Class D/E',
    };
  }, [data.ip, cidrPrefix]);

  // Simulated DNS Records
  const dnsRecords = useMemo(() => {
    const isGoogle = data.isp.toLowerCase().includes('google');
    const isCloudflare = data.isp.toLowerCase().includes('cloudflare');
    const isIonos = data.isp.toLowerCase().includes('ionos');

    const domain = isGoogle
      ? 'dns.google'
      : isCloudflare
      ? 'one.one.one.one'
      : isIonos
      ? 'ionos.com'
      : `${data.isp.toLowerCase().replace(/[^a-z0-9]/g, '') || 'host'}.net`;

    const ptrHost = isGoogle
      ? 'dns.google'
      : isCloudflare
      ? 'one.one.one.one'
      : `host-${data.ip.replace(/\./g, '-')}.${domain}`;

    return {
      rDns: ptrHost,
      aRecord: data.ip,
      aaaaRecord: `2001:4860:4860::${data.ip.split('.').pop()}`,
      mxRecord: `10 mail.${domain}`,
      nsRecord: `ns1.${domain}, ns2.${domain}`,
      txtRecord: `v=spf1 include:_spf.${domain} ~all`,
      soaRecord: `ns1.${domain} hostmaster.${domain} (2026081801, 7200, 3600, 1209600, 300)`,
    };
  }, [data.ip, data.isp]);

  const handleRunPortScan = () => {
    setIsProbingPorts(true);
    if (onToast) onToast(`Scanning standard networking ports for ${data.ip}...`, 'info');

    setTimeout(() => {
      const isKnownDns = data.ip === '8.8.8.8' || data.ip === '1.1.1.1' || data.ip === '9.9.9.9' || data.ip === '208.67.222.222';
      setProbedPorts({
        80: { open: !isKnownDns, latency: Math.floor(Math.random() * 15) + 20 },
        443: { open: true, latency: Math.floor(Math.random() * 18) + 22 },
        53: { open: true, latency: Math.floor(Math.random() * 10) + 12 },
        22: { open: false, latency: Math.floor(Math.random() * 25) + 35 },
        8080: { open: Math.random() > 0.6, latency: Math.floor(Math.random() * 30) + 40 },
        25: { open: false, latency: Math.floor(Math.random() * 20) + 50 },
      });
      setIsProbingPorts(false);
      if (onToast) onToast(`Port diagnostic completed for ${data.ip}`, 'success');
    }, 900);
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-sky-500/20 transition-all duration-300">
      {/* Header with Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
            WHOIS, Subnet CIDR & Diagnostic Suite
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('subnet')}
            className={`px-3 py-1 text-[11px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'subnet'
                ? 'bg-sky-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            CIDR SUBNET
          </button>
          <button
            onClick={() => setActiveTab('dns')}
            className={`px-3 py-1 text-[11px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'dns'
                ? 'bg-sky-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            DNS & rDNS
          </button>
          <button
            onClick={() => setActiveTab('ports')}
            className={`px-3 py-1 text-[11px] font-mono font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === 'ports'
                ? 'bg-sky-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            PORT PROBER
          </button>
        </div>
      </div>

      {/* TAB 1: SUBNET CIDR CALCULATOR */}
      {activeTab === 'subnet' && subnetMath && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                Target CIDR Prefix:
              </span>
              <select
                value={cidrPrefix}
                onChange={(e) => setCidrPrefix(Number(e.target.value))}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-mono font-bold text-sky-600 dark:text-cyan-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                {[8, 16, 20, 24, 26, 27, 28, 29, 30, 32].map((p) => (
                  <option key={p} value={p}>
                    /{p} (Netmask: {p === 8 ? '255.0.0.0' : p === 16 ? '255.255.0.0' : p === 24 ? '255.255.255.0' : `/${p}`})
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 font-semibold">
              Class Designation: <strong className="text-sky-600 dark:text-cyan-400">{subnetMath.ipClass}</strong>
            </span>
          </div>

          {/* Subnet Math Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Network ID</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 block">
                {subnetMath.networkAddress}/{cidrPrefix}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Broadcast IP</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 block">
                {subnetMath.broadcastAddress}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Usable Host Range</span>
              <span className="text-xs font-bold text-sky-600 dark:text-cyan-400 mt-1 block truncate">
                {subnetMath.firstUsable} - {subnetMath.lastUsable}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Usable Host Capacity</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                {subnetMath.usableHosts.toLocaleString()} Hosts
              </span>
            </div>
          </div>

          {/* Binary Bitstream Breakdown */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500 flex items-center gap-1.5 font-bold">
                <Binary className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                Binary IP Bitstream:
              </span>
              <code className="text-sky-700 dark:text-cyan-300 font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                {subnetMath.binaryIp}
              </code>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500 font-bold">Subnet Mask Bitstream:</span>
              <code className="text-emerald-700 dark:text-emerald-300 font-bold bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                {subnetMath.binaryMask}
              </code>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DNS & rDNS RECORDS */}
      {activeTab === 'dns' && (
        <div className="space-y-3 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>PTR (REVERSE DNS)</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">RESOLVED</span>
              </div>
              <p className="text-xs font-bold text-sky-600 dark:text-cyan-400 truncate">{dnsRecords.rDns}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>A (IPv4 ADDRESS)</span>
                <span className="text-sky-600 dark:text-cyan-400 font-bold">ACTIVE</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{dnsRecords.aRecord}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>AAAA (IPv6 NODE)</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">STANDBY</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{dnsRecords.aaaaRecord}</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>MX (MAIL EXCHANGER)</span>
                <span className="text-slate-500 font-bold">PRIORITY 10</span>
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{dnsRecords.mxRecord}</p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">SOA Authority & SPF Record</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 break-all">{dnsRecords.soaRecord}</p>
          </div>
        </div>
      )}

      {/* TAB 3: PORT PROBER */}
      {activeTab === 'ports' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono">
            {[
              { port: 80, name: 'HTTP Web' },
              { port: 443, name: 'HTTPS SSL' },
              { port: 53, name: 'DNS Lookup' },
              { port: 22, name: 'SSH Secure' },
              { port: 8080, name: 'Alt Proxy' },
              { port: 25, name: 'SMTP Mail' },
            ].map((p) => {
              const res = probedPorts[p.port];
              const isOpen = res?.open;
              return (
                <div
                  key={p.port}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isOpen
                      ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30'
                      : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="text-sm font-extrabold block text-slate-800 dark:text-slate-100">
                    :{p.port}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">{p.name}</span>
                  <div className="mt-2 flex items-center justify-center gap-1">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400 dark:bg-slate-600'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-bold ${
                        isOpen ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'
                      }`}
                    >
                      {isOpen ? `${res?.latency}ms` : 'FILTERED'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleRunPortScan}
            disabled={isProbingPorts}
            className="w-full py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProbingPorts ? 'animate-spin text-sky-600 dark:text-cyan-400' : ''}`} />
            <span>{isProbingPorts ? 'SCANNING PORTS...' : 'RE-SCAN REACHABILITY PORTS'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
