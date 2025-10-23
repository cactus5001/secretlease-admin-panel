import { subDays, subHours } from 'date-fns';
import { type RentalListing, type UserAccount, type Transaction, type AdminConfig } from '../types';

const NEIGHBORHOODS = {
  NY: ['Bushwick', 'Astoria', 'Ridgewood', 'Harlem', 'Washington Heights', 'Crown Heights', 'Bed-Stuy', 'Sunnyside', 'Flatbush', 'Inwood', 'East Village', 'LES', 'Greenpoint'],
  LA: ['Koreatown', 'Echo Park', 'Silver Lake', 'North Hollywood', 'Highland Park', 'Westlake', 'Palms', 'Boyle Heights', 'Van Nuys', 'Culver City', 'Eagle Rock', 'Los Feliz']
};
const TYPES = ['Studio', 'Private Room', '1 Bed Apt', 'Basement Unit', 'Shared Loft', 'Micro-Unit'];
const ADJECTIVES = ['Cozy', 'Spacious', 'Sunny', 'Renovated', 'Quiet', 'Charming', 'Hidden Gem', 'Modern', 'Vintage', 'Clean'];
const STREETS = ['Maple', 'Oak', 'Washington', 'Main', 'Broadway', 'High', 'Market', 'Park'];

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
  'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?w=800',
  'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800',
  'https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
];

const AMENITIES_POOL = [
  ['WiFi', 'Heating', 'Kitchen', 'Laundry', 'Parking', 'Pet Friendly'],
  ['WiFi', 'AC', 'Dishwasher', 'Gym Access', 'Balcony', 'Hardwood Floors'],
  ['WiFi', 'Heating', 'Kitchen', 'Elevator', 'Doorman', 'Storage'],
  ['WiFi', 'AC', 'Washer/Dryer', 'Rooftop Access', 'Bike Storage', 'Package Room'],
  ['WiFi', 'Heating', 'Renovated Kitchen', 'High Ceilings', 'Natural Light', 'Near Subway']
];

export const ALL_LISTINGS: RentalListing[] = Array.from({ length: 800 }, (_, i) => {
  const city = i % 2 === 0 ? 'NY' : 'LA';
  const hood = NEIGHBORHOODS[city][(i * 7 + 3) % NEIGHBORHOODS[city].length];
  const type = TYPES[(i * 13) % TYPES.length];
  const adj = ADJECTIVES[(i * 5) % ADJECTIVES.length];
  let basePrice = type.includes('Room') ? 500 : type.includes('Studio') ? 800 : 1100;
  basePrice += (i * 19) % 600;
  if (i % 50 === 0) basePrice *= 0.7;

  return {
    id: `sl-${city}-${1000 + i}`,
    city,
    title: `${adj} ${type} in ${hood}`,
    area: hood,
    price: Math.floor(basePrice / 10) * 10,
    beds: type.includes('Studio') || type.includes('Room') ? 0 : 1,
    baths: 1,
    sqft: 150 + ((i * 23) % 500),
    type,
    postedAgo: `${(i % 24) + 1}h ago`,
    address: `${Math.floor(Math.random() * 900 + 100)} ${STREETS[i % STREETS.length]} St`,
    imageUrl: UNSPLASH_IMAGES[i % UNSPLASH_IMAGES.length],
    amenities: AMENITIES_POOL[i % AMENITIES_POOL.length],
    contact: `landlord${i % 20}@rentals.com`
  };
});

export const INITIAL_USERS: UserAccount[] = [
  { id: 'u-admin', email: 'admin@secretlease.com', password: 'admin123', role: 'admin', isApproved: true, hasPaid: true, joinedDate: subDays(new Date(), 30).toISOString() },
  { id: 'u-1', email: 'john@example.com', password: 'password', role: 'user', isApproved: true, hasPaid: true, joinedDate: subDays(new Date(), 2).toISOString() },
  { id: 'u-2', email: 'sarah@example.com', password: 'password', role: 'user', isApproved: true, hasPaid: false, joinedDate: subHours(new Date(), 5).toISOString() },
  { id: 'u-3', email: 'peter@example.com', password: 'password', role: 'user', isApproved: true, hasPaid: false, joinedDate: subHours(new Date(), 1).toISOString() },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', userId: 'u-1', userEmail: 'john@example.com', amount: 60, method: 'paypal', date: subDays(new Date(), 2).toISOString(), status: 'completed' },
  { id: 'tx-2', userId: 'u-3', userEmail: 'peter@example.com', amount: 60, method: 'btc', date: subHours(new Date(), 1).toISOString(), status: 'pending' },
];

export const DEFAULT_CONFIG: AdminConfig = {
  paypalEmail: 'payments@secretlease.com',
  btcAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  usdtAddress: 'TJsH5K8xxxTRC20xxxADDRESSxxx7Y3z',
  priceUsd: 60
};