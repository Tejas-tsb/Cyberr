import { GeolocData, SearchHistoryItem } from '../types';
import { Download, FileJson, FileText, Check } from 'lucide-react';
import { useState } from 'react';

interface ExportToolsProps {
  data: GeolocData;
  history: SearchHistoryItem[];
  onToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export default function ExportTools({ data, history, onToast }: ExportToolsProps) {
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  const downloadJson = () => {
    try {
      const exportObject = {
        exportTimestamp: new Date().toISOString(),
        targetIp: data,
        telemetryHistory: history,
      };
      const dataStr =
        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObject, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `geoip_report_${data.ip}_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setDownloadedFormat('json');
      onToast(`Exported JSON report for ${data.ip}`, 'success');
      setTimeout(() => setDownloadedFormat(null), 2500);
    } catch {
      onToast('Failed to generate JSON report.', 'error');
    }
  };

  const downloadCsv = () => {
    try {
      const headers = 'IP,Country,CountryCode,City,Region,Timezone,CallingCode,ISP,ASN,Latitude,Longitude\n';
      const row = `"${data.ip}","${data.country}","${data.countryCode}","${data.city}","${data.region}","${data.timezone}","${data.callingCode}","${data.isp}","${data.asn}",${data.latitude},${data.longitude}\n`;

      const csvStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + row);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', csvStr);
      downloadAnchor.setAttribute('download', `geoip_report_${data.ip}_${Date.now()}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setDownloadedFormat('csv');
      onToast(`Exported CSV report for ${data.ip}`, 'success');
      setTimeout(() => setDownloadedFormat(null), 2500);
    } catch {
      onToast('Failed to generate CSV report.', 'error');
    }
  };

  return (
    <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-sky-500/20 transition-all duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
            Export Telemetry Data
          </h2>
        </div>
        <span className="text-[9px] font-mono text-slate-500">FORMATS: JSON / CSV</span>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed font-sans">
        Generate structured offline intelligence reports including geolocation metrics, BGP autonomous system details, and session log history.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={downloadJson}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs"
        >
          {downloadedFormat === 'json' ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            <FileJson className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
          )}
          <span>{downloadedFormat === 'json' ? 'EXPORTED' : 'EXPORT JSON'}</span>
        </button>

        <button
          onClick={downloadCsv}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer shadow-xs"
        >
          {downloadedFormat === 'csv' ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          )}
          <span>{downloadedFormat === 'csv' ? 'EXPORTED' : 'EXPORT CSV'}</span>
        </button>
      </div>
    </div>
  );
}
