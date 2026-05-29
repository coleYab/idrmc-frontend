import { create } from 'zustand';

export type ErtAlertStatus = 'unread' | 'acknowledged' | 'resolved';

export type ErtAlert = {
  id: string;
  title: string;
  body: string;
  status: ErtAlertStatus;
  location: string;
  createdAt: string;
};

export type ErtResource = {
  id: string;
  name: string;
  description: string;
  unit: string;
  available: number;
};

export type ErtAllocation = {
  id: string;
  alertId: string;
  resourceId: string;
  quantity: number;
};

export type ErtDonation = {
  id: string;
  alertId: string;
  title: string;
  raised: number;
  goal: number;
  createdAt: string;
};

type ErtState = {
  alerts: ErtAlert[];
  resources: ErtResource[];
  allocations: ErtAllocation[];
  donations: ErtDonation[];
  allocateResource: (
    alertId: string,
    resourceId: string,
    quantity: number
  ) => void;
  removeAlert: (alertId: string) => void;
  addDonation: (alertId: string, title: string, goal: number) => void;
  contributeDonation: (donationId: string, amount: number) => void;
};

const initialAlerts: ErtAlert[] = [
  {
    id: 'alert-001',
    title: 'River flood warning',
    body: 'A fast-moving flood is impacting the East Bridge corridor. Evacuations and shelter support are required immediately.',
    status: 'unread',
    location: 'East Bridge District',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'alert-002',
    title: 'Highway fire containment',
    body: 'Multi-vehicle fire on the northern highway is threatening nearby communities. Resource support is required for wildfire containment.',
    status: 'unread',
    location: 'North Highway Corridor',
    createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString()
  },
  {
    id: 'alert-003',
    title: 'Coastal storm recovery',
    body: 'A coastal storm has damaged local infrastructure and supply chains. Recovery support and donations are needed for displaced families.',
    status: 'unread',
    location: 'Coastal Recovery Zone',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  }
];

const initialResources: ErtResource[] = [
  {
    id: 'resource-001',
    name: 'Food Packs',
    description: 'Non-perishable meal kits for families and emergency crews.',
    unit: 'boxes',
    available: 520
  },
  {
    id: 'resource-002',
    name: 'Water Trucks',
    description:
      'Mobile water supply trucks for distribution and decontamination.',
    unit: 'vehicles',
    available: 18
  },
  {
    id: 'resource-003',
    name: 'Medical Kits',
    description: 'First aid and trauma care packs for field medics.',
    unit: 'kits',
    available: 190
  },
  {
    id: 'resource-004',
    name: 'Rescue Vehicles',
    description: 'All-terrain response vehicles for urgent rescue missions.',
    unit: 'vehicles',
    available: 14
  },
  {
    id: 'resource-005',
    name: 'Volunteers',
    description:
      'Trained volunteers available for logistics, shelter, and distribution.',
    unit: 'people',
    available: 340
  }
];

const initialDonations: ErtDonation[] = [
  {
    id: 'donation-001',
    alertId: 'alert-002',
    title: 'Highway Fire Recovery Fund',
    raised: 15000,
    goal: 30000,
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
  {
    id: 'donation-002',
    alertId: 'alert-003',
    title: 'Coastal Storm Relief Drive',
    raised: 45000,
    goal: 45000,
    createdAt: new Date(Date.now() - 1000 * 60 * 150).toISOString()
  }
];

export const useErtStore = create<ErtState>((set) => ({
  alerts: initialAlerts,
  resources: initialResources,
  allocations: [],
  donations: initialDonations,

  allocateResource: (alertId, resourceId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return state;
      }

      const resource = state.resources.find((item) => item.id === resourceId);
      if (!resource || resource.available < quantity) {
        return state;
      }

      const allocationIndex = state.allocations.findIndex(
        (allocation) =>
          allocation.alertId === alertId && allocation.resourceId === resourceId
      );

      const updatedAllocations =
        allocationIndex >= 0
          ? state.allocations.map((allocation, index) =>
              index === allocationIndex
                ? { ...allocation, quantity: allocation.quantity + quantity }
                : allocation
            )
          : [
              ...state.allocations,
              {
                id: `alloc-${Date.now()}-${resourceId}`,
                alertId,
                resourceId,
                quantity
              }
            ];

      return {
        resources: state.resources.map((item) =>
          item.id === resourceId
            ? { ...item, available: item.available - quantity }
            : item
        ),
        allocations: updatedAllocations
      };
    }),

  removeAlert: (alertId) =>
    set((state) => {
      const allocationsToRelease = state.allocations.filter(
        (allocation) => allocation.alertId === alertId
      );

      const resourceRestores = allocationsToRelease.reduce<
        Record<string, number>
      >((acc, allocation) => {
        acc[allocation.resourceId] =
          (acc[allocation.resourceId] ?? 0) + allocation.quantity;
        return acc;
      }, {});

      return {
        alerts: state.alerts.filter((alert) => alert.id !== alertId),
        resources: state.resources.map((resource) => ({
          ...resource,
          available: resource.available + (resourceRestores[resource.id] ?? 0)
        })),
        allocations: state.allocations.filter(
          (allocation) => allocation.alertId !== alertId
        )
      };
    }),

  addDonation: (alertId, title, goal) =>
    set((state) => ({
      donations: [
        {
          id: `donation-${Date.now()}`,
          alertId,
          title,
          raised: 0,
          goal,
          createdAt: new Date().toISOString()
        },
        ...state.donations
      ]
    })),

  contributeDonation: (donationId, amount) =>
    set((state) => ({
      donations: state.donations.map((donation) =>
        donation.id === donationId
          ? {
              ...donation,
              raised: Math.min(
                donation.goal,
                donation.raised + Math.max(0, amount)
              )
            }
          : donation
      )
    }))
}));
