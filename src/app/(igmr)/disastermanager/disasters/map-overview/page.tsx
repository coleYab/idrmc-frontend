'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { IconMapPin, IconFilter, IconX } from '@tabler/icons-react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useDisasters } from '@/features/disasters/api/disasters';
import { DisasterMapPopupContent } from '@/features/disasters/components/disaster-map-overview/disaster-map-popup';

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

const TYPE_OPTIONS = [
  { value: 'Flood', label: 'Flood' },
  { value: 'Drought', label: 'Drought' },
  { value: 'Landslide', label: 'Landslide' },
  { value: 'Locust', label: 'Locust' },
  { value: 'Conflict', label: 'Conflict' },
  { value: 'Fire', label: 'Fire' }
];

const SEVERITY_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' }
];

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Active' },
  { value: 'Resolved', label: 'Resolved' }
];

const REGION_OPTIONS = [
  { value: 'all', label: 'All Regions' },
  { value: 'amhara', label: 'Amhara' },
  { value: 'oromia', label: 'Oromia' },
  { value: 'tigray', label: 'Tigray' },
  { value: 'southern', label: 'SNNPR' },
  { value: 'somali', label: 'Somali' },
  { value: 'afar', label: 'Afar' },
  { value: 'addis', label: 'Addis Ababa' }
];

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

const regionPins: Record<string, string> = {
  amhara: 'bg-indigo-500',
  oromia: 'bg-emerald-600',
  tigray: 'bg-rose-600',
  southern: 'bg-teal-600',
  somali: 'bg-amber-600',
  afar: 'bg-orange-600',
  addis: 'bg-violet-600'
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
    )
      return [lat, lng];
  }
  return null;
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

function getPosition(data: {
  latitude?: number | null;
  longitude?: number | null;
  location: string;
}): [number, number] {
  if (data.latitude != null && data.longitude != null)
    return [data.latitude, data.longitude];
  const parsed = parseCoordinates(data.location);
  if (parsed) return parsed;
  return defaultCenter;
}

const severityMarkerColors: Record<string, string> = {
  Critical: '#dc2626',
  High: '#ea580c',
  Medium: '#ca8a04',
  Low: '#16a34a'
};

const severityDot: Record<string, string> = {
  Critical: 'bg-red-600',
  High: 'bg-orange-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-500'
};

function createRedPinIcon(
  leaflet: typeof import('leaflet'),
  severityColor: string
) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
    <defs>
      <filter id="ds" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
      </filter>
    </defs>
    <path d="M16 2C9.4 2 4 7.4 4 14c0 9 12 26 12 26s12-17 12-26c0-6.6-5.4-12-12-12z" fill="#dc2626" filter="url(#ds)"/>
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

export default function DisastersMapOverviewPage() {
  const { data, isLoading } = useDisasters({ limit: 1000 });
  const disasters = data?.items ?? [];

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
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

  const filtered = useMemo(() => {
    return disasters.filter((d: any) => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(d.incidentType))
        return false;
      if (
        selectedSeverities.length > 0 &&
        !selectedSeverities.includes(d.severity)
      )
        return false;
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(d.status))
        return false;
      return true;
    });
  }, [disasters, selectedTypes, selectedSeverities, selectedStatuses]);

  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedSeverities.length > 0 ||
    selectedStatuses.length > 0;

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Disaster Map Overview'
      pageDescription='Geographic visualization of all active and resolved disasters.'
    >
      <Card className='p-4'>
        <div className='flex flex-col gap-4'>
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <IconFilter className='text-muted-foreground h-4 w-4' />
              <span className='text-sm font-medium'>Filters</span>
              {hasActiveFilters && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-muted-foreground hover:text-foreground ml-auto h-6 px-2 text-xs'
                  onClick={() => {
                    setSelectedTypes([]);
                    setSelectedSeverities([]);
                    setSelectedStatuses([]);
                  }}
                >
                  <IconX className='mr-1 h-3 w-3' />
                  Clear all
                </Button>
              )}
            </div>
            <div className='divide-muted bg-card/50 divide-y rounded-lg border'>
              <div className='flex items-center gap-2 px-3 py-2.5'>
                <span className='text-muted-foreground w-20 shrink-0 text-[11px] font-semibold tracking-wider uppercase'>
                  Type
                </span>
                <div className='flex flex-wrap gap-1'>
                  {TYPE_OPTIONS.map((opt) => (
                    <Badge
                      key={opt.value}
                      variant={
                        selectedTypes.includes(opt.value)
                          ? 'default'
                          : 'outline'
                      }
                      className={`cursor-pointer text-xs transition-all duration-150 select-none ${
                        selectedTypes.includes(opt.value)
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                      onClick={() =>
                        toggleFilter(opt.value, selectedTypes, setSelectedTypes)
                      }
                    >
                      {opt.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className='flex items-center gap-2 px-3 py-2.5'>
                <span className='text-muted-foreground w-20 shrink-0 text-[11px] font-semibold tracking-wider uppercase'>
                  Severity
                </span>
                <div className='flex flex-wrap gap-1'>
                  {SEVERITY_OPTIONS.map((opt) => (
                    <Badge
                      key={opt.value}
                      variant={
                        selectedSeverities.includes(opt.value)
                          ? 'default'
                          : 'outline'
                      }
                      className={`cursor-pointer text-xs transition-all duration-150 select-none ${
                        selectedSeverities.includes(opt.value)
                          ? `${severityDot[opt.value]} text-white`
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                      onClick={() =>
                        toggleFilter(
                          opt.value,
                          selectedSeverities,
                          setSelectedSeverities
                        )
                      }
                    >
                      <span
                        className={`mr-1.5 inline-block h-2 w-2 rounded-full ${selectedSeverities.includes(opt.value) ? 'bg-white/70' : severityDot[opt.value]}`}
                      />
                      {opt.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className='flex items-center gap-2 px-3 py-2.5'>
                <span className='text-muted-foreground w-20 shrink-0 text-[11px] font-semibold tracking-wider uppercase'>
                  Status
                </span>
                <div className='flex flex-wrap gap-1'>
                  {STATUS_OPTIONS.map((opt) => (
                    <Badge
                      key={opt.value}
                      variant={
                        selectedStatuses.includes(opt.value)
                          ? 'default'
                          : 'outline'
                      }
                      className={`cursor-pointer text-xs transition-all duration-150 select-none ${
                        selectedStatuses.includes(opt.value)
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                      onClick={() =>
                        toggleFilter(
                          opt.value,
                          selectedStatuses,
                          setSelectedStatuses
                        )
                      }
                    >
                      {opt.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className='flex items-center gap-2 px-3 py-2.5'>
                <span className='text-muted-foreground w-20 shrink-0 text-[11px] font-semibold tracking-wider uppercase'>
                  Zoom to
                </span>
                <div className='flex flex-wrap gap-1'>
                  {REGION_OPTIONS.map((opt) => (
                    <Badge
                      key={opt.value}
                      variant={
                        selectedRegion === opt.value ? 'default' : 'outline'
                      }
                      className={`cursor-pointer text-xs transition-all duration-150 select-none ${
                        selectedRegion === opt.value
                          ? opt.value === 'all'
                            ? 'bg-primary text-primary-foreground'
                            : `${regionPins[opt.value] ?? 'bg-slate-500'} text-white`
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                      onClick={() => setSelectedRegion(opt.value)}
                    >
                      {opt.value !== 'all' && (
                        <IconMapPin className='mr-1 h-3 w-3' />
                      )}
                      {opt.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='relative h-[600px] w-full overflow-hidden rounded-lg border'>
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
                {filtered.map((disaster: any) => {
                  const pos = getPosition(disaster);
                  const color =
                    severityMarkerColors[disaster.severity] ?? '#6b7280';
                  const icon = createRedPinIcon(leafletModule, color);
                  return (
                    <Marker key={disaster.id} position={pos} icon={icon}>
                      <Popup>
                        <DisasterMapPopupContent disaster={disaster} />
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
              {isLoading
                ? 'Loading disasters...'
                : `Showing ${filtered.length} of ${disasters.length} disasters${filtered.length !== disasters.length ? ' (filtered)' : ''}`}
            </span>
            <span className='flex items-center gap-1'>
              <IconMapPin className='h-3 w-3' /> Red pins &middot; colored dot =
              severity
            </span>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
