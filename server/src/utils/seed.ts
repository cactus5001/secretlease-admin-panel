import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

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

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.transaction.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();
  await prisma.adminConfig.deleteMany();

  // Create admin config
  console.log('⚙️  Creating admin config...');
  await prisma.adminConfig.create({
    data: {
      paypalEmail: 'payments@secretlease.com',
      btcAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      usdtAddress: 'TJsH5K8xxxTRC20xxxADDRESSxxx7Y3z',
      priceUsd: 60
    }
  });

  // Create users
  console.log('👥 Creating users...');
  const salt = await bcrypt.genSalt(10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@secretlease.com',
      password: await bcrypt.hash('admin123', salt),
      role: 'admin',
      hasPaid: true
    }
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      password: await bcrypt.hash('password', salt),
      role: 'user',
      hasPaid: true
    }
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'sarah@example.com',
      password: await bcrypt.hash('password', salt),
      role: 'user',
      hasPaid: false
    }
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'peter@example.com',
      password: await bcrypt.hash('password', salt),
      role: 'user',
      hasPaid: false
    }
  });

  // Create listings
  console.log('🏠 Creating listings (this may take a moment)...');
  const listings = [];
  for (let i = 0; i < 800; i++) {
    const city = i % 2 === 0 ? 'NY' : 'LA';
    const hood = NEIGHBORHOODS[city][(i * 7 + 3) % NEIGHBORHOODS[city].length];
    const type = TYPES[(i * 13) % TYPES.length];
    const adj = ADJECTIVES[(i * 5) % ADJECTIVES.length];
    let basePrice = type.includes('Room') ? 500 : type.includes('Studio') ? 800 : 1100;
    basePrice += (i * 19) % 600;
    if (i % 50 === 0) basePrice *= 0.7;

    listings.push({
      city,
      title: `${adj} ${type} in ${hood}`,
      area: hood,
      price: Math.floor(basePrice / 10) * 10,
      beds: type.includes('Studio') || type.includes('Room') ? 0 : 1,
      baths: 1,
      sqft: 150 + ((i * 23) % 500),
      type,
      address: `${Math.floor(Math.random() * 900 + 100)} ${STREETS[i % STREETS.length]} St`,
      imageUrl: UNSPLASH_IMAGES[i % UNSPLASH_IMAGES.length],
      amenities: AMENITIES_POOL[i % AMENITIES_POOL.length],
      contact: `landlord${i % 20}@rentals.com`,
      isActive: true
    });

    // Insert in batches of 100
    if (listings.length === 100 || i === 799) {
      await prisma.listing.createMany({ data: listings });
      console.log(`   Created ${i + 1}/800 listings...`);
      listings.length = 0;
    }
  }

  // Create transactions
  console.log('💳 Creating transactions...');
  await prisma.transaction.create({
    data: {
      userId: user1.id,
      userEmail: user1.email,
      amount: 60,
      method: 'paypal',
      status: 'completed'
    }
  });

  await prisma.transaction.create({
    data: {
      userId: user3.id,
      userEmail: user3.email,
      amount: 60,
      method: 'btc',
      status: 'pending'
    }
  });

  console.log('\n✅ Database seeded successfully!');
  console.log('\n📝 Test accounts:');
  console.log('   Admin: admin@secretlease.com / admin123');
  console.log('   User (paid): john@example.com / password');
  console.log('   User (free): sarah@example.com / password');
  console.log('   User (pending): peter@example.com / password\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
