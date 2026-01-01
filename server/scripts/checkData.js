import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Data from '../models/Data.js';
import connectDB from '../config/database.js';

dotenv.config();

const checkData = async () => {
  try {
    await connectDB();

    const count = await Data.countDocuments({});
    console.log(`\n📊 Total documents in database: ${count}\n`);

    if (count > 0) {
      const sample = await Data.findOne({});
      console.log('Sample document:');
      console.log(JSON.stringify(sample, null, 2));
      
      // Get some statistics
      const uniqueCountries = await Data.distinct('country');
      const uniqueSectors = await Data.distinct('sector');
      const uniqueRegions = await Data.distinct('region');
      
      console.log(`\n📈 Statistics:`);
      console.log(`- Unique Countries: ${uniqueCountries.length}`);
      console.log(`- Unique Sectors: ${uniqueSectors.length}`);
      console.log(`- Unique Regions: ${uniqueRegions.length}`);
    } else {
      console.log('⚠️  Database is empty. Please run: npm run seed');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking data:', error.message);
    process.exit(1);
  }
};

checkData();


