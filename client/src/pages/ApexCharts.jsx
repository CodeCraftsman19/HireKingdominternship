import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/Layout';
import ReactApexChart from 'react-apexcharts';
import { Filter, MoreVertical } from 'lucide-react';

const ApexCharts = () => {
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
      const response = await api.get('/data', { params });
      setData(response.data.data);
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

  // ApexCharts configurations
  const lineChartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: { show: true },
      zoom: { enabled: true }
    },
    colors: ['#7367f0', '#28c76f', '#ff9f43'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    xaxis: {
      categories: yearChartData.map(d => d.year),
      title: { text: 'Year' }
    },
    yaxis: {
      title: { text: 'Values' }
    },
    legend: {
      position: 'top'
    },
    grid: {
      borderColor: '#e7eef7'
    },
    tooltip: {
      shared: true,
      intersect: false
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
      toolbar: { show: true }
    },
    colors: ['#7367f0'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: intensityChartData.map(d => d.name),
      title: { text: 'Country' }
    },
    yaxis: {
      title: { text: 'Average Intensity' }
    },
    grid: {
      borderColor: '#e7eef7'
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
    labels: likelihoodChartData.map(d => d.name),
    colors: ['#7367f0', '#28c76f', '#ff9f43', '#ea5455', '#00cfe8', '#82868b', '#ff6b9d', '#c9cad1'],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "%";
      }
    }
  };

  const pieChartSeries = likelihoodChartData.map(d => d.value);

  const donutChartOptions = {
    chart: {
      type: 'donut',
      height: 350
    },
    labels: sectorChartData.map(d => d.name),
    colors: ['#7367f0', '#28c76f', '#ff9f43', '#ea5455', '#00cfe8', '#82868b', '#ff6b9d', '#c9cad1', '#28c76f', '#ff9f43'],
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: true
    }
  };

  const donutChartSeries = sectorChartData.map(d => d.value);

  const areaChartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: { show: true }
    },
    colors: ['#7367f0', '#28c76f'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: relevanceChartData.map(d => d.name),
      title: { text: 'Region' }
    },
    yaxis: {
      title: { text: 'Average Relevance' }
    },
    grid: {
      borderColor: '#e7eef7'
    },
    legend: {
      position: 'top'
    }
  };

  const areaChartSeries = [{
    name: 'Relevance',
    data: relevanceChartData.map(d => d.value)
  }];

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
      <div className="mb-4">
        <h4 className="mb-1 fw-bold" style={{ color: '#5e5873', fontSize: '1.5rem' }}>Apex Charts</h4>
        <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Beautiful charts built with ApexCharts</p>
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
              <label className="form-label small text-muted">End Year</label>
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
              <label className="form-label small text-muted">Topics</label>
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
              <label className="form-label small text-muted">Sector</label>
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
              <label className="form-label small text-muted">Region</label>
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
              <label className="form-label small text-muted">PEST</label>
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
              <label className="form-label small text-muted">Source</label>
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
              <label className="form-label small text-muted">Country</label>
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
              <label className="form-label small text-muted">City</label>
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
              <h5 className="mb-0 fw-bold" style={{ color: '#5e5873' }}>Line Chart - Trends Over Years</h5>
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
              <h5 className="mb-0 fw-bold" style={{ color: '#5e5873' }}>Pie Chart - Likelihood by Topic</h5>
              <button className="btn btn-link text-secondary p-0" style={{ border: 'none' }}>
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="card-body-vuexy">
              {likelihoodChartData.length > 0 ? (
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

        <div className="col-xl-6">
          <div className="card-vuexy">
            <div className="card-header-vuexy d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold" style={{ color: '#5e5873' }}>Bar Chart - Intensity by Country</h5>
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

        <div className="col-xl-6">
          <div className="card-vuexy">
            <div className="card-header-vuexy d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold" style={{ color: '#5e5873' }}>Donut Chart - Sector Distribution</h5>
              <button className="btn btn-link text-secondary p-0" style={{ border: 'none' }}>
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="card-body-vuexy">
              {sectorChartData.length > 0 ? (
                <ReactApexChart
                  options={donutChartOptions}
                  series={donutChartSeries}
                  type="donut"
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
              <h5 className="mb-0 fw-bold" style={{ color: '#5e5873' }}>Area Chart - Relevance by Region</h5>
              <button className="btn btn-link text-secondary p-0" style={{ border: 'none' }}>
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="card-body-vuexy">
              {relevanceChartData.length > 0 ? (
                <ReactApexChart
                  options={areaChartOptions}
                  series={areaChartSeries}
                  type="area"
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

export default ApexCharts;

