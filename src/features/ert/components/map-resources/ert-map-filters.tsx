'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IconFilter, IconX, IconMapPin } from '@tabler/icons-react';

export const UNIT_STATUS_OPTIONS = [
  { value: 'IDLE', label: 'Idle' },
  { value: 'DEPLOYED', label: 'Deployed' },
  { value: 'MAINTENANCE', label: 'Maintenance' }
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

const regionPins: Record<string, string> = {
  amhara: 'bg-indigo-500',
  oromia: 'bg-emerald-600',
  tigray: 'bg-rose-600',
  southern: 'bg-teal-600',
  somali: 'bg-amber-600',
  afar: 'bg-orange-600',
  addis: 'bg-violet-600'
};

const statusDot: Record<string, string> = {
  IDLE: 'bg-green-500',
  DEPLOYED: 'bg-blue-500',
  MAINTENANCE: 'bg-yellow-500'
};

interface ErtMapFiltersProps {
  selectedStatuses: string[];
  selectedRegion: string;
  onToggleStatus: (value: string) => void;
  onSelectRegion: (value: string) => void;
  onClearAll: () => void;
}

export function ErtMapFilters({
  selectedStatuses,
  selectedRegion,
  onToggleStatus,
  onSelectRegion,
  onClearAll
}: ErtMapFiltersProps) {
  const hasActiveFilters = selectedStatuses.length > 0;

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
        <div className='flex items-center gap-2 px-3 py-2.5'>
          <span className='text-muted-foreground w-20 shrink-0 text-[11px] font-semibold tracking-wider uppercase'>
            Unit Status
          </span>
          <div className='flex flex-wrap gap-1'>
            {UNIT_STATUS_OPTIONS.map((opt) => {
              const isSelected = selectedStatuses.includes(opt.value);
              return (
                <Badge
                  key={opt.value}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer text-xs transition-all duration-150 select-none ${
                    isSelected
                      ? `${statusDot[opt.value].replace('bg-', 'bg-')} text-white`
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => onToggleStatus(opt.value)}
                >
                  <span
                    className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                      isSelected ? 'bg-white/70' : statusDot[opt.value]
                    }`}
                  />
                  {opt.label}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className='flex items-center gap-2 px-3 py-2.5'>
          <span className='text-muted-foreground w-20 shrink-0 text-[11px] font-semibold tracking-wider uppercase'>
            Zoom to
          </span>
          <div className='flex flex-wrap gap-1'>
            {REGION_OPTIONS.map((opt) => {
              const isSelected = selectedRegion === opt.value;
              return (
                <Badge
                  key={opt.value}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer text-xs transition-all duration-150 select-none ${
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
        </div>
      </div>
    </div>
  );
}
