import { GeolocData } from '../types';
import { MapPin, Clock, Compass, Network, Globe2, Layers, Cpu } from 'lucide-react';

interface IpLookupDetailsProps {
  data: GeolocData;
}

export default function IpLookupDetails({ data }: IpLookupDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Country & Flag Card */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-5 rounded-xl hover:border-cyan-500/30 transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="text-slate-400">
            <Globe2 className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Location Origin</h3>
          </div>
          <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded uppercase font-bold">
            {data.countryCode}
          </span>
        </div>
        
        <div className="mt-4 flex items-center gap-4">
          <img
            src={data.countryFlag}
            alt={`${data.country} flag`}
            referrerPolicy="no-referrer"
            className="w-10 h-7 object-cover rounded shadow-md border border-slate-700/50 group-hover:scale-105 transition-transform"
          />
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-100 truncate">{data.country}</div>
            <div className="text-[10px] text-slate-500 font-mono">Geographic Registry</div>
          </div>
        </div>
      </div>

      {/* Region & City Card */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-5 rounded-xl hover:border-cyan-500/30 transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="text-slate-400">
            <MapPin className="w-4 h-4 text-cyan-400 group-hover:translate-y-[-2px] transition-transform duration-300" />
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Administrative Node</h3>
          </div>
          <span className="text-[9px] font-mono text-slate-500 font-bold">CITY_REG</span>
        </div>
        
        <div className="mt-4">
          <div className="text-sm font-bold text-slate-100 truncate">{data.city}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">Region: {data.region}</div>
        </div>
      </div>

      {/* Timezone Card */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-5 rounded-xl hover:border-cyan-500/30 transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="text-slate-400">
            <Clock className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Temporal State</h3>
          </div>
          <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded font-bold">
            {data.utcOffset}
          </span>
        </div>
        
        <div className="mt-4">
          <div className="text-sm font-bold text-slate-100 truncate">{data.timezone}</div>
          <div className="text-[10px] text-slate-500 font-mono mt-1">UTC Synchronization</div>
        </div>
      </div>

      {/* Latitude / Longitude Card */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 p-5 rounded-xl hover:border-cyan-500/30 transition-all duration-300 group">
        <div className="flex items-center justify-between">
          <div className="text-slate-400">
            <Compass className="w-4 h-4 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Coordinates</h3>
          </div>
          <span className="text-[9px] font-mono text-slate-500 font-bold">GPS_COORD</span>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-800/60 pt-3">
          <div>
            <div className="text-[9px] text-slate-500 font-mono uppercase">LATITUDE</div>
            <div className="text-xs font-bold text-slate-200 font-mono mt-0.5">{data.latitude.toFixed(5)}</div>
          </div>
          <div>
            <div className="text-[9px] text-slate-500 font-mono uppercase">LONGITUDE</div>
            <div className="text-xs font-bold text-slate-200 font-mono mt-0.5">{data.longitude.toFixed(5)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
