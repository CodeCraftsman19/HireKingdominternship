import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function testConnection() {
  console.log('\n🔍 Testing Setup...\n');

  // Test 1: Check .env file
  console.log('1. Checking .env file...');
  if (!process.env.MONGODB_URI) {
    console.error('   ❌ MONGODB_URI not found in .env file');
    console.error('   Create server/.env with: MONGODB_URI=mongodb://localhost:27017/visualization_dashboard');
    process.exit(1);
  } else {
    console.log(`   ✓ MONGODB_URI found: ${process.env.MONGODB_URI}`);
  }

  // Test 2: Check JSON file exists
  console.log('\n2. Checking jsondata.json file...');
  let jsonPath = path.join(__dirname, '../../jsondata.json');
  
  if (!fs.existsSync(jsonPath)) {
    const altPath = path.join(process.cwd(), 'jsondata.json');
    if (fs.existsSync(altPath)) {
      jsonPath = altPath;
      console.log(`   ✓ Found at: ${jsonPath}`);
    } else {
      console.error('   ❌ jsondata.json not found');
      console.error(`   Tried: ${path.join(__dirname, '../../jsondata.json')}`);
      console.error(`   Tried: ${altPath}`);
      console.error('   Make sure jsondata.json is in the root directory');
      process.exit(1);
    }
  } else {
    console.log(`   ✓ Found at: ${jsonPath}`);
    
    // Check if file has content
    try {
      const content = fs.readFileSync(jsonPath, 'utf8');
      const data = JSON.parse(content);
      console.log(`   ✓ File is valid JSON with ${data.length} records`);
    } catch (error) {
      console.error(`   ❌ Invalid JSON: ${error.message}`);
      process.exit(1);
    }
  }

  // Test 3: Test MongoDB connection
  console.log('\n3. Testing MongoDB connection...');
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`   ✓ Connected to MongoDB: ${conn.connection.host}`);
    console.log(`   ✓ Database: ${conn.connection.name}`);
    
    // Check if database has data
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const dataCollection = collections.find(c => c.name === 'datas');
    
    if (dataCollection) {
      const count = await db.collection('datas').countDocuments();
      console.log(`   ✓ Collection 'datas' exists with ${count} documents`);
      
      if (count === 0) {
        console.log('   ⚠️  Database is empty. Run: npm run seed');
      }
    } else {
      console.log('   ⚠️  Collection "datas" does not exist yet. Run: npm run seed');
    }

    await mongoose.connection.close();
    console.log('\n✅ All tests passed! Setup looks good.\n');
    
    if (!dataCollection || (dataCollection && await db.collection('datas').countDocuments() === 0)) {
      console.log('📝 Next step: Run "npm run seed" to load data into MongoDB\n');
    }
    
  } catch (error) {
    console.error(`   ❌ MongoDB connection failed: ${error.message}`);
    console.error('\n   Possible solutions:');
    console.error('   1. Make sure MongoDB is running');
    console.error('   2. Check your MONGODB_URI in .env file');
    console.error('   3. If using MongoDB Atlas, check your connection string\n');
    process.exit(1);
  }
}

testConnection();


