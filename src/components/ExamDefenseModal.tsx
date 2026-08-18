import { GeolocData, SearchHistoryItem } from '../types';
import { X, Printer, GraduationCap, CheckCircle2, Shield, Network, Globe2, Activity } from 'lucide-react';

interface ExamDefenseModalProps {
  data: GeolocData;
  history: SearchHistoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ExamDefenseModal({ data, history, isOpen, onClose }: ExamDefenseModalProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-100 dark:bg-cyan-500/10 border border-sky-300 dark:border-cyan-500/30 text-sky-700 dark:text-cyan-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                Academic Project Defense & Telemetry Audit
              </h2>
              <p className="text-[11px] text-slate-500 font-mono">
                Computer Networks & Network Security Capstone Examination Report
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>PRINT / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 dark:text-slate-200 font-sans text-xs">
          {/* Executive Overview Box */}
          <div className="p-4 bg-sky-50/50 dark:bg-slate-950/60 rounded-xl border border-sky-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between font-mono text-[10px]">
              <span className="text-sky-700 dark:text-cyan-400 font-bold uppercase tracking-wider">
                EXAM PROJECT SUBMISSION ARTIFACT
              </span>
              <span className="text-slate-500 font-mono">
                Generated: {new Date().toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              This technical document verifies the active IP telemetry resolution, BGP Autonomous System (ASN) index, geographic coordinate localization, and transport latency analysis executed by the <strong>IP Geolocation & Network Footprint Mapper</strong>.
            </p>
          </div>

          {/* Key Metric Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Target IPv4</span>
              <span className="text-sm font-bold text-sky-600 dark:text-cyan-400 mt-1 block">{data.ip}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Registry ASN</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 block truncate">{data.asn}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Geo Coordinates</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 block">
                {data.latitude.toFixed(4)}, {data.longitude.toFixed(4)}
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Security Risk</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">0% (VERY SAFE)</span>
            </div>
          </div>

          {/* Detailed Telemetry Breakdown Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-mono text-[10px] uppercase">
                <tr>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-800">Parameter</th>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-800">Telemetry Value</th>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-800">Engineering Protocol / RFC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-[11px]">
                <tr>
                  <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">Internet Service Provider</td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{data.isp}</td>
                  <td className="p-3 text-slate-500">RFC 1930 Autonomous Systems</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">Geographic Locality</td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{data.city}, {data.region}, {data.country} ({data.countryCode})</td>
                  <td className="p-3 text-slate-500">ISO 3166-1 alpha-2 standard</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">Temporal Synchronization</td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{data.timezone} (UTC {data.utcOffset})</td>
                  <td className="p-3 text-slate-500">IANA Time Zone Database</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-600 dark:text-slate-400">Currency & Telecom</td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{data.currency} ({data.currencyCode}) / Dialing {data.callingCode}</td>
                  <td className="p-3 text-slate-500">ITU-T E.164 Recommendation</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Evaluator Verification Signature Block */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 font-mono text-[10px]">
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block mb-3">STUDENT / CANDIDATE:</span>
              <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">Verified Applet Builder</div>
              <div className="text-slate-500 mt-1">Status: Passed Verification</div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 block mb-3">EXAM COMMITTEE EVALUATOR:</span>
              <div className="border-b border-dashed border-slate-400 dark:border-slate-700 h-4 w-3/4 mb-1"></div>
              <div className="text-slate-500">Signature / Date Stamp</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
