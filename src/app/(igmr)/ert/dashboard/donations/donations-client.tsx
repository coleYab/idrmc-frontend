'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  useCampaigns,
  useCreateCampaign
} from '@/features/donations/api/donations';
import { useDisasters } from '@/features/disasters/api/disasters';
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
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { IconHeart } from '@tabler/icons-react';

export default function DonationsClient() {
  const { data: campaignsData, isLoading: campaignsLoading } = useCampaigns();
  const { data: disastersData, isLoading: disastersLoading } = useDisasters({
    status: 'Active'
  });
  const createCampaign = useCreateCampaign();

  const campaigns = campaignsData?.items ?? [];
  const activeDisasters = disastersData?.items ?? [];

  const [selectedDisasterId, setSelectedDisasterId] = useState(
    activeDisasters[0]?.id ?? ''
  );
  const [goalAmount, setGoalAmount] = useState(25000);
  const [description, setDescription] = useState('');

  const isLoading = campaignsLoading || disastersLoading;

  const selectedDisaster = activeDisasters.find(
    (d) => d.id === selectedDisasterId
  );

  const handleCreateCampaign = async () => {
    if (!selectedDisasterId) {
      toast.error('Please select a disaster first.');
      return;
    }
    if (!description.trim()) {
      toast.error('Campaign description is required.');
      return;
    }
    if (goalAmount <= 0) {
      toast.error('Goal amount must be greater than zero.');
      return;
    }

    try {
      await createCampaign.mutateAsync({
        disasterID: selectedDisasterId,
        goalAmount,
        description: description.trim()
      });
      setDescription('');
      setGoalAmount(25000);
      toast.success('Donation campaign created.');
    } catch {
      toast.error('Failed to create donation campaign.');
    }
  };

  const statusVariant = (s: string) =>
    s === 'ACTIVE'
      ? 'default'
      : s === 'CLOSED'
        ? 'secondary'
        : s === 'DRAFT'
          ? 'outline'
          : 'destructive';

  return (
    <PageContainer
      scrollable={true}
      pageTitle='Donations'
      pageDescription='Track donation campaigns and view which ones have reached their recovery goal.'
    >
      <div className='grid gap-4 lg:grid-cols-[1fr_360px]'>
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Create Donation Campaign</CardTitle>
              <CardDescription>
                Start a new fundraising effort for disaster recovery.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label
                  htmlFor='disaster-select'
                  className='mb-2 block text-sm font-medium'
                >
                  Active Disaster
                </Label>
                <Select
                  value={selectedDisasterId}
                  onValueChange={(value) => setSelectedDisasterId(value)}
                >
                  <SelectTrigger id='disaster-select' className='w-full'>
                    <SelectValue placeholder='Select a disaster' />
                  </SelectTrigger>
                  <SelectContent>
                    {activeDisasters.map((disaster) => (
                      <SelectItem key={disaster.id} value={disaster.id}>
                        {disaster.title} — {disaster.incidentType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedDisaster && (
                  <p className='text-muted-foreground mt-1 text-xs'>
                    {selectedDisaster.location} · {selectedDisaster.severity}{' '}
                    severity
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor='campaign-desc'
                  className='mb-2 block text-sm font-medium'
                >
                  Description
                </Label>
                <Input
                  id='campaign-desc'
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder='Recovery fund description'
                />
              </div>
              <div>
                <Label
                  htmlFor='goal-amount'
                  className='mb-2 block text-sm font-medium'
                >
                  Goal Amount (ETB)
                </Label>
                <Input
                  id='goal-amount'
                  type='number'
                  value={goalAmount}
                  min={100}
                  onChange={(event) =>
                    setGoalAmount(Number(event.target.value))
                  }
                />
              </div>
              <Button onClick={handleCreateCampaign}>Create Campaign</Button>
            </CardContent>
          </Card>

          <div className='space-y-4'>
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className='h-5 w-48' />
                    <Skeleton className='h-4 w-32' />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className='h-4 w-full' />
                    <Skeleton className='mt-2 h-2 w-full' />
                  </CardContent>
                </Card>
              ))
            ) : campaigns.length === 0 ? (
              <div className='border-muted text-muted-foreground flex flex-col items-center gap-2 rounded-2xl border border-dashed p-12 text-center'>
                <IconHeart className='size-10 text-rose-500' />
                <p className='text-sm font-medium'>No donation campaigns yet</p>
                <p className='text-xs'>
                  Create a campaign above to start fundraising.
                </p>
              </div>
            ) : (
              campaigns.map((campaign) => {
                const percent = Math.min(
                  100,
                  Math.round(campaign.progressPercentage)
                );
                const achieved = campaign.currentAmount >= campaign.goalAmount;

                return (
                  <Card key={campaign.campaignID}>
                    <CardHeader>
                      <div className='flex items-start justify-between gap-3'>
                        <div>
                          <CardTitle>
                            {campaign.description.slice(0, 50)}
                          </CardTitle>
                          <CardDescription>
                            {campaign.currency} · {campaign.donationCount}{' '}
                            donations
                          </CardDescription>
                        </div>
                        <Badge variant={statusVariant(campaign.status)}>
                          {achieved ? 'Goal achieved' : campaign.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='grid gap-2'>
                        <div className='text-muted-foreground flex items-center justify-between gap-2 text-sm'>
                          <span>Raised</span>
                          <span>
                            {campaign.currentAmount.toLocaleString()} /{' '}
                            {campaign.goalAmount.toLocaleString()}{' '}
                            {campaign.currency}
                          </span>
                        </div>
                        <Progress value={percent} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Summary</CardTitle>
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
                        {campaigns.length} campaigns
                      </p>
                    </div>
                  </div>
                  <Badge>{campaigns.length}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
