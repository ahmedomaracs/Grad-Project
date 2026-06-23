import { Category, Product } from '../types/shop';

export const CATEGORIES: Category[] = [
  'All',
  'Engine',
  'Brakes',
  'Lighting',
  'Accessories',
  'Tires',
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Brembo Venting Brake Rotor (Front)',
    brand: 'Brembo',
    category: 'Brakes',
    price: 14500.00,
    originalPrice: 19333.00,
    rating: 4.9,
    reviewCount: 342,
    image: '/shop/ShopImages/brembobrakerotor.webp',
    inStock: true,
    badge: 'Best Seller',
    discount: '-25%',
    description: 'High performance venting brake rotor engineered for precision and thermal efficiency during high-stress braking conditions.',
    tags: ['performance', 'rotor', 'brakes'],
    characteristics: {
      category: 'Brakes',
      technicalSpecs: [
        { label: 'Position', value: 'Front' },
        { label: 'Material', value: 'High-Carbon Cast Iron' },
        { label: 'Type', value: 'Vented' }
      ]
    }
  },
  {
    id: '2',
    name: 'Brembo Premium Ceramic Brake Pads Set',
    brand: 'Brembo',
    category: 'Brakes',
    price: 8999.00,
    originalPrice: 12675.00,
    rating: 4.7,
    reviewCount: 218,
    image: '/shop/ShopImages/Ceramicpads.webp',
    inStock: true,
    description: 'Ultra-high-performance ceramic brake pads offering low dust and superior stopping power.',
    tags: ['ceramic', 'pads', 'brakes'],
    characteristics: {
      category: 'Brakes',
      technicalSpecs: [
        { label: 'Material', value: 'Ceramic' },
        { label: 'Hardware Included', value: 'Yes' },
        { label: 'Noise Level', value: 'Low' }
      ]
    }
  },
  {
    id: '3',
    name: 'Bosch Front Brake Kit / Brembo Caliper',
    brand: 'Bosch / Brembo',
    category: 'Brakes',
    price: 29900.00,
    rating: 4.8,
    reviewCount: 156,
    image: '/shop/ShopImages/FrontBrakeKit.jpeg',
    inStock: true,
    badge: 'New',
    description: 'Comprehensive high-performance red brake caliper and rotor kit for front axles.',
    tags: ['performance', 'caliper', 'brakes'],
    characteristics: {
      category: 'Brakes',
      technicalSpecs: [
        { label: 'Color', value: 'Red' },
        { label: 'Includes', value: 'Calipers, Rotors, Pads' },
        { label: 'Position', value: 'Front' }
      ]
    }
  },
  {
    id: '4',
    name: 'Brembo Sport DOT 4 Brake Fluid (1L)',
    brand: 'Brembo',
    category: 'Brakes',
    price: 2450.00,
    originalPrice: 3025.00,
    rating: 4.6,
    reviewCount: 489,
    image: '/shop/ShopImages/brakefluid.webp',
    inStock: true,
    discount: '-19%',
    description: 'Sport DOT 4 brake fluid designed for high-performance driving and extreme temperatures.',
    tags: ['fluid', 'dot4', 'brakes'],
    characteristics: {
      category: 'Brakes',
      technicalSpecs: [
        { label: 'Volume', value: '1 Liter' },
        { label: 'Type', value: 'DOT 4' },
        { label: 'Boiling Point', value: 'Dry 500°F (260°C)' }
      ]
    }
  },
  {
    id: '5',
    name: 'Bosch Aerotwin Beam Wiper Blades',
    brand: 'Bosch',
    category: 'Accessories',
    price: 3999.00,
    rating: 4.5,
    reviewCount: 731,
    image: '/shop/ShopImages/BoshForntdisc.jpeg',
    inStock: false,
    description: 'Aerodynamic beam wiper blades with pressure-optimized design for streak-free visibility in all weather.',
    tags: ['all-season', 'beam-design', 'aerodynamic'],
    characteristics: {
      category: 'Accessories',
      technicalSpecs: [
        { label: 'Design', value: 'Beam' },
        { label: 'Weather', value: 'All-Season' }
      ]
    }
  },
  {
    id: '6',
    name: 'NGK Iridium IX Spark Plugs (Set of 4)',
    brand: 'NGK',
    category: 'Engine',
    price: 5499.00,
    originalPrice: 6999.00,
    rating: 4.8,
    reviewCount: 267,
    image: '/shop/ShopImages/images.jpeg',
    inStock: true,
    badge: 'Sale',
    discount: '-21%',
    description: 'Fine-wire iridium centre electrode for exceptional ignitability and 100,000-mile service life.',
    tags: ['iridium', 'long-life', 'fuel-efficient'],
    characteristics: {
      category: 'Engine',
      technicalSpecs: [
        { label: 'Core Material', value: 'Iridium' },
        { label: 'Quantity', value: 'Set of 4' },
        { label: 'Lifespan', value: 'Up to 100k miles' }
      ]
    }
  },
  {
    id: '7',
    name: 'K&N Performance Air Intake System',
    brand: 'K&N',
    category: 'Engine',
    price: 18999.00,
    rating: 4.9,
    reviewCount: 412,
    image: '/shop/ShopImages/AirIntake.jpeg',
    inStock: true,
    badge: 'Premium',
    description: 'Custom-designed air intake system built to increase horsepower, torque, and engine sound.',
    tags: ['intake', 'performance', 'horsepower'],
    characteristics: {
      category: 'Engine',
      technicalSpecs: [
        { label: 'Filter Type', value: 'Washable/Reusable' },
        { label: 'Increase', value: 'Estimated +10 HP' }
      ]
    }
  },
  {
    id: '8',
    name: 'Professional Bluetooth OBD-II Scanner',
    brand: 'Automate',
    category: 'Accessories',
    price: 14999.00,
    originalPrice: 19999.00,
    rating: 4.7,
    reviewCount: 189,
    image: '/shop/ShopImages/shopping.webp',
    inStock: true,
    discount: '-25%',
    description: 'Professional-grade Bluetooth OBD-II scanner with real-time diagnostics, fault code reading, and live data.',
    tags: ['bluetooth', 'wireless', 'professional'],
    characteristics: {
      category: 'Accessories',
      technicalSpecs: [
        { label: 'Connectivity', value: 'Bluetooth' },
        { label: 'Compatibility', value: 'iOS & Android' },
        { label: 'Features', value: 'Live Data, Code Reading/Clearing' }
      ]
    }
  }
];
