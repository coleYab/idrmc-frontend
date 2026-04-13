import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export default function ErtHeader() {
  return (
    <header className='bg-background sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b px-4'>
      <SidebarTrigger className='-ml-1' />
      <Separator orientation='vertical' className='h-4' />
      <div>
        <p className='text-sm font-semibold'>Emergency Response Team Console</p>
        <p className='text-muted-foreground text-xs'>Operational Dashboard</p>
      </div>
    </header>
  );
}
