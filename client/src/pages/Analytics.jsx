import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Layout from '../components/Layout';
import { TrendingUp, TrendingDown, Activity, Users, DollarSign, ShoppingCart, Filter, MoreVertical } from 'lucide-react';
import ReactApexChart from 'react-apexcharts';

const Analytics = () => {
  const { user } = useAuth();
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
    .slice(0, 8);

  // ApexCharts configuration
  const lineChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    colors: ['#7367f0', '#28c76f', '#ff9f43'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: yearChartData.map(d => d.year),
      labels: { style: { colors: '#6e6b7b' } }
    },
    yaxis: {
      title: { text: 'Values', style: { color: '#6e6b7b' } },
      labels: { style: { colors: '#6e6b7b' } }
    },
    legend: {
      position: 'top',
      labels: { colors: '#6e6b7b' }
    },
    grid: {
      borderColor: '#ebe9f1'
    },
    tooltip: {
      theme: 'light'
    }
  };

  const lineChartSeries = [
    {
      name: 'Intensity',
      data: yearChartData.map(d => d.intensity)
    },
    {
      name: 'Likelihood',
      data: yearChartData.map(d => d.likelihood)
    },
    {
      name: 'Relevance',
      data: yearChartData.map(d => d.relevance)
    }
  ];

  const barChartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    colors: ['#7367f0'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    xaxis: {
      categories: intensityChartData.map(d => d.name),
      labels: { style: { colors: '#6e6b7b' } }
    },
    yaxis: {
      title: { text: 'Average Intensity', style: { color: '#6e6b7b' } },
      labels: { style: { colors: '#6e6b7b' } }
    },
    grid: {
      borderColor: '#ebe9f1'
    },
    tooltip: {
      theme: 'light'
    }
  };

  const barChartSeries = [{
    name: 'Intensity',
    data: intensityChartData.map(d => d.value)
  }];

  const pieChartOptions = {
    chart: {
      type: 'pie',
      height: 350
    },
    labels: sectorChartData.map(d => d.name),
    colors: ['#7367f0', '#28c76f', '#ff9f43', '#ea5455', '#00cfe8', '#82868b', '#ff6b9d', '#c9cad1'],
    legend: {
      position: 'bottom',
      labels: { colors: '#6e6b7b' }
    },
    tooltip: {
      theme: 'light'
    }
  };

  const pieChartSeries = sectorChartData.map(d => d.value);

  if (loading && data.length === 0) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Page Header */}
      <div className="mb-4">
        <h4 className="mb-1 fw-bold" style={{ color: '#5e5873', fontSize: '1.5rem' }}>Analytics Dashboard</h4>
        <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Welcome back, {user?.name} 👋</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card-vuexy">
            <div className="card-body-vuexy">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 text-muted" style={{ fontSize: '0.875rem' }}>Total Records</p>
                  <h3 className="mb-0 fw-bold" style={{ color: '#5e5873', fontSize: '1.75rem' }}>{data.length}</h3>
                  <small className="text-success d-flex align-items-center mt-1">
                    <TrendingUp size={14} className="me-1" />
                    <span>100%</span>
                  </small>
                </div>
                <div 
                  className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ width: '60px', height: '60px' }}
                >
                  <Activity size={24} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card-vuexy">
            <div className="card-body-vuexy">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 text-muted" style={{ fontSize: '0.875rem' }}>Avg Intensity</p>
                  <h3 className="mb-0 fw-bold" style={{ color: '#5e5873', fontSize: '1.75rem' }}>
                    {stats.avgIntensity ? stats.avgIntensity.toFixed(2) : '0.00'}
                  </h3>
                  <small className="text-success d-flex align-items-center mt-1">
                    <TrendingUp size={14} className="me-1" />
                    <span>12.5%</span>
                  </small>
                </div>
                <div 
                  className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ width: '60px', height: '60px' }}
                >
                  <TrendingUp size={24} className="text-success" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card-vuexy">
            <div className="card-body-vuexy">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 text-muted" style={{ fontSize: '0.875rem' }}>Avg Likelihood</p>
                  <h3 className="mb-0 fw-bold" style={{ color: '#5e5873', fontSize: '1.75rem' }}>
                    {stats.avgLikelihood ? stats.avgLikelihood.toFixed(2) : '0.00'}
                  </h3>
                  <small className="text-danger d-flex align-items-center mt-1">
                    <TrendingDown size={14} className="me-1" />
                    <span>8.2%</span>
                  </small>
                </div>
                <div 
                  className="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ width: '60px', height: '60px' }}
                >
                  <Users size={24} className="text-warning" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card-vuexy">
            <div className="card-body-vuexy">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-1 text-muted" style={{ fontSize: '0.875rem' }}>Avg Relevance</p>
                  <h3 className="mb-0 fw-bold" style={{ color: '#5e5873', fontSize: '1.75rem' }}>
                    {stats.avgRelevance ? stats.avgRelevance.toFixed(2) : '0.00'}
                  </h3>
                  <small className="text-success d-flex align-items-center mt-1">
                    <TrendingUp size={14} className="me-1" />
                    <span>15.3%</span>
                  </small>
                </div>
                <div 
                  className="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center" 
                  style={{ width: '60px', height: '60px' }}
                >
                  <DollarSign size={24} className="text-info" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-vuexy mb-4">
        <div className="card-header-vuexy d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold d-flex align-items-center" style={{ color: '#5e5873' }}>
            <Filter size={20} className="me-2" />
            Filters
          </h5>
          <button className="btn btn-sm btn-outline-primary" onClick={clearFilters}>
            Clear All
          </button>
        </div>
        <div className="card-body-vuexy">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label small text-muted fw-semibold">End Year</label>
              <select
                className="form-select"
                value={filters.end_year}
                onChange={(e) => handleFilterChange('end_year', e.target.value)}
              >
                <option value="">All Years</option>
                {filterOptions.endYears.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small text-muted fw-semibold">Topics</label>
              <select
                className="form-select"
                value={filters.topics}
                onChange={(e) => handleFilterChange('topics', e.target.value)}
              >
                <option value="">All Topics</option>
                {filterOptions.topics.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small text-muted fw-semibold">Sector</label>
              <select
                className="form-select"
                value={filters.sector}
                onChange={(e) => handleFilterChange('sector', e.target.value)}
              >
                <option value="">All Sectors</option>
                {filterOptions.sectors.map((sector) => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small text-muted fw-semibold">Region</label>
              <select
                className="form-select"
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
              >
                <option value="">All Regions</option>
                {filterOptions.regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small text-muted fw-semibold">PEST</label>
              <select
                className="form-select"
                value={filters.pestle}
                onChange={(e) => handleFilterChange('pestle', e.target.value)}
              >
                <option value="">All PEST</option>
                {filterOptions.pestles.map((pestle) => (
                  <option key={pestle} value={pestle}>{pestle}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small text-muted fw-semibold">Source</label>
              <select
                className="form-select"
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
              >
                <option value="">All Sources</option>
                {filterOptions.sources.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small text-muted fw-semibold">Country</label>
              <select
                className="form-select"
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
              >
                <option value="">All Countries</option>
                {filterOptions.countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label small text-muted fw-semibold">City</label>
              <select
                className="form-select"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
              >
                <option value="">All Cities</option>
                {filterOptions.cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4">
        <div className="col-xl-8">
          <div className="card-vuexy">
            <div className="card-header-vuexy d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold" style={{ color: '#5e5873' }}>Trends Over Years</h5>
              <button className="btn btn-link text-secondary p-0" style={{ border: 'none' }}>
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="card-body-vuexy">
              {yearChartData.length > 0 ? (
                <ReactApexChart
                  options={lineChartOptions}
                  series={lineChartSeries}
                  type="line"
                  height={350}
                />
              ) : (
                <div className="text-center py-5 text-muted">No data available</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <div className="card-vuexy">
            <div className="card-header-vuexy d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold" style={{ color: '#5e5873' }}>Sector Distribution</h5>
              <button className="btn btn-link text-secondary p-0" style={{ border: 'none' }}>
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="card-body-vuexy">
              {sectorChartData.length > 0 ? (
                <ReactApexChart
                  options={pieChartOptions}
                  series={pieChartSeries}
                  type="pie"
                  height={350}
                />
              ) : (
                <div className="text-center py-5 text-muted">No data available</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card-vuexy">
            <div className="card-header-vuexy d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold" style={{ color: '#5e5873' }}>Average Intensity by Country</h5>
              <button className="btn btn-link text-secondary p-0" style={{ border: 'none' }}>
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="card-body-vuexy">
              {intensityChartData.length > 0 ? (
                <ReactApexChart
                  options={barChartOptions}
                  series={barChartSeries}
                  type="bar"
                  height={350}
                />
              ) : (
                <div className="text-center py-5 text-muted">No data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
