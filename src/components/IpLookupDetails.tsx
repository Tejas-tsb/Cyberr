import { GeolocData } from '../types';
import { MapPin, Clock, Compass, Globe2 } from 'lucide-react';

interface IpLookupDetailsProps {
  data: GeolocData;
}

export default function IpLookupDetails({ data }: IpLookupDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Country & Flag Card */}
      <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xs hover:border-sky-500/30 dark:hover:border-cyan-500/30 transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="text-slate-400">
            <Globe2 className="w-4 h-4 text-sky-600 dark:text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 font-mono">
              Country & Flag
            </h3>
          </div>
          <span className="text-[10px] font-mono text-sky-700 dark:text-cyan-400 bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/20 px-2 py-0.5 rounded-md uppercase font-bold">
            {data.countryCode}
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3.5">
          <img
            src={data.countryFlag}
            alt={`${data.country} flag`}
            referrerPolicy="no-referrer"
            className="w-10 h-7 object-cover rounded shadow-sm border border-slate-200 dark:border-slate-700/50 group-hover:scale-105 transition-transform"
          />
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate font-sans">
              {data.country}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Geographic ISO Registry</div>
          </div>
        </div>
      </div>

      {/* Region & City Card */}
      <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xs hover:border-sky-500/30 dark:hover:border-cyan-500/30 transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="text-slate-400">
            <MapPin className="w-4 h-4 text-sky-600 dark:text-cyan-400 group-hover:translate-y-[-2px] transition-transform duration-300" />
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 font-mono">
              City & Territory
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-bold">MUNICIPAL</span>
        </div>

        <div className="mt-4">
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate font-sans">
            {data.city}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">Region: {data.region || 'Metropolitan'}</div>
        </div>
      </div>

      {/* Timezone Card */}
      <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xs hover:border-sky-500/30 dark:hover:border-cyan-500/30 transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="text-slate-400">
            <Clock className="w-4 h-4 text-sky-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 font-mono">
              Temporal Offset
            </h3>
          </div>
          <span className="text-[10px] font-mono text-sky-700 dark:text-cyan-400 bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/20 px-2 py-0.5 rounded-md font-bold">
            {data.utcOffset}
          </span>
        </div>

        <div className="mt-4">
          <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate font-sans">
            {data.timezone}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">UTC Synchronization</div>
        </div>
      </div>

      {/* Latitude / Longitude Card */}
      <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xs hover:border-sky-500/30 dark:hover:border-cyan-500/30 transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="text-slate-400">
            <Compass className="w-4 h-4 text-sky-600 dark:text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 font-mono">
              GPS Coordinates
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 font-bold">WGS84</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-3">
          <div>
            <div className="text-[9px] text-slate-500 font-mono uppercase">LATITUDE</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
              {data.latitude.toFixed(5)}
            </div>
          </div>
          <div>
            <div className="text-[9px] text-slate-500 font-mono uppercase">LONGITUDE</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">
              {data.longitude.toFixed(5)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
