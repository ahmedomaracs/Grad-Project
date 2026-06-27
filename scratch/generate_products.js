const fs = require('fs');

const categories = ['Engine', 'Brakes', 'Lighting', 'Accessories', 'Tires'];
const carBrands = ['BMW', 'Audi', 'Mercedes-Benz', 'Porsche', 'Honda', 'Toyota', 'Ford', 'Volkswagen', 'Universal'];
const partsByCat = {
  'Engine': [
    { name: 'NGK Iridium IX Spark Plugs (Set of 4)', brand: 'NGK', img: '/shop/ShopImages/images.jpeg', priceBase: 5000, tags: ['iridium', 'spark-plugs', 'engine'] },
    { name: 'K&N Performance Air Intake System', brand: 'K&N', img: '/shop/ShopImages/AirIntake.jpeg', priceBase: 15000, tags: ['intake', 'performance', 'engine'] },
    { name: 'Bosch High-Pressure Fuel Pump', brand: 'Bosch', img: '/shop/ShopImages/images.jpeg', priceBase: 12000, tags: ['fuel-pump', 'high-pressure', 'engine'] },
    { name: 'Castrol EDGE 5W-30 Advanced Full Synthetic', brand: 'Castrol', img: '/shop/ShopImages/AirIntake.jpeg', priceBase: 2500, tags: ['oil', 'synthetic', 'engine'] },
  ],
  'Brakes': [
    { name: 'Brembo Venting Brake Rotor (Front)', brand: 'Brembo', img: '/shop/ShopImages/brembobrakerotor.webp', priceBase: 14000, tags: ['rotor', 'performance', 'brakes'] },
    { name: 'Brembo Premium Ceramic Brake Pads Set', brand: 'Brembo', img: '/shop/ShopImages/Ceramicpads.webp', priceBase: 8000, tags: ['pads', 'ceramic', 'brakes'] },
    { name: 'Bosch Front Brake Kit / Brembo Caliper', brand: 'Bosch', img: '/shop/ShopImages/FrontBrakeKit.jpeg', priceBase: 29000, tags: ['caliper', 'kit', 'brakes'] },
    { name: 'Brembo Sport DOT 4 Brake Fluid (1L)', brand: 'Brembo', img: '/shop/ShopImages/brakefluid.webp', priceBase: 2400, tags: ['fluid', 'dot4', 'brakes'] },
  ],
  'Lighting': [
    { name: 'Philips X-tremeVision Pro150 Headlight Bulb', brand: 'Philips', img: '/shop/ShopImages/shopping.webp', priceBase: 1800, tags: ['headlight', 'bulb', 'lighting'] },
    { name: 'OSRAM Night Breaker Laser H7', brand: 'OSRAM', img: '/shop/ShopImages/shopping.webp', priceBase: 2200, tags: ['headlight', 'laser', 'lighting'] },
    { name: 'Hella ValueFit LED Light Bar', brand: 'Hella', img: '/shop/ShopImages/shopping.webp', priceBase: 4500, tags: ['led', 'light-bar', 'lighting'] },
  ],
  'Accessories': [
    { name: 'Bosch Aerotwin Beam Wiper Blades', brand: 'Bosch', img: '/shop/ShopImages/BoshForntdisc.jpeg', priceBase: 3000, tags: ['wiper', 'beam', 'accessories'] },
    { name: 'Professional Bluetooth OBD-II Scanner', brand: 'Automate', img: '/shop/ShopImages/shopping.webp', priceBase: 14000, tags: ['scanner', 'obd2', 'accessories'] },
    { name: 'WeatherTech Custom Fit FloorLiners', brand: 'WeatherTech', img: '/shop/ShopImages/BoshForntdisc.jpeg', priceBase: 5500, tags: ['floor-mats', 'custom-fit', 'accessories'] },
  ],
  'Tires': [
    { name: 'Michelin Pilot Sport 4 S', brand: 'Michelin', img: '/shop/ShopImages/Ceramicpads.webp', priceBase: 18000, tags: ['summer', 'performance', 'tires'] },
    { name: 'Pirelli P Zero All Season Plus', brand: 'Pirelli', img: '/shop/ShopImages/Ceramicpads.webp', priceBase: 16500, tags: ['all-season', 'performance', 'tires'] },
    { name: 'Continental ExtremeContact DWS06', brand: 'Continental', img: '/shop/ShopImages/Ceramicpads.webp', priceBase: 15000, tags: ['all-season', 'dws', 'tires'] },
  ]
};

let products = [];
let idCounter = 1;

categories.forEach(cat => {
  const parts = partsByCat[cat];
  parts.forEach(part => {
    // Generate ~5-6 variations of each part for different car brands
    const shuffledBrands = [...carBrands].sort(() => 0.5 - Math.random()).slice(0, 5);
    shuffledBrands.forEach(carBrand => {
      const pPrice = part.priceBase + Math.floor(Math.random() * 5000);
      products.push({
        id: `${idCounter++}-${carBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        name: part.name,
        brand: part.brand,
        category: cat,
        price: pPrice,
        rating: (4 + Math.random() * 1).toFixed(1),
        reviewCount: Math.floor(Math.random() * 800) + 50,
        image: part.img,
        inStock: Math.random() > 0.1,
        description: `High quality ${part.name} perfectly suited for your vehicle.`,
        tags: part.tags,
        compatibleBrand: carBrand,
        characteristics: {
          category: cat,
          technicalSpecs: [
            { label: 'Compatibility', value: carBrand },
            { label: 'Condition', value: 'New' }
          ]
        }
      });
    });
  });
});

// If we need exactly 90, let's pad or slice. We have 5 cats * ~3 parts * 5 brands = 75. 
// Let's generate until we have exactly 90.
while (products.length < 90) {
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const parts = partsByCat[cat];
  const part = parts[Math.floor(Math.random() * parts.length)];
  const carBrand = carBrands[Math.floor(Math.random() * carBrands.length)];
  const pPrice = part.priceBase + Math.floor(Math.random() * 5000);
  products.push({
    id: `${idCounter++}-${carBrand.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
    name: part.name,
    brand: part.brand,
    category: cat,
    price: pPrice,
    rating: (4 + Math.random() * 1).toFixed(1),
    reviewCount: Math.floor(Math.random() * 800) + 50,
    image: part.img,
    inStock: Math.random() > 0.1,
    description: `High quality ${part.name} perfectly suited for your vehicle.`,
    tags: part.tags,
    compatibleBrand: carBrand,
    characteristics: {
      category: cat,
      technicalSpecs: [
        { label: 'Compatibility', value: carBrand },
        { label: 'Condition', value: 'New' }
      ]
    }
  });
}

// ensure exactly 90
products = products.slice(0, 90);

const fileContent = `import { Product } from '../types/shop';

export const PRODUCTS: Product[] = ${JSON.stringify(products, null, 2).replace(/"([^"]+)":/g, '$1:')};
`;

fs.writeFileSync('./constants/products.ts', fileContent);
console.log('Successfully generated 90 products in constants/products.ts');
