import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import IpLookupDetails from './components/IpLookupDetails';
import InteractiveMap from './components/InteractiveMap';
import NetworkInfo from './components/NetworkInfo';
import HistoryList from './components/HistoryList';
import AnalyticsPanel from './components/AnalyticsPanel';
import ThreatAndPingCard from './components/ThreatAndPingCard';
import ExportTools from './components/ExportTools';
import QuickPresetsBar from './components/QuickPresetsBar';
import SubnetAndDnsInspector from './components/SubnetAndDnsInspector';
import CityWeatherAndClock from './components/CityWeatherAndClock';
import ExamDefenseModal from './components/ExamDefenseModal';
import IpCompareModal from './components/IpCompareModal';
import Toast, { ToastMessage } from './components/Toast';
import { DashboardTheme } from './components/ThemeSelector';
import { fetchIpData } from './services/api';
import { GeolocData, SearchHistoryItem } from './types';
import { Radio, Terminal, Copy, Check, Sparkles } from 'lucide-react';

const DEFAULT_FALLBACK: GeolocData = {
  ip: '8.8.8.8',
  type: 'IPv4',
  country: 'United States',
  countryCode: 'US',
  countryFlag: 'https://cdn.ipwhois.io/flags/us.svg',
  city: 'Mountain View',
  region: 'California',
  timezone: 'America/Los_Angeles',
  utcOffset: '-07:00',
  isp: 'Google LLC',
  asn: 'AS15169',
  org: 'Google LLC',
  latitude: 37.4223,
  longitude: -122.084,
  currency: 'US Dollar',
  currencyCode: 'USD',
  callingCode: '+1',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSearching, setIsSearching] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [ipData, setIpData] = useState<GeolocData | null>(null);
  const [userIp, setUserIp] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  // Default theme is 'titanium' (Light Mode) as requested
  const [currentTheme, setCurrentTheme] = useState<DashboardTheme>(() => {
    try {
      return (localStorage.getItem('ip_mapper_theme') as DashboardTheme) || 'titanium';
    } catch {
      return 'titanium';
    }
  });

  const handleSelectTheme = (theme: DashboardTheme) => {
    setCurrentTheme(theme);
    try {
      localStorage.setItem('ip_mapper_theme', theme);
    } catch {}
  };

  // Sync dark class on html / document element
  useEffect(() => {
    if (currentTheme === 'cyber' || currentTheme === 'aurora') {
      document.documentElement.classList.add('dark', 'theme-dark');
    } else {
      document.documentElement.classList.remove('dark', 'theme-dark');
    }
  }, [currentTheme]);

  // Load history from localStorage
  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('ip_mapper_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Show Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add search query to history log (keep max 10, no duplicate IPs)
  const logToHistory = (data: GeolocData) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.ip !== data.ip);
      const newItem: SearchHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        ip: data.ip,
        country: data.country,
        countryCode: data.countryCode,
        city: data.city,
        timestamp:
          new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }) +
          ' ' +
          new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
      };
      const updated = [newItem, ...filtered].slice(0, 10);
      localStorage.setItem('ip_mapper_history', JSON.stringify(updated));
      return updated;
    });
  };

  // Core IP Lookup execution handler
  const handleIpSearch = async (ip?: string, isAutoDetect = false) => {
    if (isAutoDetect) {
      setIsDetecting(true);
    } else {
      setIsSearching(true);
    }

    try {
      const result = await fetchIpData(ip);
      setIpData(result);
      logToHistory(result);

      if (isAutoDetect) {
        setUserIp(result.ip);
        showToast(`Auto-detected local connection: ${result.ip}`, 'success');
      } else {
        showToast(`Resolved IP coordinates for: ${result.ip}`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to geolocate target IP', 'error');

      // Fallback on initial trace fail
      if (!ipData) {
        setIpData(DEFAULT_FALLBACK);
        logToHistory(DEFAULT_FALLBACK);
        showToast('Mounted fallback nodes for initial visualization.', 'info');
      }
    } finally {
      setIsSearching(false);
      setIsDetecting(false);
    }
  };

  // Tracing current local connection on mount
  useEffect(() => {
    handleIpSearch(undefined, true);
  }, []);

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem('ip_mapper_history', JSON.stringify(updated));
      return updated;
    });
    showToast('Record removed from telemetry history.', 'info');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('ip_mapper_history');
    showToast('Telemetry history database cleared.', 'success');
  };

  const handleCopyIp = async () => {
    if (!ipData) return;
    try {
      await navigator.clipboard.writeText(ipData.ip);
      setIsCopied(true);
      showToast(`Copied ${ipData.ip} to clipboard`, 'success');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      showToast('Copy action blocked by security context.', 'error');
    }
  };

  const isDark = currentTheme === 'cyber' || currentTheme === 'aurora';
  const themeBgClass =
    currentTheme === 'cyber'
      ? 'bg-grid-cyber text-slate-100'
      : currentTheme === 'aurora'
      ? 'bg-grid-aurora text-slate-100'
      : 'bg-grid-titanium text-slate-900';

  return (
    <div className={`flex min-h-screen font-sans overflow-x-hidden antialiased transition-colors duration-300 ${themeBgClass}`}>
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userIp={userIp}
        onDetectMyIp={() => handleIpSearch(undefined, true)}
        isDetecting={isDetecting}
        onOpenExamModal={() => setIsExamModalOpen(true)}
      />

      {/* Main Console Workspace */}
      <div className="flex-grow flex flex-col min-w-0">
        <Header
          onSearch={(ip) => handleIpSearch(ip)}
          isSearching={isSearching}
          currentIp={ipData?.ip}
          timezone={ipData?.timezone}
          utcOffset={ipData?.utcOffset}
          currentTheme={currentTheme}
          onSelectTheme={handleSelectTheme}
          onOpenCompare={() => setIsCompareOpen(true)}
          onOpenExamModal={() => setIsExamModalOpen(true)}
          onToast={showToast}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-grow flex flex-col gap-6 max-w-7xl w-full mx-auto">
          {/* Main loader indicator */}
          {isSearching || !ipData ? (
            <div className="flex-grow flex flex-col items-center justify-center py-24 text-center">
              <div className="relative mb-6">
                <div className="w-14 h-14 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-sky-600 dark:border-t-cyan-500 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-sky-600 dark:text-cyan-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono tracking-widest uppercase">
                SCANNING NETWORK TOPOLOGY
              </h3>
              <p className="text-xs font-mono text-slate-500 mt-1">
                Resolving BGP Autonomous Systems & GeoIP anchors...
              </p>
            </div>
          ) : (
            <>
              {/* Quick Preset Node Switcher */}
              <QuickPresetsBar
                onSelectIp={(ip) => handleIpSearch(ip)}
                activeIp={ipData.ip}
              />

              {/* TAB 1: Unified Dashboard Overview */}
              {activeTab === 'dashboard' && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  {/* Cards Stats row */}
                  <IpLookupDetails data={ipData} />

                  {/* Core Visual Grid: Map vs Network Specs */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Leaflet map Container */}
                    <div className="lg:col-span-2 flex flex-col bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 h-full shadow-xs hover:border-sky-500/20 transition-colors">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                        <div className="flex items-center gap-2">
                          <Radio className="w-4 h-4 text-sky-600 dark:text-cyan-400 animate-pulse" />
                          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
                            Live Node Geolocation Map
                          </h2>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                          <span className="font-semibold">NODE RESOLVED</span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>
                      </div>
                      <div className="flex-grow min-h-[380px]">
                        <InteractiveMap
                          latitude={ipData.latitude}
                          longitude={ipData.longitude}
                          city={ipData.city}
                          country={ipData.country}
                          ip={ipData.ip}
                          isDark={isDark}
                        />
                      </div>
                    </div>

                    {/* Network footprint sidepanel */}
                    <div className="lg:col-span-1">
                      <NetworkInfo data={ipData} />
                    </div>
                  </div>

                  {/* Real-time Subnet CIDR & WHOIS Diagnostic Suite */}
                  <SubnetAndDnsInspector data={ipData} onToast={showToast} />

                  {/* Real-time Solar Horizon & Weather */}
                  <CityWeatherAndClock data={ipData} />

                  {/* Threat Analysis & Real-time Ping Latency + Export Tools */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <ThreatAndPingCard data={ipData} />
                    </div>
                    <div className="lg:col-span-1">
                      <ExportTools data={ipData} history={history} onToast={showToast} />
                    </div>
                  </div>

                  {/* History Logs & Analytics Summary row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <HistoryList
                      history={history}
                      onSelectIp={(ip) => handleIpSearch(ip)}
                      onDeleteHistory={deleteHistoryItem}
                      onClearHistory={clearHistory}
                    />
                    <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col shadow-xs hover:border-sky-500/20 transition-colors">
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <Terminal className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                        <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
                          GeoIP Telemetry Analytics
                        </h2>
                      </div>
                      <AnalyticsPanel history={history} isDark={isDark} />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Full IP Lookup & Subnet Deep-Dive */}
              {activeTab === 'lookup' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                        <div className="flex items-center gap-2">
                          <Radio className="w-4 h-4 text-sky-600 dark:text-cyan-400 animate-pulse" />
                          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
                            Focused Tracking Node Map
                          </h2>
                        </div>
                        <button
                          onClick={handleCopyIp}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-[10px] font-bold font-mono border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-xs"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'COPIED' : 'COPY TARGET IP'}</span>
                        </button>
                      </div>
                      <div className="min-h-[420px]">
                        <InteractiveMap
                          latitude={ipData.latitude}
                          longitude={ipData.longitude}
                          city={ipData.city}
                          country={ipData.country}
                          ip={ipData.ip}
                          isDark={isDark}
                        />
                      </div>
                    </div>
                    <SubnetAndDnsInspector data={ipData} onToast={showToast} />
                    <IpLookupDetails data={ipData} />
                  </div>
                  <div className="lg:col-span-1 flex flex-col gap-6">
                    <CityWeatherAndClock data={ipData} />
                    <NetworkInfo data={ipData} />
                  </div>
                </div>
              )}

              {/* TAB 3: Advanced Charts & Footprint Analytics */}
              {activeTab === 'analytics' && (
                <div className="flex flex-col gap-6 animate-fade-in">
                  <div className="bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                      <Terminal className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                      <div>
                        <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
                          Historical Footprint Analytics
                        </h2>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                          Statistical distributions aggregated from active local cache nodes
                        </p>
                      </div>
                    </div>
                    <AnalyticsPanel history={history} isDark={isDark} />
                  </div>
                </div>
              )}

              {/* TAB 4: Telemetry Search Logs */}
              {activeTab === 'history' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                  <div className="lg:col-span-2">
                    <HistoryList
                      history={history}
                      onSelectIp={(ip) => {
                        handleIpSearch(ip);
                        setActiveTab('dashboard');
                      }}
                      onDeleteHistory={deleteHistoryItem}
                      onClearHistory={clearHistory}
                    />
                  </div>
                  <div className="lg:col-span-1 bg-white/90 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                        <Terminal className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                        <h2 className="text-xs font-bold text-slate-800 dark:text-slate-100 tracking-wide uppercase">
                          Logs Manifest Info
                        </h2>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 font-sans space-y-4 leading-relaxed">
                        <p>
                          This terminal stores up to the last{' '}
                          <strong className="text-sky-700 dark:text-cyan-400">10 geolocation query transactions</strong>.
                        </p>
                        <p>
                          Clicking on any host record triggers immediate geolocation tracking, updating coordinates on the dashboard, maps, and footprint cards.
                        </p>
                        <p>
                          Telemetry remains offline and strictly private. Purging logs clears all local cache traces instantly.
                        </p>
                      </div>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 text-[9px] font-mono text-slate-500">
                      SESSION_MD5_HASH: F8A3B2C9..
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Dual IP Inspector Compare Modal */}
      {ipData && (
        <IpCompareModal
          currentData={ipData}
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          onToast={showToast}
        />
      )}

      {/* Academic Project Defense & Submission Summary Modal */}
      {ipData && (
        <ExamDefenseModal
          data={ipData}
          history={history}
          isOpen={isExamModalOpen}
          onClose={() => setIsExamModalOpen(false)}
        />
      )}

      {/* Floating toasts alert layer */}
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
