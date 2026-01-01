import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Data from '../models/Data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Data.deleteMany({});
    console.log('✓ Existing data cleared');

    // Read JSON file - try multiple paths
    let jsonPath = path.join(__dirname, '../../jsondata.json');
    
    // If file doesn't exist at expected path, try current working directory
    if (!fs.existsSync(jsonPath)) {
      const alternativePath = path.join(process.cwd(), 'jsondata.json');
      if (fs.existsSync(alternativePath)) {
        jsonPath = alternativePath;
        console.log(`✓ Found jsondata.json at: ${jsonPath}`);
      } else {
        throw new Error(`Cannot find jsondata.json. Tried:\n- ${path.join(__dirname, '../../jsondata.json')}\n- ${alternativePath}`);
      }
    } else {
      console.log(`✓ Found jsondata.json at: ${jsonPath}`);
    }

    // Read and parse JSON file
    console.log('Reading JSON file...');
    const fileContent = fs.readFileSync(jsonPath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    
    if (!Array.isArray(jsonData)) {
      throw new Error('JSON file must contain an array of objects');
    }
    
    console.log(`✓ Loaded ${jsonData.length} records from JSON file`);

    // Insert data
    console.log('Inserting data into MongoDB...');
    await Data.insertMany(jsonData);
    console.log(`✓ Successfully seeded ${jsonData.length} records into MongoDB`);

    // Verify insertion
    const count = await Data.countDocuments({});
    console.log(`✓ Total documents in database: ${count}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
};

seedData();

