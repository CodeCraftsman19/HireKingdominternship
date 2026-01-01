# Setup Instructions

## Quick Start Guide

### Step 1: Install MongoDB

Make sure MongoDB is installed and running on your system.

- **Windows**: Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- **macOS**: `brew install mongodb-community` or download installer
- **Linux**: Follow MongoDB installation guide for your distribution

Start MongoDB service:
- **Windows**: MongoDB should start as a service automatically
- **macOS/Linux**: `mongod` or `brew services start mongodb-community`

### Step 2: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file (copy from .env.example or create manually)
# Make sure to set MONGODB_URI and JWT_SECRET

# Seed the database
npm run seed

# Start the server
npm start
# or for development
npm run dev
```

The backend server will run on `http://localhost:5000`

### Step 3: Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

### Step 4: Access the Application

1. Open your browser and go to `http://localhost:5173`
2. Register a new account
3. Login with your credentials
4. Explore the dashboard!

## Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/visualization_dashboard
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d
```

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running: `mongosh` should connect successfully
- Check if the port is correct (default: 27017)
- For MongoDB Atlas, use the connection string provided

### Port Already in Use

- Change PORT in `.env` file for backend
- Vite will automatically use another port if 5173 is busy

### Database Seeding Fails

- Ensure MongoDB is running
- Check that `jsondata.json` exists in the root directory
- Verify the JSON file has valid data

### CORS Errors

- Ensure backend is running before starting frontend
- Check that API_URL in `client/src/utils/api.js` matches your backend URL


