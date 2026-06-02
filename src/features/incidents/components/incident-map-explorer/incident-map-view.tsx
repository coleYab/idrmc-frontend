'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { IconMapPin } from '@tabler/icons-react';
import type { Incident } from '../../types';
import { IncidentMapFilters } from './incident-map-filters';
import { IncidentMapPopupContent } from './incident-map-popup';

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
    ) {
      return [lat, lng];
    }
  }
  return null;
}

function getPosition(incident: Incident): [number, number] {
  if (incident.latitude != null && incident.longitude != null) {
    return [incident.latitude, incident.longitude];
  }
  const parsed = parseCoordinates(incident.location);
  if (parsed) return parsed;
  return defaultCenter;
}

function extractRegion(location: string): string {
  const locLower = location.toLowerCase();
  const known = [
    'amhara',
    'oromia',
    'tigray',
    'southern',
    'somali',
    'afar',
    'addis'
  ];
  for (const key of known) {
    if (locLower.includes(key)) return key;
  }
  return 'other';
}

function createRedPinIcon(
  leaflet: typeof import('leaflet'),
  severityColor: string
) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
    <defs>
      <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
      </filter>
    </defs>
    <path d="M16 2C9.4 2 4 7.4 4 14c0 9 12 26 12 26s12-17 12-26c0-6.6-5.4-12-12-12z" fill="#dc2626" filter="url(#s)"/>
    <circle cx="16" cy="14" r="7" fill="white"/>
    <circle cx="16" cy="14" r="5" fill="${severityColor}"/>
  </svg>`;

  return leaflet.divIcon({
    className: 'custom-marker-icon',
    html: svg,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42]
  });
}

const severityColors: Record<string, string> = {
  Critical: '#dc2626',
  High: '#ea580c',
  Medium: '#ca8a04',
  Low: '#16a34a'
};

interface MapMarkersProps {
  incidents: Incident[];
  leaflet: typeof import('leaflet');
}

function MapMarkers({ incidents, leaflet }: MapMarkersProps) {
  return (
    <>
      {incidents.map((incident) => {
        const pos = getPosition(incident);
        const severityColor = severityColors[incident.severity] ?? '#6b7280';
        const icon = createRedPinIcon(leaflet, severityColor);

        return (
          <Marker key={incident.id} position={pos} icon={icon}>
            <Popup>
              <IncidentMapPopupContent incident={incident} />
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

interface MapControllerInnerProps {
  mapRef: React.MutableRefObject<ReturnType<
    typeof import('react-leaflet').useMap
  > | null>;
  selectedRegion: string;
}

function MapControllerInner({
  mapRef,
  selectedRegion
}: MapControllerInnerProps) {
  const map = (
    typeof window !== 'undefined' ? require('react-leaflet').useMap() : null
  ) as ReturnType<typeof import('react-leaflet').useMap> | null;

  useEffect(() => {
    if (!map) return;
    mapRef.current = map;
  }, [map, mapRef]);

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

interface IncidentMapViewProps {
  incidents: Incident[];
}

export function IncidentMapView({ incidents }: IncidentMapViewProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [isMounted, setIsMounted] = useState(false);
  const [leafletModule, setLeafletModule] = useState<
    typeof import('leaflet') | null
  >(null);
  const mapRef = useRef<ReturnType<
    typeof import('react-leaflet').useMap
  > | null>(null);

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

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(inc.incidentType))
        return false;
      if (
        selectedSeverities.length > 0 &&
        !selectedSeverities.includes(inc.severity)
      )
        return false;
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(inc.status))
        return false;
      return true;
    });
  }, [incidents, selectedTypes, selectedSeverities, selectedStatuses]);

  return (
    <div className='flex flex-col gap-4'>
      <IncidentMapFilters
        selectedTypes={selectedTypes}
        selectedSeverities={selectedSeverities}
        selectedStatuses={selectedStatuses}
        selectedRegion={selectedRegion}
        onToggleType={(v) => toggleFilter(v, selectedTypes, setSelectedTypes)}
        onToggleSeverity={(v) =>
          toggleFilter(v, selectedSeverities, setSelectedSeverities)
        }
        onToggleStatus={(v) =>
          toggleFilter(v, selectedStatuses, setSelectedStatuses)
        }
        onSelectRegion={(v) => setSelectedRegion(v)}
        onClearAll={() => {
          setSelectedTypes([]);
          setSelectedSeverities([]);
          setSelectedStatuses([]);
        }}
      />

      <div className='relative h-[600px] w-full overflow-hidden rounded-lg border'>
        {isMounted && leafletModule && (
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
            <MapMarkers incidents={filteredIncidents} leaflet={leafletModule} />
            <MapControllerInner
              mapRef={mapRef}
              selectedRegion={selectedRegion}
            />
          </MapContainer>
        )}
        {isMounted && !leafletModule && (
          <div className='text-muted-foreground flex h-full items-center justify-center'>
            Loading map...
          </div>
        )}
      </div>

      <div className='text-muted-foreground flex items-center justify-between text-xs'>
        <span>
          Showing {filteredIncidents.length} of {incidents.length} incidents
          {filteredIncidents.length !== incidents.length ? ' (filtered)' : ''}
        </span>
        <div className='flex items-center gap-3'>
          <span className='flex items-center gap-1'>
            <IconMapPin className='h-3 w-3' /> Red pins · colored dot = severity
          </span>
        </div>
      </div>
    </div>
  );
}
