import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import DashboardSwitcher from './dashboard-switcher';
import { ThemeModeToggle } from '@/components/themes/theme-mode-toggle';
import { ThemeSelector } from '@/components/themes/theme-selector';

export default function AdminHeader() {
  return (
    <header className='bg-background sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b px-4'>
      <SidebarTrigger className='-ml-1' />
      <Separator orientation='vertical' className='h-4' />
      <div>
        <p className='text-sm font-semibold'>Admin System Console</p>
        <p className='text-muted-foreground text-xs'>
          System Administration & Monitoring
        </p>
      </div>
      <div className='ml-auto flex items-center gap-2'>
        <ThemeSelector />
        <ThemeModeToggle />
        <DashboardSwitcher variant='header' />
      </div>
    </header>
  );
}
