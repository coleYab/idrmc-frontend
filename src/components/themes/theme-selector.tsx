'use client';

import { useThemeConfig } from './active-theme';
import { THEMES } from './theme.config';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { IconPalette } from '@tabler/icons-react';

export function ThemeSelector() {
  const { activeTheme, setActiveTheme } = useThemeConfig();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='secondary' size='icon' className='size-8'>
          <IconPalette className='h-4 w-4' />
          <span className='sr-only'>Select theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        {THEMES.map((theme) => (
          <DropdownMenuItem
            key={theme.value}
            onClick={() => setActiveTheme(theme.value)}
            className='flex items-center justify-between'
          >
            <span>{theme.name}</span>
            {activeTheme === theme.value && (
              <div className='bg-primary h-2 w-2 rounded-full' />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
