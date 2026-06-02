'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

export interface MapLocationData {
  latitude?: number | null | undefined;
  longitude?: number | null | undefined;
  location: string;
  affectedPopulationCount: number;
}

const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), {
  ssr: false
});
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), {
  ssr: false
});
const Circle = dynamic(() => import('react-leaflet').then((m) => m.Circle), {
  ssr: false
});

const defaultCenter: [number, number] = [9.0, 40.0];

function parseCoordinates(location: string): [number, number] | null {
  const parts = location.split(',').map((s) => s.trim());
  if (parts.length === 2) {
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    if (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    )
      return [lat, lng];
  }
  return null;
}

function getPosition(data: MapLocationData): [number, number] {
  if (data.latitude != null && data.longitude != null)
    return [data.latitude, data.longitude];
  const parsed = parseCoordinates(data.location);
  if (parsed) return parsed;
  return defaultCenter;
}

export function getAffectedRadius(data: MapLocationData): number {
  const pop = data.affectedPopulationCount;
  if (pop > 10000) return 15000;
  if (pop > 5000) return 10000;
  if (pop > 1000) return 5000;
  if (pop > 100) return 2000;
  return 1000;
}

function createPinIcon(leaflet: typeof import('leaflet')) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="38" viewBox="0 0 28 38">
    <defs>
      <filter id="s2" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
      </filter>
    </defs>
    <path d="M14 1C7.4 1 2 6.4 2 13c0 8.5 12 24 12 24s12-15.5 12-24c0-6.6-5.4-12-12-12z" fill="#dc2626" filter="url(#s2)"/>
    <circle cx="14" cy="13" r="6" fill="white"/>
    <circle cx="14" cy="13" r="4" fill="#dc2626"/>
  </svg>`;
  return leaflet.divIcon({
    className: 'custom-marker-icon',
    html: svg,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -38]
  });
}

interface IncidentLocationMapProps {
  data: MapLocationData;
  height?: number;
  showCircle?: boolean;
  zoom?: number;
}

export function IncidentLocationMap({
  data,
  height = 300,
  showCircle = true,
  zoom: customZoom
}: IncidentLocationMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [leafletModule, setLeafletModule] = useState<
    typeof import('leaflet') | null
  >(null);

  useEffect(() => {
    setIsMounted(true);
    import('leaflet').then((L) => setLeafletModule(L));
  }, []);

  const pos = getPosition(data);
  const radius = getAffectedRadius(data);
  const zoom = customZoom ?? 10;

  if (!isMounted || !leafletModule) {
    return (
      <div
        className='bg-muted flex animate-pulse items-center justify-center rounded-lg'
        style={{ height }}
      >
        <span className='text-muted-foreground text-xs'>Loading map...</span>
      </div>
    );
  }

  const icon = createPinIcon(leafletModule);

  return (
    <div
      className='relative w-full overflow-hidden rounded-lg border'
      style={{ height }}
    >
      <MapContainer
        center={pos}
        zoom={zoom}
        className='h-full w-full'
        scrollWheelZoom={false}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={pos} icon={icon}>
          <Popup>
            <div className='text-sm font-medium'>{data.location}</div>
          </Popup>
        </Marker>
        {showCircle && (
          <Circle
            center={pos}
            radius={radius}
            pathOptions={{
              color: '#dc2626',
              fillColor: '#dc2626',
              fillOpacity: 0.15,
              weight: 2,
              dashArray: '6 4'
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
