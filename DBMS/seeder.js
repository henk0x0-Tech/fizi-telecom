import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// --- Mongoose Models mapped to existing backend models ---

const ProductSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', ProductSchema);

const ServiceSchema = new mongoose.Schema({}, { strict: false });
const Service = mongoose.model('Service', ServiceSchema);

const PlanSchema = new mongoose.Schema({}, { strict: false });
const Plan = mongoose.model('Plan', PlanSchema);

const CompanySchema = new mongoose.Schema({}, { strict: false });
const Company = mongoose.model('Company', CompanySchema);

// Connection String (update this if not using localhost)
const MONGODB_URI = 'mongodb://localhost:27017/fizi-telecom';

async function seedDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    // Load site content JSON
    const contentPath = path.join(process.cwd(), 'siteContent.json');
    if (!fs.existsSync(contentPath)) {
      throw new Error(`Could not find siteContent.json at ${contentPath}`);
    }
    const rawData = fs.readFileSync(contentPath, 'utf8');
    const data = JSON.parse(rawData);

    // 1. Seed Products
    if (data.products && data.products.length > 0) {
      console.log('📦 Seeding Products...');
      await Product.deleteMany({});
      await Product.insertMany(data.products);
      console.log(`✅ Seeded ${data.products.length} products`);
    }

    // 2. Seed Services
    if (data.services && data.services.length > 0) {
      console.log('🛠️  Seeding Services...');
      await Service.deleteMany({});
      await Service.insertMany(data.services);
      console.log(`✅ Seeded ${data.services.length} services`);
    }

    // 3. Seed Plans
    if (data.plans && data.plans.length > 0) {
      console.log('💰 Seeding Pricing Plans...');
      await Plan.deleteMany({});
      await Plan.insertMany(data.plans);
      console.log(`✅ Seeded ${data.plans.length} plans`);
    }

    // 4. Seed Company info
    if (data.contact) {
      console.log('🏢 Seeding Company & Contact Info...');
      await Company.deleteMany({});
      await Company.create({ contact: data.contact, name: 'Fizi Telecom', updatedAt: new Date() });
      console.log('✅ Seeded Company Info');
    }

    console.log('🎉 Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error Seeding Database:', error);
    process.exit(1);
  }
}

seedDatabase();
