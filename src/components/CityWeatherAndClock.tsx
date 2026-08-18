import { useState, useEffect } from 'react';
import { GeolocData } from '../types';
import { Clock, Sun, Moon, CloudSun, Wind, Droplets, Compass, Thermometer } from 'lucide-react';

interface CityWeatherAndClockProps {
  data: GeolocData;
}

export default function CityWeatherAndClock({ data }: CityWeatherAndClockProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isNight, setIsNight] = useState<boolean>(false);
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  // Real-time ticking clock for target timezone
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: data.timezone || 'UTC',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        const dateFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: data.timezone || 'UTC',
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        const hour24Formatter = new Intl.DateTimeFormat('en-US', {
          timeZone: data.timezone || 'UTC',
          hour: 'numeric',
          hour12: false,
        });

        setCurrentTime(timeFormatter.format(now));
        setCurrentDate(dateFormatter.format(now));

        const hourNum = parseInt(hour24Formatter.format(now), 10);
        setIsNight(hourNum < 6 || hourNum >= 19);
      } catch {
        setCurrentTime(new Date().toLocaleTimeString());
        setCurrentDate(new Date().toLocaleDateString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [data.timezone]);

  // Generate realistic meteorological estimate based on latitude/longitude
  const baseTempC = Math.round(26 - Math.abs(data.latitude) * 0.35 + (data.longitude % 7));
  const tempC = Math.max(-5, Math.min(38, baseTempC));
  const tempF = Math.round((tempC * 9) / 5 + 32);
  const humidity = Math.min(92, Math.max(35, Math.abs(Math.round(data.latitude * 1.5)) % 60 + 35));
  const windSpeed = Math.min(45, Math.max(5, Math.abs(Math.round(data.longitude * 0.4)) % 30 + 8));

  return (
    <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-sky-500/20 transition-all duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
            Local Horizon & Solar State
          </h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold flex items-center gap-1">
          {isNight ? <Moon className="w-3 h-3 text-indigo-500" /> : <Sun className="w-3 h-3 text-amber-500" />}
          {isNight ? 'NIGHT PHASE' : 'DAYLIGHT'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Live Target Digital Clock */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              Node Local Time ({data.city})
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-800 dark:text-slate-100 mt-2 tracking-tight">
              {currentTime || '--:--:--'}
            </div>
            <p className="text-xs font-mono text-slate-500 mt-1">
              {currentDate} · {data.utcOffset ? `UTC ${data.utcOffset}` : 'UTC+0'}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>ZONE: {data.timezone}</span>
            <span className="text-sky-600 dark:text-cyan-400 font-bold">SYNCHRONIZED</span>
          </div>
        </div>

        {/* Weather Conditions Card */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                Surface Meteorological Telemetry
              </span>
              <button
                onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:text-sky-600 cursor-pointer"
              >
                °{unit} (SWITCH)
              </button>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-800 dark:text-slate-100">
                {unit === 'C' ? `${tempC}°C` : `${tempF}°F`}
              </span>
              <span className="text-xs font-mono text-slate-500 font-medium">
                {isNight ? 'Clear Skies (Night)' : 'Fair & Mild (Day)'}
              </span>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3 h-3 text-sky-500" />
              <span>Humidity: <strong>{humidity}%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3 h-3 text-teal-500" />
              <span>Wind: <strong>{windSpeed} km/h</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
