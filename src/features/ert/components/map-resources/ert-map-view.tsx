'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { IconMapPin } from '@tabler/icons-react';
import type { ErtUnit } from '../../types';
import { ErtMapFilters } from './ert-map-filters';
import { ErtMapPopupContent } from './ert-map-popup';

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

const defaultCenter: [number, number] = [9.0, 40.0];
const defaultZoom = 6;

const regionViews: Record<string, { center: [number, number]; zoom: number }> =
  {
    amhara: { center: [11.5, 39.5], zoom: 8 },
    oromia: { center: [8.5, 38.5], zoom: 8 },
    tigray: { center: [13.5, 39.5], zoom: 9 },
    southern: { center: [6.5, 37.5], zoom: 8 },
    somali: { center: [7.5, 44.0], zoom: 8 },
    afar: { center: [12.5, 41.5], zoom: 9 },
    addis: { center: [9.0, 38.7], zoom: 12 }
  };

function getPosition(unit: ErtUnit): [number, number] {
  if (unit.location?.latitude != null && unit.location?.longitude != null)
    return [unit.location.latitude, unit.location.longitude];
  if (unit.region) {
    const key = unit.region.toLowerCase();
    for (const [rk, view] of Object.entries(regionViews)) {
      if (key.includes(rk)) return view.center;
    }
  }
  return defaultCenter;
}

function extractRegion(unit: ErtUnit): string {
  if (unit.region) {
    const lower = unit.region.toLowerCase();
    const known = [
      'amhara',
      'oromia',
      'tigray',
      'southern',
      'somali',
      'afar',
      'addis'
    ];
    for (const k of known) {
      if (lower.includes(k)) return k;
    }
  }
  return 'other';
}

const statusColors: Record<string, string> = {
  IDLE: '#16a34a',
  DEPLOYED: '#2563eb',
  MAINTENANCE: '#ca8a04'
};

function createPinIcon(leaflet: typeof import('leaflet'), dotColor: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
    <defs>
      <filter id="es" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
      </filter>
    </defs>
    <path d="M16 2C9.4 2 4 7.4 4 14c0 9 12 26 12 26s12-17 12-26c0-6.6-5.4-12-12-12z" fill="#dc2626" filter="url(#es)"/>
    <circle cx="16" cy="14" r="7" fill="white"/>
    <circle cx="16" cy="14" r="5" fill="${dotColor}"/>
  </svg>`;
  return leaflet.divIcon({
    className: 'custom-marker-icon',
    html: svg,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42]
  });
}

function MapControllerInner({
  mapRef,
  selectedRegion
}: {
  mapRef: React.MutableRefObject<any>;
  selectedRegion: string;
}) {
  const map =
    typeof window !== 'undefined' ? require('react-leaflet').useMap() : null;
  useEffect(() => {
    if (!map) return;
    mapRef.current = map;
  }, [map]);
  useEffect(() => {
    if (!map) return;
    if (selectedRegion !== 'all' && regionViews[selectedRegion]) {
      const { center, zoom } = regionViews[selectedRegion];
      map.flyTo(center, zoom, { duration: 1.2 });
    } else if (selectedRegion === 'all') {
      map.flyTo(defaultCenter, defaultZoom, { duration: 1.2 });
    }
  }, [selectedRegion, map]);
  return null;
}

interface ErtMapViewProps {
  units: ErtUnit[];
}

export function ErtMapView({ units }: ErtMapViewProps) {
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isMounted, setIsMounted] = useState(false);
  const [leafletModule, setLeafletModule] = useState<any>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    setIsMounted(true);
    import('leaflet').then((L) => setLeafletModule(L));
  }, []);

  const toggleFilter = (
    value: string,
    current: string[],
    setter: (v: string[]) => void
  ) => {
    setter(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
    );
  };

  const filteredUnits = useMemo(() => {
    return units.filter((u) => {
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(u.status))
        return false;
      return true;
    });
  }, [units, selectedStatuses]);

  return (
    <div className='flex flex-col gap-4'>
      <ErtMapFilters
        selectedStatuses={selectedStatuses}
        selectedRegion={selectedRegion}
        onToggleStatus={(v) =>
          toggleFilter(v, selectedStatuses, setSelectedStatuses)
        }
        onSelectRegion={(v) => setSelectedRegion(v)}
        onClearAll={() => {
          setSelectedStatuses([]);
        }}
      />

      <div className='relative h-[500px] w-full overflow-hidden rounded-lg border'>
        {isMounted && leafletModule ? (
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            className='h-full w-full'
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            />
            {filteredUnits.map((unit) => {
              const pos = getPosition(unit);
              const dotColor = statusColors[unit.status] ?? '#6b7280';
              const icon = createPinIcon(leafletModule, dotColor);
              return (
                <Marker key={unit.unitID} position={pos} icon={icon}>
                  <Popup>
                    <ErtMapPopupContent unit={unit} />
                  </Popup>
                </Marker>
              );
            })}
            <MapControllerInner
              mapRef={mapRef}
              selectedRegion={selectedRegion}
            />
          </MapContainer>
        ) : (
          <div className='text-muted-foreground flex h-full items-center justify-center'>
            Loading map...
          </div>
        )}
      </div>

      <div className='text-muted-foreground flex items-center justify-between text-xs'>
        <span>
          Showing {filteredUnits.length} of {units.length} ERT units
          {filteredUnits.length !== units.length ? ' (filtered)' : ''}
        </span>
        <div className='flex items-center gap-3'>
          <span className='flex items-center gap-1'>
            <IconMapPin className='h-3 w-3' /> Green=Idle &middot; Blue=Deployed
            &middot; Yellow=Maintenance
          </span>
        </div>
      </div>
    </div>
  );
}
