////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { faker } from '@faker-js/faker';
import { matchSorter } from 'match-sorter'; // For filtering

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Define the shape of Product data
export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

// Mock product data store
export const fakeProducts = {
  records: [] as Product[], // Holds the list of product objects

  // Initialize with sample data
  initialize() {
    const sampleProducts: Product[] = [];
    function generateRandomProductData(id: number): Product {
      const categories = [
        'Electronics',
        'Furniture',
        'Clothing',
        'Toys',
        'Groceries',
        'Books',
        'Jewelry',
        'Beauty Products'
      ];

      return {
        id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        created_at: faker.date
          .between({ from: '2022-01-01', to: '2023-12-31' })
          .toISOString(),
        price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
        photo_url: `https://api.slingacademy.com/public/sample-products/${id}.png`,
        category: faker.helpers.arrayElement(categories),
        updated_at: faker.date.recent().toISOString()
      };
    }

    // Generate remaining records
    for (let i = 1; i <= 20; i++) {
      sampleProducts.push(generateRandomProductData(i));
    }

    this.records = sampleProducts;
  },

  // Get all products with optional category filtering and search
  async getAll({
    categories = [],
    search
  }: {
    categories?: string[];
    search?: string;
  }) {
    let products = [...this.records];

    // Filter products based on selected categories
    if (categories.length > 0) {
      products = products.filter((product) =>
        categories.includes(product.category)
      );
    }

    // Search functionality across multiple fields
    if (search) {
      products = matchSorter(products, search, {
        keys: ['name', 'description', 'category']
      });
    }

    return products;
  },

  // Get paginated results with optional category filtering and search
  async getProducts({
    page = 1,
    limit = 10,
    categories,
    search
  }: {
    page?: number;
    limit?: number;
    categories?: string;
    search?: string;
  }) {
    await delay(1000);
    const categoriesArray = categories ? categories.split('.') : [];
    const allProducts = await this.getAll({
      categories: categoriesArray,
      search
    });
    const totalProducts = allProducts.length;

    // Pagination logic
    const offset = (page - 1) * limit;
    const paginatedProducts = allProducts.slice(offset, offset + limit);

    // Mock current time
    const currentTime = new Date().toISOString();

    // Return paginated response
    return {
      success: true,
      time: currentTime,
      message: 'Sample data for testing and learning purposes',
      total_products: totalProducts,
      offset,
      limit,
      products: paginatedProducts
    };
  },

  // Get a specific product by its ID
  async getProductById(id: number) {
    await delay(1000); // Simulate a delay

    // Find the product by its ID
    const product = this.records.find((product) => product.id === id);

    if (!product) {
      return {
        success: false,
        message: `Product with ID ${id} not found`
      };
    }

    // Mock current time
    const currentTime = new Date().toISOString();

    return {
      success: true,
      time: currentTime,
      message: `Product with ID ${id} found`,
      product
    };
  }
};

// Initialize sample products
fakeProducts.initialize();

// Define the shape of Incident data
export type Incident = {
  id: string;
  description: string;
  location: string;
  status: 'Pending' | 'Validated' | 'False Alarm' | 'Escalated';
  reportDate: string;
  severityLevel: 'Low' | 'Medium' | 'High' | 'Critical';
};

export const fakeIncidents = {
  records: [] as Incident[],

  initialize() {
    const sampleIncidents: Incident[] = [];
    const statuses: Incident['status'][] = [
      'Pending',
      'Validated',
      'False Alarm',
      'Escalated'
    ];
    const severities: Incident['severityLevel'][] = [
      'Low',
      'Medium',
      'High',
      'Critical'
    ];
    const locations = [
      'Oromia',
      'Amhara',
      'Somali',
      'Tigray',
      'Afar',
      'Addis Ababa'
    ];
    const descriptors = [
      'Flood Alert',
      'Drought Report',
      'Internal Conflict',
      'Landslide',
      'Epidemic Outbreak',
      'Locust Invasion'
    ];

    for (let i = 1; i <= 50; i++) {
      sampleIncidents.push({
        id: `INC-2026-${i.toString().padStart(4, '0')}`,
        description: `${faker.helpers.arrayElement(descriptors)} reported near affected areas. ${faker.lorem.sentence()}`,
        location: faker.helpers.arrayElement(locations),
        status: faker.helpers.arrayElement(statuses),
        reportDate: faker.date.recent({ days: 30 }).toISOString(),
        severityLevel: faker.helpers.arrayElement(severities)
      });
    }

    this.records = sampleIncidents.sort(
      (a, b) =>
        new Date(b.reportDate).getTime() - new Date(a.reportDate).getTime()
    );
  },

  async getAll({
    status = [],
    severity = [],
    search
  }: {
    status?: string[];
    severity?: string[];
    search?: string;
  }) {
    let incidents = [...this.records];

    if (status.length > 0) {
      incidents = incidents.filter((inc) =>
        status.includes(inc.status.toLowerCase())
      );
    }

    if (severity.length > 0) {
      incidents = incidents.filter((inc) =>
        severity.includes(inc.severityLevel.toLowerCase())
      );
    }

    if (search) {
      incidents = matchSorter(incidents, search, {
        keys: ['id', 'description', 'location']
      });
    }

    return incidents;
  },

  async getIncidents({
    page = 1,
    limit = 10,
    status,
    severity,
    search
  }: {
    page?: number;
    limit?: number;
    status?: string;
    severity?: string;
    search?: string;
  }) {
    await delay(1000);
    const statusArray = status ? status.split('.') : [];
    const severityArray = severity ? severity.split('.') : [];

    const allIncidents = await this.getAll({
      status: statusArray,
      severity: severityArray,
      search
    });
    const totalIncidents = allIncidents.length;

    const offset = (page - 1) * limit;
    const paginatedIncidents = allIncidents.slice(offset, offset + limit);

    return {
      success: true,
      total_items: totalIncidents,
      offset,
      limit,
      items: paginatedIncidents
    };
  },

  async getIncidentById(id: string) {
    await delay(1000);

    const incident = this.records.find((inc) => inc.id === id);

    if (!incident) {
      return { success: false, message: `Incident with ID ${id} not found` };
    }

    return { success: true, incident };
  }
};

fakeIncidents.initialize();
