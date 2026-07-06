import { useEffect, useRef } from 'react';
import L from 'leaflet';

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  ip: string;
}

export default function InteractiveMap({ latitude, longitude, city, country, ip }: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 12,
        zoomControl: false,
      });

      // CartoDB Dark Matter layer is beautiful for cybersecurity dark aesthetics
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(mapRef.current);

      // Add a customized zoom control in the bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Pan and zoom smoothly to coordinates
    map.setView([latitude, longitude], 12);

    // Update or build marker
    if (markerRef.current) {
      markerRef.current.setLatLng([latitude, longitude]);
    } else {
      // Glow pulse custom divIcon avoids any asset loading issues and matches the cybersecurity dashboard theme
      const pulseIcon = L.divIcon({
        className: 'custom-pulse-marker',
        html: `
          <div class="relative flex items-center justify-center" style="width: 32px; height: 32px;">
            <span class="absolute inline-flex w-full h-full rounded-full bg-cyan-400 opacity-60 animate-ping" style="animation-duration: 2s;"></span>
            <span class="relative inline-flex rounded-full h-4.5 w-4.5 bg-cyan-400 border-2 border-slate-900 shadow-lg shadow-cyan-500/50"></span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      markerRef.current = L.marker([latitude, longitude], { icon: pulseIcon }).addTo(map);
    }

    // Define interactive popup with custom stylings
    markerRef.current.bindPopup(`
      <div style="color: #0f172a; font-family: sans-serif; padding: 4px; min-width: 160px;">
        <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #0ea5e9; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px;">
          🌐 Signal Node Anchor
        </h4>
        <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #475569;">
          <strong>Target IP:</strong> <code style="background-color: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-family: monospace; color: #0369a1;">${ip}</code><br/>
          <strong>Location:</strong> ${city}, ${country}<br/>
          <strong>Latitude:</strong> ${latitude.toFixed(5)}<br/>
          <strong>Longitude:</strong> ${longitude.toFixed(5)}
        </p>
      </div>
    `).openPopup();

    // ResizeObserver dynamically adjusts Map sizing (avoids rendering bugs)
    const container = mapContainerRef.current;
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [latitude, longitude, city, country, ip]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-800 shadow-[0_0_30px_rgba(34,211,238,0.02)]">
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px] z-10" />
      {/* Floating telemetry panel */}
      <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-md border border-cyan-500/20 px-3 py-1.5 rounded-lg z-20 text-[10px] font-mono text-cyan-400 flex items-center gap-3 select-none shadow-lg">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="tracking-wider">LAT: {latitude.toFixed(6)}</span>
        <span className="text-slate-700">|</span>
        <span className="tracking-wider">LNG: {longitude.toFixed(6)}</span>
      </div>
    </div>
  );
}
