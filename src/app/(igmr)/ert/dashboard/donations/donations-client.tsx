'use client';

import { useMemo, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { useErtStore } from '@/features/ert/utils/store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { IconHeart } from '@tabler/icons-react';

export default function DonationsClient() {
  const alerts = useErtStore((state) => state.alerts);
  const donations = useErtStore((state) => state.donations);
  const addDonation = useErtStore((state) => state.addDonation);
  const contributeDonation = useErtStore((state) => state.contributeDonation);

  const [alertId, setAlertId] = useState(alerts[0]?.id ?? '');
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState(25000);
  const [giftAmount, setGiftAmount] = useState(1000);

  const donationWithAlerts = useMemo(
    () =>
      donations.map((donation) => ({
        donation,
        alert: alerts.find((alert) => alert.id === donation.alertId)
      })),
    [alerts, donations]
  );

  const handleCreateCampaign = () => {
    if (!alertId) {
      toast.error('Select an alert to tie the campaign to.');
      return;
    }
    if (!title.trim()) {
      toast.error('Donation title is required.');
      return;
    }
    if (goal <= 0) {
      toast.error('Donation goal must be greater than zero.');
      return;
    }

    addDonation(alertId, title.trim(), goal);
    setTitle('');
    setGoal(25000);
    toast.success('Donation campaign created.');
  };

  const handleContribute = (donationId: string) => {
    if (giftAmount <= 0) {
      toast.error('Contribution amount must be positive.');
      return;
    }
    contributeDonation(donationId, giftAmount);
    toast.success('Donation contribution added.');
  };

  return (
    <PageContainer
      scrollable={true}
      pageTitle='Donations'
      pageDescription='Track donations linked to specific alerts and view which campaigns have reached their recovery goal.'
    >
      <div className='grid gap-4 lg:grid-cols-[1fr_360px]'>
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Create Donation Campaign</CardTitle>
              <CardDescription>
                Start a new fundraising effort for an active alert.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label
                  htmlFor='alert-select'
                  className='mb-2 block text-sm font-medium'
                >
                  Alert
                </Label>
                <Select
                  value={alertId}
                  onValueChange={(value) => setAlertId(value)}
                >
                  <SelectTrigger id='alert-select' className='w-full'>
                    <SelectValue placeholder='Choose an alert' />
                  </SelectTrigger>
                  <SelectContent>
                    {alerts.map((alert) => (
                      <SelectItem key={alert.id} value={alert.id}>
                        {alert.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor='campaign-title'
                  className='mb-2 block text-sm font-medium'
                >
                  Campaign Title
                </Label>
                <Input
                  id='campaign-title'
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder='Recovery fund title'
                />
              </div>
              <div>
                <Label
                  htmlFor='goal-amount'
                  className='mb-2 block text-sm font-medium'
                >
                  Goal
                </Label>
                <Input
                  id='goal-amount'
                  type='number'
                  value={goal}
                  min={1000}
                  onChange={(event) => setGoal(Number(event.target.value))}
                />
              </div>
              <Button onClick={handleCreateCampaign}>Create Campaign</Button>
            </CardContent>
          </Card>

          <div className='space-y-4'>
            {donationWithAlerts.map(({ donation, alert }) => {
              const percent = Math.min(
                100,
                Math.round((donation.raised / donation.goal) * 100)
              );
              const achieved = donation.raised >= donation.goal;

              return (
                <Card key={donation.id}>
                  <CardHeader>
                    <div className='flex items-start justify-between gap-3'>
                      <div>
                        <CardTitle>{donation.title}</CardTitle>
                        <CardDescription>
                          {alert ? alert.title : 'Alert no longer active'}
                        </CardDescription>
                      </div>
                      <Badge variant={achieved ? 'default' : 'secondary'}>
                        {achieved ? 'Goal achieved' : `${percent}%`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='grid gap-2'>
                      <div className='text-muted-foreground flex items-center justify-between gap-2 text-sm'>
                        <span>Raised</span>
                        <span>
                          ${donation.raised.toLocaleString()} / $
                          {donation.goal.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={percent} />
                    </div>
                    <div className='grid gap-3 sm:grid-cols-3'>
                      <div>
                        <Label
                          htmlFor={`gift-${donation.id}`}
                          className='mb-2 block text-sm font-medium'
                        >
                          Contribution
                        </Label>
                        <Input
                          id={`gift-${donation.id}`}
                          type='number'
                          min={50}
                          value={giftAmount}
                          onChange={(event) =>
                            setGiftAmount(Number(event.target.value))
                          }
                        />
                      </div>
                      <div className='flex items-end sm:col-span-2'>
                        <Button
                          className='w-full'
                          disabled={achieved}
                          onClick={() => handleContribute(donation.id)}
                        >
                          Add Contribution
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Donation Summary</CardTitle>
            <CardDescription>
              Track active campaigns and recovery funding.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-3'>
              <div className='rounded-2xl border p-4'>
                <div className='flex items-center justify-between gap-3'>
                  <div className='flex items-center gap-2'>
                    <IconHeart className='size-5 text-rose-500' />
                    <div>
                      <p className='text-sm font-semibold'>Total campaigns</p>
                      <p className='text-muted-foreground text-xs'>
                        {donations.length} campaigns created
                      </p>
                    </div>
                  </div>
                  <Badge>{donations.length}</Badge>
                </div>
              </div>
              <div className='rounded-2xl border p-4'>
                <div className='flex items-center justify-between gap-3'>
                  <div>
                    <p className='text-sm font-semibold'>Trending goal</p>
                    <p className='text-muted-foreground text-xs'>
                      Keep donor momentum for recovery operations.
                    </p>
                  </div>
                  <Badge variant='secondary'>Priority</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
