import React from 'react'
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { LogOut, Filter, TrendingUp } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    end_year: '',
    topics: '',
    sector: '',
    region: '',
    pestle: '',
    source: '',
    country: '',
    city: '',
  });
  const [filterOptions, setFilterOptions] = useState({
    endYears: [],
    sectors: [],
    regions: [],
    pestles: [],
    sources: [],
    countries: [],
    cities: [],
    topics: [],
  });
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilters();
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchFilters = async () => {
    try {
      const response = await api.get('/data/filters');
      setFilterOptions(response.data.filters);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );
      const [dataResponse, statsResponse] = await Promise.all([
        api.get('/data', { params }),
        api.get('/data/stats'),
      ]);
      setData(dataResponse.data.data);
      setStats(statsResponse.data.stats);
      
      // Debug logging
      if (dataResponse.data.data.length > 0) {
        const topicsCount = dataResponse.data.data.filter(item => item.topic).length;
        const topics = [...new Set(dataResponse.data.data.filter(item => item.topic).map(item => item.topic))];
        console.log(`Loaded ${dataResponse.data.data.length} records, ${topicsCount} with topics:`, topics);
      } else {
        console.warn('No data received from API');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      end_year: '',
      topics: '',
      sector: '',
      region: '',
      pestle: '',
      source: '',
      country: '',
      city: '',
    });
  };

  // Prepare chart data
  const intensityByCountry = data.reduce((acc, item) => {
    if (item.country) {
      if (!acc[item.country]) {
        acc[item.country] = { country: item.country, avgIntensity: 0, count: 0 };
      }
      acc[item.country].avgIntensity += item.intensity || 0;
      acc[item.country].count += 1;
    }
    return acc;
  }, {});

  const intensityChartData = Object.values(intensityByCountry)
    .map((item) => ({
      name: item.country.length > 15 ? item.country.substring(0, 15) + '...' : item.country,
      value: parseFloat((item.avgIntensity / item.count).toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const likelihoodByTopic = data.reduce((acc, item) => {
    if (item.topic && item.topic.trim() !== '') {
      const topic = item.topic.trim();
      if (!acc[topic]) {
        acc[topic] = { topic: topic, avgLikelihood: 0, count: 0 };
      }
      const likelihood = typeof item.likelihood === 'number' ? item.likelihood : parseInt(item.likelihood) || 0;
      acc[topic].avgLikelihood += likelihood;
      acc[topic].count += 1;
    }
    return acc;
  }, {});

  const likelihoodChartData = Object.values(likelihoodByTopic)
    .filter(item => item.count > 0 && item.avgLikelihood > 0)
    .map((item) => {
      const avgValue = item.avgLikelihood / item.count;
      return {
        name: item.topic,
        value: isNaN(avgValue) ? 0 : parseFloat(avgValue.toFixed(2)),
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  // Debug: Log chart data
  useEffect(() => {
    if (data.length > 0) {
      const topics = data.filter(item => item.topic).map(item => item.topic);
      const uniqueTopics = [...new Set(topics)];
      console.log('Likelihood Chart Data:', likelihoodChartData);
      console.log('Unique topics in data:', uniqueTopics);
      if (likelihoodChartData.length === 0) {
        console.warn('Likelihood chart is empty. Check if topics have valid likelihood values.');
      }
    }
  }, [data, likelihoodChartData]);

  const relevanceByRegion = data.reduce((acc, item) => {
    if (item.region) {
      if (!acc[item.region]) {
        acc[item.region] = { region: item.region, avgRelevance: 0, count: 0 };
      }
      acc[item.region].avgRelevance += item.relevance || 0;
      acc[item.region].count += 1;
    }
    return acc;
  }, {});

  const relevanceChartData = Object.values(relevanceByRegion).map((item) => ({
    name: item.region,
    value: parseFloat((item.avgRelevance / item.count).toFixed(2)),
  }));

  const dataByYear = data.reduce((acc, item) => {
    if (item.end_year) {
      if (!acc[item.end_year]) {
        acc[item.end_year] = { year: item.end_year, intensity: 0, likelihood: 0, relevance: 0, count: 0 };
      }
      acc[item.end_year].intensity += item.intensity || 0;
      acc[item.end_year].likelihood += item.likelihood || 0;
      acc[item.end_year].relevance += item.relevance || 0;
      acc[item.end_year].count += 1;
    }
    return acc;
  }, {});

  const yearChartData = Object.values(dataByYear)
    .map((item) => ({
      year: item.year,
      intensity: parseFloat((item.intensity / item.count).toFixed(2)),
      likelihood: parseFloat((item.likelihood / item.count).toFixed(2)),
      relevance: parseFloat((item.relevance / item.count).toFixed(2)),
    }))
    .sort((a, b) => a.year - b.year);

  const sectorDistribution = data.reduce((acc, item) => {
    if (item.sector) {
      acc[item.sector] = (acc[item.sector] || 0) + 1;
    }
    return acc;
  }, {});

  const sectorChartData = Object.entries(sectorDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const cityDistribution = data.reduce((acc, item) => {
    if (item.city) {
      acc[item.city] = (acc[item.city] || 0) + 1;
    }
    return acc;
  }, {});

  const cityChartData = Object.entries(cityDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (loading && data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Data Visualization Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Records</p>
                <p className="text-2xl font-bold text-gray-800">{data.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Intensity</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.avgIntensity ? stats.avgIntensity.toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Likelihood</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.avgLikelihood ? stats.avgLikelihood.toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Relevance</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stats.avgRelevance ? stats.avgRelevance.toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <TrendingUp className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Filter size={20} />
              Filters
            </h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Year</label>
              <select
                value={filters.end_year}
                onChange={(e) => handleFilterChange('end_year', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Years</option>
                {filterOptions.endYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topics</label>
              <select
                value={filters.topics}
                onChange={(e) => handleFilterChange('topics', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Topics</option>
                {filterOptions.topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
              <select
                value={filters.sector}
                onChange={(e) => handleFilterChange('sector', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Sectors</option>
                {filterOptions.sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Regions</option>
                {filterOptions.regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PEST</label>
              <select
                value={filters.pestle}
                onChange={(e) => handleFilterChange('pestle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All PEST</option>
                {filterOptions.pestles.map((pestle) => (
                  <option key={pestle} value={pestle}>
                    {pestle}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
              <select
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Sources</option>
                {filterOptions.sources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Countries</option>
                {filterOptions.countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Cities</option>
                {filterOptions.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Intensity by Country */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Intensity by Country</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={intensityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Likelihood by Topic */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Likelihood by Topic</h3>
            {likelihoodChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={likelihoodChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => {
                      if (percent < 0.05) return ''; // Hide labels for very small slices
                      return `${name}: ${(percent * 100).toFixed(0)}%`;
                    }}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={400}
                  >
                    {likelihoodChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, 'Average Likelihood']}
                    labelFormatter={(label) => `Topic: ${label}`}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => value}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
                <p className="mb-2">No data available for likelihood by topic</p>
                <p className="text-sm text-gray-400">Check if data has topic values</p>
              </div>
            )}
          </div>

          {/* Relevance by Region */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Average Relevance by Region</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={relevanceChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Sector Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sector Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sectorChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sectorChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Year Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Trends Over Years (Intensity, Likelihood, Relevance)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={yearChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="intensity" stroke="#0088FE" strokeWidth={2} />
              <Line type="monotone" dataKey="likelihood" stroke="#00C49F" strokeWidth={2} />
              <Line type="monotone" dataKey="relevance" stroke="#FF8042" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* City Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Data Distribution by City</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={cityChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


