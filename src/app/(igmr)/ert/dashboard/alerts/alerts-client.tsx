'use client';

import { useMemo, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { useErtStore } from '@/features/ert/utils/store';
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
import { toast } from 'sonner';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function AlertsClient() {
  const alerts = useErtStore((state) => state.alerts);
  const resources = useErtStore((state) => state.resources);
  const allocations = useErtStore((state) => state.allocations);
  const allocateResource = useErtStore((state) => state.allocateResource);
  const removeAlert = useErtStore((state) => state.removeAlert);

  const [selectedAlertId, setSelectedAlertId] = useState(alerts[0]?.id ?? '');
  const [selectedResourceId, setSelectedResourceId] = useState(
    resources[0]?.id ?? ''
  );
  const [quantity, setQuantity] = useState(1);

  const selectedAlert = alerts.find((alert) => alert.id === selectedAlertId);

  const alertAllocations = useMemo(
    () =>
      allocations
        .filter((allocation) => allocation.alertId === selectedAlertId)
        .map((allocation) => ({
          ...allocation,
          resource: resources.find(
            (resource) => resource.id === allocation.resourceId
          )
        })),
    [allocations, resources, selectedAlertId]
  );

  const handleAllocate = () => {
    if (!selectedAlert) {
      toast.error('Please select an alert first.');
      return;
    }

    if (!selectedResourceId) {
      toast.error('Choose a resource to allocate.');
      return;
    }

    const amount = Number(quantity);
    if (amount <= 0) {
      toast.error('Quantity must be greater than zero.');
      return;
    }

    const resource = resources.find((item) => item.id === selectedResourceId);
    if (!resource || amount > resource.available) {
      toast.error('There is not enough inventory to allocate that amount.');
      return;
    }

    allocateResource(selectedAlert.id, selectedResourceId, amount);
    setQuantity(1);
    toast.success(
      `Allocated ${amount} ${resource.unit} of ${resource.name} to ${selectedAlert.title}.`
    );
  };

  const handleDismiss = () => {
    if (!selectedAlert) {
      return;
    }

    removeAlert(selectedAlert.id);
    toast.success('Dismissed alert and returned allocated resources.');
    const nextAlert = alerts.find((alert) => alert.id !== selectedAlert.id);
    setSelectedAlertId(nextAlert?.id ?? '');
  };

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
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>
                Select an alert to allocate resources.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {alerts.length === 0 ? (
                <div className='border-muted text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm'>
                  No disaster alerts are currently active.
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`cursor-pointer rounded-2xl border p-4 transition ${
                      alert.id === selectedAlertId
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-background hover:border-primary/70'
                    }`}
                    onClick={() => setSelectedAlertId(alert.id)}
                  >
                    <div className='flex items-center justify-between gap-4'>
                      <div>
                        <h3 className='text-sm font-semibold'>{alert.title}</h3>
                        <p className='text-muted-foreground text-xs'>
                          {alert.location}
                        </p>
                      </div>
                      <Badge variant='secondary'>{alert.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Context</CardTitle>
              <CardDescription>
                Quick view for the selected alert.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {selectedAlert ? (
                <>
                  <div className='space-y-2'>
                    <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                      <IconAlertTriangle className='size-4' />
                      <span>Active alert information</span>
                    </div>
                    <p className='text-sm'>{selectedAlert.body}</p>
                    <div className='grid gap-3 sm:grid-cols-2'>
                      <div>
                        <p className='text-muted-foreground text-xs tracking-[0.16em] uppercase'>
                          Location
                        </p>
                        <p className='text-sm'>{selectedAlert.location}</p>
                      </div>
                      <div>
                        <p className='text-muted-foreground text-xs tracking-[0.16em] uppercase'>
                          Raised
                        </p>
                        <p className='text-sm'>
                          {new Date(selectedAlert.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button variant='destructive' onClick={handleDismiss}>
                    Dismiss Alert and Release Resources
                  </Button>
                </>
              ) : (
                <div className='text-muted-foreground text-sm'>
                  Choose an alert from the list to see details and attach
                  resources.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Allocate Resources</CardTitle>
              <CardDescription>
                Assign inventory to the selected disaster alert.
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
                          {resource.name} — {resource.available} {resource.unit}{' '}
                          available
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor='allocation-quantity'
                    className='mb-2 block text-sm font-medium'
                  >
                    Quantity
                  </Label>
                  <Input
                    id='allocation-quantity'
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
                onClick={handleAllocate}
                disabled={!selectedAlert || resources.length === 0}
              >
                Allocate Resource
              </Button>
            </CardContent>
            <CardFooter>
              <p className='text-muted-foreground text-sm'>
                Resources are deducted from inventory when assigned to an alert.
              </p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Allocated Resources</CardTitle>
              <CardDescription>
                Resources currently assigned to this alert.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-3'>
              {selectedAlert && alertAllocations.length > 0 ? (
                alertAllocations.map(({ resource, quantity }) => (
                  <div
                    key={resource?.id ?? quantity}
                    className='rounded-2xl border p-4'
                  >
                    <div className='flex items-center justify-between gap-3'>
                      <div>
                        <h3 className='text-sm font-semibold'>
                          {resource?.name ?? 'Unknown resource'}
                        </h3>
                        <p className='text-muted-foreground text-xs'>
                          {resource?.description}
                        </p>
                      </div>
                      <Badge>{quantity} assigned</Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-muted-foreground text-sm'>
                  No resources are assigned to this alert yet.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
