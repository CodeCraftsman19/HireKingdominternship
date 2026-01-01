# Visualization Dashboard

A comprehensive data visualization dashboard built with MERN stack (MongoDB, Express, React, Node.js) featuring JWT authentication and interactive charts.

## Features

- 🔐 **JWT Authentication** - Secure login and registration
- 📊 **Interactive Visualizations** - Multiple chart types using Recharts
- 🔍 **Advanced Filtering** - Filter by end year, topics, sector, region, PEST, source, country, and city
- 📈 **Data Insights** - Visualize intensity, likelihood, relevance, and more
- 🎨 **Modern UI** - Beautiful, responsive design inspired by modern dashboards

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/visualization_dashboard
JWT_SECRET=your_secret_key_here_change_in_production
JWT_EXPIRE=7d
```

4. Seed the database with data:
```bash
npm run seed
```

5. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port Vite assigns).

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Dashboard**: View visualizations and statistics
3. **Filters**: Use the filter panel to refine data views
4. **Charts**: Explore various visualizations including:
   - Intensity by Country (Bar Chart)
   - Likelihood by Topic (Pie Chart)
   - Relevance by Region (Bar Chart)
   - Sector Distribution (Pie Chart)
   - Trends Over Years (Line Chart)
   - City Distribution (Area Chart)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Data (Protected)
- `GET /api/data` - Get filtered data
- `GET /api/data/stats` - Get statistics
- `GET /api/data/filters` - Get available filter options
- `GET /api/data/grouped` - Get grouped data for visualization

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

### Frontend
- React.js
- React Router
- Recharts for visualizations
- Tailwind CSS for styling
- Axios for API calls
- Lucide React for icons

## Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── scripts/          # Utility scripts (seeding)
└── jsondata.json         # Source data file
```

## License

MIT


