import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  ip: string;
  isDark?: boolean;
}

export default function InteractiveMap({
  latitude,
  longitude,
  city,
  country,
  ip,
  isDark = false,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const tileUrl = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 12,
        zoomControl: false,
      });

      tileLayerRef.current = L.tileLayer(tileUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(mapRef.current);

      // Customized zoom control in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
    } else if (tileLayerRef.current) {
      tileLayerRef.current.setUrl(tileUrl);
    }

    const map = mapRef.current;

    // Pan and zoom smoothly to coordinates
    map.setView([latitude, longitude], 12);

    // Update or build marker
    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    } else {
      const pulseIcon = L.divIcon({
        className: 'custom-pulse-marker',
        html: `
          <div class="relative flex items-center justify-center" style="width: 32px; height: 32px;">
            <span class="absolute inline-flex w-full h-full rounded-full bg-sky-500 opacity-60 animate-ping" style="animation-duration: 2s;"></span>
            <span class="relative inline-flex rounded-full h-4.5 w-4.5 bg-sky-600 border-2 border-white shadow-lg shadow-sky-500/50"></span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      markerRef.current = L.marker([latitude, longitude], { icon: pulseIcon }).addTo(map);
    }

    // Define interactive popup with crisp stylings
    markerRef.current
      .bindPopup(
        `
      <div style="color: #0f172a; font-family: sans-serif; padding: 4px; min-width: 170px;">
        <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #0284c7; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
          🌐 Signal Node Anchor
        </h4>
        <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #334155;">
          <strong>Target IP:</strong> <code style="background-color: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-family: monospace; color: #0284c7; font-weight: 700;">${ip}</code><br/>
          <strong>Location:</strong> ${city}, ${country}<br/>
          <strong>Coordinates:</strong> ${latitude.toFixed(4)}, ${longitude.toFixed(4)}
        </p>
      </div>
    `
      )
      .openPopup();

    const container = mapContainerRef.current;
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [latitude, longitude, city, country, ip, isDark]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px] z-10" />
      {/* Floating telemetry HUD panel */}
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border border-slate-200 dark:border-cyan-500/30 px-3 py-1.5 rounded-xl z-20 text-[10px] font-mono text-sky-700 dark:text-cyan-400 flex items-center gap-2.5 select-none shadow-md">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 dark:bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600 dark:bg-cyan-500"></span>
        </span>
        <span className="font-bold tracking-wider">LAT: {latitude.toFixed(5)}</span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <span className="font-bold tracking-wider">LNG: {longitude.toFixed(5)}</span>
      </div>
    </div>
  );
}
