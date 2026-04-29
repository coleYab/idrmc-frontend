import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

export function RecentIncidents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Incidents</CardTitle>
        <CardDescription>
          There were 24 new reports filed this week.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          <div className='flex items-center'>
            <Avatar className='h-9 w-9'>
              <AvatarImage src='/avatars/01.png' alt='Avatar' />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div className='ml-4 space-y-1'>
              <p className='text-sm leading-none font-medium'>
                Amanuel Mekonnen
              </p>
              <p className='text-muted-foreground text-sm'>Oromia Region</p>
            </div>
            <div className='ml-auto font-medium text-red-500'>Flood Alert</div>
          </div>
          <div className='flex items-center'>
            <Avatar className='flex h-9 w-9 items-center justify-center space-y-0 border'>
              <AvatarImage src='/avatars/02.png' alt='Avatar' />
              <AvatarFallback>BT</AvatarFallback>
            </Avatar>
            <div className='ml-4 space-y-1'>
              <p className='text-sm leading-none font-medium'>
                Betelhem Tadesse
              </p>
              <p className='text-muted-foreground text-sm'>Addis Ababa</p>
            </div>
            <div className='ml-auto font-medium text-orange-500'>
              Fire Spotted
            </div>
          </div>
          <div className='flex items-center'>
            <Avatar className='h-9 w-9'>
              <AvatarImage src='/avatars/03.png' alt='Avatar' />
              <AvatarFallback>DT</AvatarFallback>
            </Avatar>
            <div className='ml-4 space-y-1'>
              <p className='text-sm leading-none font-medium'>Dawit Tesfaye</p>
              <p className='text-muted-foreground text-sm'>Somali Region</p>
            </div>
            <div className='ml-auto font-medium text-yellow-500'>
              Drought Warning
            </div>
          </div>
          <div className='flex items-center'>
            <Avatar className='h-9 w-9'>
              <AvatarImage src='/avatars/04.png' alt='Avatar' />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div className='ml-4 space-y-1'>
              <p className='text-sm leading-none font-medium'>Sara Ahmed</p>
              <p className='text-muted-foreground text-sm'>Amhara Region</p>
            </div>
            <div className='ml-auto font-medium text-red-500'>
              Internal Conflict
            </div>
          </div>
          <div className='flex items-center'>
            <Avatar className='h-9 w-9'>
              <AvatarImage src='/avatars/05.png' alt='Avatar' />
              <AvatarFallback>YG</AvatarFallback>
            </Avatar>
            <div className='ml-4 space-y-1'>
              <p className='text-sm leading-none font-medium'>Yonas Gebre</p>
              <p className='text-muted-foreground text-sm'>Tigray Region</p>
            </div>
            <div className='ml-auto font-medium text-orange-500'>Landslide</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
