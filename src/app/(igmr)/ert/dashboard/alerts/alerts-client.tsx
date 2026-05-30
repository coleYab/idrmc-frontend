'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { useDisasters } from '@/features/disasters/api/disasters';
import {
  useResources,
  useCreateResourceNeed
} from '@/features/ert/api/resources';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function AlertsClient() {
  const { data: disastersData, isLoading: disastersLoading } = useDisasters();
  const { data: resourcesData, isLoading: resourcesLoading } = useResources();
  const createNeed = useCreateResourceNeed();

  const disasters = disastersData ?? [];
  const resources = resourcesData?.items ?? [];

  const [selectedDisasterId, setSelectedDisasterId] = useState(
    disasters[0]?.id ?? ''
  );
  const [selectedResourceId, setSelectedResourceId] = useState(
    resources[0]?.id ?? ''
  );
  const [quantity, setQuantity] = useState(1);

  const selectedDisaster = disasters.find((d) => d.id === selectedDisasterId);

  const isLoading = disastersLoading || resourcesLoading;

  const handleCreateNeed = async () => {
    if (!selectedDisaster) {
      toast.error('Please select a disaster first.');
      return;
    }

    if (!selectedResourceId) {
      toast.error('Choose a resource to request.');
      return;
    }

    const amount = Number(quantity);
    if (amount <= 0) {
      toast.error('Quantity must be greater than zero.');
      return;
    }

    try {
      await createNeed.mutateAsync({
        resourceID: selectedResourceId,
        quantityRequired: amount,
        priority: 'high',
        incidentID: selectedDisaster.id
      });
      setQuantity(1);
      toast.success('Resource need created successfully.');
    } catch {
      toast.error('Failed to create resource need.');
    }
  };

  if (isLoading) {
    return (
      <PageContainer
        scrollable={true}
        pageTitle='ERT Alerts'
        pageDescription='View all disaster alerts declared by the disaster manager.'
      >
        <div className='grid gap-4 lg:grid-cols-[320px_1fr]'>
          <Skeleton className='h-80 w-full' />
          <Skeleton className='h-80 w-full' />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      scrollable={true}
      pageTitle='ERT Alerts'
      pageDescription='View all disaster alerts declared by the disaster manager and allocate resources to recovery operations.'
    >
      <div className='grid gap-4 lg:grid-cols-[320px_1fr]'>
        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Active Disasters</CardTitle>
              <CardDescription>
                Select a disaster to request resources.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {disasters.length === 0 ? (
                <div className='border-muted text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm'>
                  No active disasters at this time.
                </div>
              ) : (
                disasters.map((disaster) => (
                  <div
                    key={disaster.id}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      disaster.id === selectedDisasterId
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:border-primary/70'
                    }`}
                    onClick={() => setSelectedDisasterId(disaster.id)}
                  >
                    <div className='flex items-center justify-between gap-4'>
                      <div>
                        <h3 className='text-sm font-semibold'>
                          {disaster.title}
                        </h3>
                        <p className='text-muted-foreground text-xs'>
                          {disaster.location}
                        </p>
                      </div>
                      <Badge variant='secondary'>
                        {disaster.disasterType ?? disaster.incidentType}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disaster Context</CardTitle>
              <CardDescription>
                Quick view for the selected disaster.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {selectedDisaster ? (
                <>
                  <div className='space-y-2'>
                    <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                      <IconAlertTriangle className='size-4' />
                      <span>Active disaster information</span>
                    </div>
                    <p className='text-sm'>{selectedDisaster.description}</p>
                    <div className='grid gap-3 sm:grid-cols-2'>
                      <div>
                        <p className='text-muted-foreground text-xs tracking-[0.16em] uppercase'>
                          Location
                        </p>
                        <p className='text-sm'>{selectedDisaster.location}</p>
                      </div>
                      <div>
                        <p className='text-muted-foreground text-xs tracking-[0.16em] uppercase'>
                          Declared
                        </p>
                        <p className='text-sm'>
                          {selectedDisaster.createdAt
                            ? new Date(
                                selectedDisaster.createdAt
                              ).toLocaleString()
                            : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className='text-muted-foreground text-sm'>
                  Choose a disaster from the list to see details and request
                  resources.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Request Resources</CardTitle>
              <CardDescription>
                Create a resource need for the selected disaster.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid gap-3 sm:grid-cols-2'>
                <div>
                  <Label
                    htmlFor='resource-select'
                    className='mb-2 block text-sm font-medium'
                  >
                    Resource
                  </Label>
                  <Select
                    value={selectedResourceId}
                    onValueChange={(value) => setSelectedResourceId(value)}
                  >
                    <SelectTrigger id='resource-select' className='w-full'>
                      <SelectValue placeholder='Choose a resource' />
                    </SelectTrigger>
                    <SelectContent>
                      {resources.map((resource) => (
                        <SelectItem key={resource.id} value={resource.id}>
                          {resource.name} — {resource.quantity} available
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor='need-quantity'
                    className='mb-2 block text-sm font-medium'
                  >
                    Quantity
                  </Label>
                  <Input
                    id='need-quantity'
                    type='number'
                    min={1}
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(Number(event.target.value))
                    }
                  />
                </div>
              </div>
              <Button
                onClick={handleCreateNeed}
                disabled={!selectedDisaster || resources.length === 0}
              >
                Create Resource Need
              </Button>
            </CardContent>
            <CardFooter>
              <p className='text-muted-foreground text-sm'>
                Resource needs are sent to inventory for fulfillment.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
