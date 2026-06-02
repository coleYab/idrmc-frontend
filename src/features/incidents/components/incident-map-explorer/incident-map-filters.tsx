'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconFilter, IconX, IconMapPin } from '@tabler/icons-react';

export const INCIDENT_TYPE_OPTIONS = [
  { value: 'Flood', label: 'Flood' },
  { value: 'Drought', label: 'Drought' },
  { value: 'Landslide', label: 'Landslide' },
  { value: 'Locust', label: 'Locust' },
  { value: 'Conflict', label: 'Conflict' },
  { value: 'Fire', label: 'Fire' }
];

export const SEVERITY_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' }
];

export const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Verified', label: 'Verified' },
  { value: 'Active', label: 'Active' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Rejected', label: 'Rejected' }
];

export const REGION_OPTIONS = [
  { value: 'all', label: 'All Regions' },
  { value: 'amhara', label: 'Amhara' },
  { value: 'oromia', label: 'Oromia' },
  { value: 'tigray', label: 'Tigray' },
  { value: 'southern', label: 'SNNPR' },
  { value: 'somali', label: 'Somali' },
  { value: 'afar', label: 'Afar' },
  { value: 'addis', label: 'Addis Ababa' }
];

const filterChipBase =
  'cursor-pointer text-xs transition-all duration-150 select-none';

const severityDot: Record<string, string> = {
  Critical: 'bg-red-600',
  High: 'bg-orange-500',
  Medium: 'bg-yellow-500',
  Low: 'bg-green-500'
};

const regionPins: Record<string, string> = {
  amhara: 'bg-indigo-500',
  oromia: 'bg-emerald-600',
  tigray: 'bg-rose-600',
  southern: 'bg-teal-600',
  somali: 'bg-amber-600',
  afar: 'bg-orange-600',
  addis: 'bg-violet-600',
  other: 'bg-slate-500'
};

interface IncidentMapFiltersProps {
  selectedTypes: string[];
  selectedSeverities: string[];
  selectedStatuses: string[];
  selectedRegion: string;
  onToggleType: (value: string) => void;
  onToggleSeverity: (value: string) => void;
  onToggleStatus: (value: string) => void;
  onSelectRegion: (value: string) => void;
  onClearAll: () => void;
}

function FilterSection({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className='flex items-center gap-2'>
      <span className='text-muted-foreground w-20 shrink-0 text-[11px] font-semibold tracking-wider uppercase'>
        {label}
      </span>
      <div className='flex flex-wrap gap-1'>{children}</div>
    </div>
  );
}

export function IncidentMapFilters({
  selectedTypes,
  selectedSeverities,
  selectedStatuses,
  selectedRegion,
  onToggleType,
  onToggleSeverity,
  onToggleStatus,
  onSelectRegion,
  onClearAll
}: IncidentMapFiltersProps) {
  const hasActiveFilters =
    selectedTypes.length > 0 ||
    selectedSeverities.length > 0 ||
    selectedStatuses.length > 0;

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2'>
        <IconFilter className='text-muted-foreground h-4 w-4' />
        <span className='text-sm font-medium'>Filters</span>
        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='sm'
            className='text-muted-foreground hover:text-foreground ml-auto h-6 px-2 text-xs'
            onClick={onClearAll}
          >
            <IconX className='mr-1 h-3 w-3' />
            Clear all
          </Button>
        )}
      </div>

      <div className='divide-muted bg-card/50 divide-y rounded-lg border'>
        <div className='px-3 py-2.5'>
          <FilterSection label='Type'>
            {INCIDENT_TYPE_OPTIONS.map((opt) => {
              const isSelected = selectedTypes.includes(opt.value);
              return (
                <Badge
                  key={opt.value}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`${filterChipBase} ${
                    isSelected
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => onToggleType(opt.value)}
                >
                  {opt.label}
                </Badge>
              );
            })}
          </FilterSection>
        </div>

        <div className='px-3 py-2.5'>
          <FilterSection label='Severity'>
            {SEVERITY_OPTIONS.map((opt) => {
              const isSelected = selectedSeverities.includes(opt.value);
              return (
                <Badge
                  key={opt.value}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`${filterChipBase} ${
                    isSelected
                      ? `${severityDot[opt.value]} text-white hover:${severityDot[opt.value]}`
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => onToggleSeverity(opt.value)}
                >
                  <span
                    className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                      isSelected ? 'bg-white/70' : severityDot[opt.value]
                    }`}
                  />
                  {opt.label}
                </Badge>
              );
            })}
          </FilterSection>
        </div>

        <div className='px-3 py-2.5'>
          <FilterSection label='Status'>
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = selectedStatuses.includes(opt.value);
              return (
                <Badge
                  key={opt.value}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`${filterChipBase} ${
                    isSelected
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => onToggleStatus(opt.value)}
                >
                  {opt.label}
                </Badge>
              );
            })}
          </FilterSection>
        </div>

        <div className='px-3 py-2.5'>
          <FilterSection label='Zoom to'>
            <div className='flex flex-wrap gap-1'>
              {REGION_OPTIONS.map((opt) => {
                const isSelected = selectedRegion === opt.value;
                return (
                  <Badge
                    key={opt.value}
                    variant={isSelected ? 'default' : 'outline'}
                    className={`${filterChipBase} ${
                      isSelected
                        ? opt.value === 'all'
                          ? 'bg-primary text-primary-foreground'
                          : `${regionPins[opt.value] ?? 'bg-slate-500'} text-white`
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                    onClick={() => onSelectRegion(opt.value)}
                  >
                    {opt.value !== 'all' && (
                      <IconMapPin className='mr-1 h-3 w-3' />
                    )}
                    {opt.label}
                  </Badge>
                );
              })}
            </div>
          </FilterSection>
        </div>
      </div>
    </div>
  );
}
