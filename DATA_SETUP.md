# Data Setup Guide

## How to Load jsondata.json into MongoDB

The application reads data from **MongoDB**, not directly from the JSON file. You need to import the JSON data into MongoDB first.

### Step-by-Step Instructions:

### 1. **Make sure MongoDB is running**

**Windows:**
```bash
# Check if MongoDB is running
# If installed as a service, it should start automatically
# Or start it manually:
mongod
```

**macOS:**
```bash
# If installed via Homebrew:
brew services start mongodb-community
# Or run directly:
mongod --config /usr/local/etc/mongod.conf
```

**Linux:**
```bash
sudo systemctl start mongod
# Or:
mongod
```

### 2. **Verify jsondata.json exists**

Make sure `jsondata.json` is in the **root directory** of your project (same level as `server` and `client` folders).

```
Aad_Intership/
├── jsondata.json    ← Should be here
├── server/
├── client/
└── ...
```

### 3. **Check your .env file**

In `server/.env`, make sure you have:
```env
MONGODB_URI=mongodb://localhost:27017/visualization_dashboard
```

If using MongoDB Atlas or a different connection string, update it accordingly.

### 4. **Install backend dependencies** (if not done)

```bash
cd server
npm install
```

### 5. **Seed the database**

This command reads `jsondata.json` and imports it into MongoDB:

```bash
cd server
npm run seed
```

You should see output like:
```
MongoDB Connected: localhost:27017
✓ Existing data cleared
✓ Found jsondata.json at: C:\Users\...\jsondata.json
Reading JSON file...
✓ Loaded 20 records from JSON file
Inserting data into MongoDB...
✓ Successfully seeded 20 records into MongoDB
✓ Total documents in database: 20
```

### 6. **Verify data was loaded**

Check if data is in MongoDB:

```bash
cd server
npm run check-data
```

This will show:
- Total number of documents
- A sample document
- Statistics (unique countries, sectors, regions)

### 7. **Start the server**

```bash
cd server
npm start
# or for development:
npm run dev
```

### 8. **Start the frontend**

In a new terminal:
```bash
cd client
npm install  # if not done
npm run dev
```

## Troubleshooting

### Error: "Cannot find jsondata.json"

**Solution:** 
1. Verify `jsondata.json` is in the root directory (same level as `server` folder)
2. Check the file name is exactly `jsondata.json` (case-sensitive)
3. Try running the seed script from the root directory:
   ```bash
   node server/scripts/seedDatabase.js
   ```

### Error: "MongoDB connection failed"

**Solutions:**
1. Make sure MongoDB is running
2. Check your MongoDB connection string in `server/.env`
3. For Windows, make sure MongoDB service is running:
   ```bash
   # Check services
   services.msc
   # Look for "MongoDB" service and start it
   ```

### Error: "Database is empty" when accessing dashboard

**Solution:**
1. Make sure you ran `npm run seed` successfully
2. Verify data exists: `npm run check-data`
3. Check that you're connecting to the correct database (check `.env` file)

### No data showing in dashboard

**Checklist:**
- ✅ MongoDB is running
- ✅ Database was seeded (`npm run seed`)
- ✅ Backend server is running (`npm start` in server folder)
- ✅ Frontend is running (`npm run dev` in client folder)
- ✅ You're logged in (JWT token is valid)

## Manual MongoDB Import (Alternative)

If the seed script doesn't work, you can manually import:

```bash
# Using mongoimport (if installed)
mongoimport --db visualization_dashboard --collection datas --file ../jsondata.json --jsonArray
```

Or using MongoDB Compass:
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select/create database: `visualization_dashboard`
4. Select/create collection: `datas`
5. Click "Import Data" → Select `jsondata.json` → Import

## Re-seeding (Clear and reload data)

If you need to reload the data:

```bash
cd server
npm run seed
```

This will:
1. Clear all existing data
2. Reload data from `jsondata.json`


