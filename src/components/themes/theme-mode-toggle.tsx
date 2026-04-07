'use client';

import { IconBrightness } from '@tabler/icons-react';
import { useThemeConfig } from './active-theme';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Kbd } from '@/components/ui/kbd';

export function ThemeModeToggle() {
  const { activeTheme, setActiveTheme } = useThemeConfig();

  const handleThemeToggle = React.useCallback(
    (e?: React.MouseEvent) => {
      const newMode = activeTheme === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;

      if (!document.startViewTransition) {
        setActiveTheme(newMode);
        return;
      }

      // Set coordinates from the click event
      if (e) {
        root.style.setProperty('--x', `${e.clientX}px`);
        root.style.setProperty('--y', `${e.clientY}px`);
      }

      document.startViewTransition(() => {
        setActiveTheme(newMode);
      });
    },
    [activeTheme, setActiveTheme]
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='secondary'
          size='icon'
          className='group/toggle size-8'
          onClick={handleThemeToggle}
        >
          <IconBrightness />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Toggle theme <Kbd>D D</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}
