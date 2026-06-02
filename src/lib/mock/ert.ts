import type { ErtUnit } from '@/features/ert/types';

export const mockErtUnits: ErtUnit[] = [
  {
    unitID: '20000000-0000-0000-0000-000000000001',
    name: 'Alpha Response Team',
    status: 'DEPLOYED',
    region: 'Addis Ababa',
    location: { latitude: 9.032, longitude: 38.746 },
    createdAt: '2026-05-28T06:00:00.000Z',
    updatedAt: '2026-06-01T14:00:00.000Z'
  },
  {
    unitID: '20000000-0000-0000-0000-000000000002',
    name: 'Bravo Medical Unit',
    status: 'DEPLOYED',
    region: 'Addis Ababa',
    location: { latitude: 9.008, longitude: 38.761 },
    createdAt: '2026-05-30T08:00:00.000Z',
    updatedAt: '2026-06-02T09:00:00.000Z'
  },
  {
    unitID: '20000000-0000-0000-0000-000000000003',
    name: 'Charlie SAR Team',
    status: 'IDLE',
    region: 'Dire Dawa',
    location: { latitude: 9.593, longitude: 41.866 },
    createdAt: '2026-04-15T10:00:00.000Z',
    updatedAt: '2026-06-01T12:00:00.000Z'
  },
  {
    unitID: '20000000-0000-0000-0000-000000000004',
    name: 'Delta Logistics Unit',
    status: 'IDLE',
    region: 'Bahir Dar',
    location: { latitude: 11.585, longitude: 37.391 },
    createdAt: '2026-03-20T07:00:00.000Z',
    updatedAt: '2026-06-02T06:00:00.000Z'
  },
  {
    unitID: '20000000-0000-0000-0000-000000000005',
    name: 'Eagle Rapid Response',
    status: 'DEPLOYED',
    region: 'Tigray',
    location: { latitude: 13.497, longitude: 39.468 },
    createdAt: '2026-05-25T16:00:00.000Z',
    updatedAt: '2026-06-02T10:00:00.000Z'
  },
  {
    unitID: '20000001-0000-0000-0000-000000000001',
    name: 'Foxtrot WASH Team',
    status: 'DEPLOYED',
    region: 'Jimma',
    location: { latitude: 7.674, longitude: 36.834 },
    createdAt: '2026-06-01T11:00:00.000Z',
    updatedAt: '2026-06-02T08:00:00.000Z'
  },
  {
    unitID: '20000001-0000-0000-0000-000000000002',
    name: 'Golf Food Distribution',
    status: 'DEPLOYED',
    region: 'Jijiga',
    location: { latitude: 9.35, longitude: 42.796 },
    createdAt: '2026-05-29T09:00:00.000Z',
    updatedAt: '2026-06-02T07:00:00.000Z'
  },
  {
    unitID: '20000001-0000-0000-0000-000000000003',
    name: 'Hotel Medical Support',
    status: 'DEPLOYED',
    region: 'Gondar',
    location: { latitude: 12.607, longitude: 37.451 },
    createdAt: '2026-06-01T15:00:00.000Z',
    updatedAt: '2026-06-02T11:00:00.000Z'
  }
];

export const mockErtResources = [
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    name: 'Emergency Food Rations',
    category: 'Food',
    quantity: 10000
  },
  {
    id: 'e0000000-0000-0000-0000-000000000002',
    name: 'Clean Water Bottles',
    category: 'Water',
    quantity: 50000
  },
  {
    id: 'e0000000-0000-0000-0000-000000000003',
    name: 'Medical First Aid Kits',
    category: 'Medical',
    quantity: 2000
  },
  {
    id: 'e0000000-0000-0000-0000-000000000004',
    name: 'Tents (Family Size)',
    category: 'Shelter',
    quantity: 1500
  },
  {
    id: 'e0000000-0000-0000-0000-000000000005',
    name: 'Blankets',
    category: 'Shelter',
    quantity: 8000
  },
  {
    id: 'e0000000-0000-0000-0000-000000000006',
    name: 'Portable Generators',
    category: 'Equipment',
    quantity: 200
  },
  {
    id: 'e0000000-0000-0000-0000-000000000007',
    name: 'Satellite Phones',
    category: 'Communication',
    quantity: 100
  },
  {
    id: 'e0000000-0000-0000-0000-000000000008',
    name: 'Water Purification Tablets',
    category: 'Water',
    quantity: 100000
  },
  {
    id: 'e0000000-0000-0000-0000-000000000009',
    name: 'Plasma & Blood Bags',
    category: 'Medical',
    quantity: 500
  },
  {
    id: 'e0000000-0000-0000-0000-00000000000a',
    name: 'Search & Rescue Tools',
    category: 'Equipment',
    quantity: 300
  },
  {
    id: 'e1000000-0000-0000-0000-000000000001',
    name: 'Antibiotics Supply',
    category: 'Medical',
    quantity: 5000
  },
  {
    id: 'e1000000-0000-0000-0000-000000000002',
    name: 'Cholera Treatment Kits',
    category: 'Medical',
    quantity: 300
  },
  {
    id: 'e1000000-0000-0000-0000-000000000003',
    name: 'Mosquito Nets',
    category: 'Shelter',
    quantity: 20000
  },
  {
    id: 'e1000000-0000-0000-0000-000000000004',
    name: 'Solar Lanterns',
    category: 'Equipment',
    quantity: 1000
  },
  {
    id: 'e1000000-0000-0000-0000-000000000005',
    name: 'Emergency Cash Grants',
    category: 'Funding',
    quantity: 5000000
  },
  {
    id: 'e2000000-0000-0000-0000-000000000001',
    name: 'High-Energy Biscuits',
    category: 'Food',
    quantity: 50000
  },
  {
    id: 'e2000000-0000-0000-0000-000000000005',
    name: 'Ready-to-Use Therapeutic Food',
    category: 'Food',
    quantity: 10000
  },
  {
    id: 'e2000000-0000-0000-0000-000000000008',
    name: 'Hygiene Kits (Family)',
    category: 'Sanitation',
    quantity: 5000
  },
  {
    id: 'e2000000-0000-0000-0000-00000000000e',
    name: 'Malaria Rapid Test Kits',
    category: 'Medical',
    quantity: 10000
  },
  {
    id: 'e2000000-0000-0000-0000-00000000001b',
    name: 'Diesel (Liters)',
    category: 'Fuel',
    quantity: 50000
  }
];

export const mockErtResourceNeeds = [
  {
    id: '40000000-0000-0000-0000-000000000001',
    resourceID: 'e0000000-0000-0000-0000-000000000001',
    quantityRequired: 5000,
    quantityFulfilled: 2000,
    priority: 'high',
    incidentID: 'f0000000-0000-0000-0000-000000000001',
    status: 'in_progress'
  },
  {
    id: '40000000-0000-0000-0000-000000000002',
    resourceID: 'e0000000-0000-0000-0000-000000000002',
    quantityRequired: 20000,
    quantityFulfilled: 8000,
    priority: 'high',
    incidentID: 'f0000000-0000-0000-0000-000000000001',
    status: 'in_progress'
  },
  {
    id: '40000000-0000-0000-0000-000000000003',
    resourceID: 'e0000000-0000-0000-0000-000000000003',
    quantityRequired: 500,
    quantityFulfilled: 200,
    priority: 'high',
    incidentID: 'f0000000-0000-0000-0000-000000000001',
    status: 'in_progress'
  },
  {
    id: '40000000-0000-0000-0000-000000000004',
    resourceID: 'e0000000-0000-0000-0000-000000000004',
    quantityRequired: 300,
    quantityFulfilled: 100,
    priority: 'medium',
    incidentID: 'f0000000-0000-0000-0000-000000000003',
    status: 'in_progress'
  },
  {
    id: '40000000-0000-0000-0000-000000000005',
    resourceID: 'e0000000-0000-0000-0000-000000000005',
    quantityRequired: 2000,
    quantityFulfilled: 500,
    priority: 'medium',
    incidentID: 'f0000000-0000-0000-0000-000000000003',
    status: 'pending'
  },
  {
    id: '40000000-0000-0000-0000-000000000006',
    resourceID: 'e0000000-0000-0000-0000-000000000002',
    quantityRequired: 30000,
    quantityFulfilled: 0,
    priority: 'high',
    incidentID: 'f0000000-0000-0000-0000-000000000005',
    status: 'pending'
  },
  {
    id: '80000000-0000-0000-0000-000000000003',
    resourceID: 'e2000000-0000-0000-0000-000000000008',
    quantityRequired: 2000,
    quantityFulfilled: 2000,
    priority: 'low',
    incidentID: 'f0000000-0000-0000-0000-000000000004',
    status: 'satisfied'
  },
  {
    id: '80000000-0000-0000-0000-000000000009',
    resourceID: 'e2000000-0000-0000-0000-000000000005',
    quantityRequired: 5000,
    quantityFulfilled: 1500,
    priority: 'high',
    incidentID: 'f0000000-0000-0000-0000-000000000002',
    status: 'in_progress'
  },
  {
    id: '80000000-0000-0000-0000-000000000007',
    resourceID: 'e2000000-0000-0000-0000-00000000000e',
    quantityRequired: 5000,
    quantityFulfilled: 0,
    priority: 'high',
    incidentID: 'f0000000-0000-0000-0000-000000000004',
    status: 'pending'
  },
  {
    id: '80000000-0000-0000-0000-00000000000e',
    resourceID: 'e0000000-0000-0000-0000-000000000007',
    quantityRequired: 20,
    quantityFulfilled: 20,
    priority: 'high',
    incidentID: 'f0000000-0000-0000-0000-00000000000a',
    status: 'satisfied'
  }
];

export const mockErtInventoryItems = [
  {
    id: '50000000-0000-0000-0000-000000000001',
    resourceID: 'e0000000-0000-0000-0000-000000000001',
    quantity: 3000,
    location: { latitude: 9.032, longitude: 38.746 }
  },
  {
    id: '50000000-0000-0000-0000-000000000002',
    resourceID: 'e0000000-0000-0000-0000-000000000002',
    quantity: 15000,
    location: { latitude: 9.032, longitude: 38.746 }
  },
  {
    id: '50000000-0000-0000-0000-000000000003',
    resourceID: 'e0000000-0000-0000-0000-000000000003',
    quantity: 800,
    location: { latitude: 9.008, longitude: 38.761 }
  },
  {
    id: '50000000-0000-0000-0000-000000000004',
    resourceID: 'e0000000-0000-0000-0000-000000000004',
    quantity: 500,
    location: { latitude: 11.585, longitude: 37.391 }
  },
  {
    id: '50000000-0000-0000-0000-000000000005',
    resourceID: 'e0000000-0000-0000-0000-000000000005',
    quantity: 4000,
    location: { latitude: 13.497, longitude: 39.468 }
  },
  {
    id: '50000000-0000-0000-0000-000000000006',
    resourceID: 'e0000000-0000-0000-0000-000000000006',
    quantity: 80,
    location: { latitude: 9.593, longitude: 41.866 }
  },
  {
    id: '50000000-0000-0000-0000-000000000007',
    resourceID: 'e0000000-0000-0000-0000-000000000007',
    quantity: 40,
    location: { latitude: 9.032, longitude: 38.746 }
  },
  {
    id: '50000000-0000-0000-0000-000000000008',
    resourceID: 'e0000000-0000-0000-0000-000000000008',
    quantity: 50000,
    location: { latitude: 9.032, longitude: 38.746 }
  },
  {
    id: '50000001-0000-0000-0000-000000000001',
    resourceID: 'e1000000-0000-0000-0000-000000000001',
    quantity: 2000,
    location: { latitude: 9.008, longitude: 38.761 }
  },
  {
    id: '50000001-0000-0000-0000-000000000003',
    resourceID: 'e1000000-0000-0000-0000-000000000003',
    quantity: 12000,
    location: { latitude: 9.35, longitude: 42.796 }
  }
];

export const mockErtDashboardMetrics = {
  activeIncidents: 7,
  urgentMedical: 5,
  deployedUnits: 6,
  availableUnits: 2,
  totalResources: 52,
  totalNeeds: 37,
  totalInventory: 71,
  campaignsActive: 5
};
