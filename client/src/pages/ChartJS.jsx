// import React, { useState, useEffect } from 'react';
// import api from '../utils/api';
// import Layout from '../components/Layout';
// import { Filter, MoreVertical } from 'lucide-react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// } from 'chart.js';
// // import { Line, Bar, Pie, Doughnut, Area } from 'react-chartjs-2';

// import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';


// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// const ChartPage = () => {
//   const [data, setData] = useState([]);
//   const [filters, setFilters] = useState({
//     end_year: '',
//     topics: '',
//     sector: '',
//     region: '',
//     pestle: '',
//     source: '',
//     country: '',
//     city: '',
//   });
//   const [filterOptions, setFilterOptions] = useState({
//     endYears: [],
//     sectors: [],
//     regions: [],
//     pestles: [],
//     sources: [],
//     countries: [],
//     cities: [],
//     topics: [],
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchFilters();
//     fetchData();
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [filters]);

//   const fetchFilters = async () => {
//     try {
//       const response = await api.get('/data/filters');
//       setFilterOptions(response.data.filters);
//     } catch (error) {
//       console.error('Error fetching filters:', error);
//     }
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const params = Object.fromEntries(
//         Object.entries(filters).filter(([_, v]) => v !== '')
//       );
//       const response = await api.get('/data', { params });
//       setData(response.data.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       end_year: '',
//       topics: '',
//       sector: '',
//       region: '',
//       pestle: '',
//       source: '',
//       country: '',
//       city: '',
//     });
//   };

//   // Prepare chart data
//   const intensityByCountry = data.reduce((acc, item) => {
//     if (item.country) {
//       if (!acc[item.country]) {
//         acc[item.country] = { country: item.country, avgIntensity: 0, count: 0 };
//       }
//       acc[item.country].avgIntensity += item.intensity || 0;
//       acc[item.country].count += 1;
//     }
//     return acc;
//   }, {});

//   const intensityChartData = Object.values(intensityByCountry)
//     .map((item) => ({
//       name: item.country.length > 15 ? item.country.substring(0, 15) + '...' : item.country,
//       value: parseFloat((item.avgIntensity / item.count).toFixed(2)),
//     }))
//     .sort((a, b) => b.value - a.value)
//     .slice(0, 10);

//   const likelihoodByTopic = data.reduce((acc, item) => {
//     if (item.topic && item.topic.trim() !== '') {
//       const topic = item.topic.trim();
//       if (!acc[topic]) {
//         acc[topic] = { topic: topic, avgLikelihood: 0, count: 0 };
//       }
//       const likelihood = typeof item.likelihood === 'number' ? item.likelihood : parseInt(item.likelihood) || 0;
//       acc[topic].avgLikelihood += likelihood;
//       acc[topic].count += 1;
//     }
//     return acc;
//   }, {});

//   const likelihoodChartData = Object.values(likelihoodByTopic)
//     .filter(item => item.count > 0 && item.avgLikelihood > 0)
//     .map((item) => {
//       const avgValue = item.avgLikelihood / item.count;
//       return {
//         name: item.topic,
//         value: isNaN(avgValue) ? 0 : parseFloat(avgValue.toFixed(2)),
//       };
//     })
//     .filter(item => item.value > 0)
//     .sort((a, b) => b.value - a.value)
//     .slice(0, 8);

//   const relevanceByRegion = data.reduce((acc, item) => {
//     if (item.region) {
//       if (!acc[item.region]) {
//         acc[item.region] = { region: item.region, avgRelevance: 0, count: 0 };
//       }
//       acc[item.region].avgRelevance += item.relevance || 0;
//       acc[item.region].count += 1;
//     }
//     return acc;
//   }, {});

//   const relevanceChartData = Object.values(relevanceByRegion).map((item) => ({
//     name: item.region,
//     value: parseFloat((item.avgRelevance / item.count).toFixed(2)),
//   }));

//   const dataByYear = data.reduce((acc, item) => {
//     if (item.end_year) {
//       if (!acc[item.end_year]) {
//         acc[item.end_year] = { year: item.end_year, intensity: 0, likelihood: 0, relevance: 0, count: 0 };
//       }
//       acc[item.end_year].intensity += item.intensity || 0;
//       acc[item.end_year].likelihood += item.likelihood || 0;
//       acc[item.end_year].relevance += item.relevance || 0;
//       acc[item.end_year].count += 1;
//     }
//     return acc;
//   }, {});

//   const yearChartData = Object.values(dataByYear)
//     .map((item) => ({
//       year: item.year,
//       intensity: parseFloat((item.intensity / item.count).toFixed(2)),
//       likelihood: parseFloat((item.likelihood / item.count).toFixed(2)),
//       relevance: parseFloat((item.relevance / item.count).toFixed(2)),
//     }))
//     .sort((a, b) => a.year - b.year);

//   const sectorDistribution = data.reduce((acc, item) => {
//     if (item.sector) {
//       acc[item.sector] = (acc[item.sector] || 0) + 1;
//     }
//     return acc;
//   }, {});

//   const sectorChartData = Object.entries(sectorDistribution)
//     .map(([name, value]) => ({ name, value }))
//     .sort((a, b) => b.value - a.value)
//     .slice(0, 8);

//   // Chart.js configurations
//   const lineChartData = {
//     labels: yearChartData.map(d => d.year),
//     datasets: [
//       {
//         label: 'Intensity',
//         data: yearChartData.map(d => d.intensity),
//         borderColor: '#7367f0',
//         backgroundColor: 'rgba(115, 103, 240, 0.1)',
//         tension: 0.4,
//         fill: true
//       },
//       {
//         label: 'Likelihood',
//         data: yearChartData.map(d => d.likelihood),
//         borderColor: '#28c76f',
//         backgroundColor: 'rgba(40, 199, 111, 0.1)',
//         tension: 0.4,
//         fill: true
//       },
//       {
//         label: 'Relevance',
//         data: yearChartData.map(d => d.relevance),
//         borderColor: '#ff9f43',
//         backgroundColor: 'rgba(255, 159, 67, 0.1)',
//         tension: 0.4,
//         fill: true
//       }
//     ]
//   };

//   const lineChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: false
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: '#e7eef7'
//         }
//       },
//       x: {
//         grid: {
//           color: '#e7eef7'
//         }
//       }
//     }
//   };

//   const barChartData = {
//     labels: intensityChartData.map(d => d.name),
//     datasets: [
//       {
//         label: 'Average Intensity',
//         data: intensityChartData.map(d => d.value),
//         backgroundColor: '#7367f0',
//         borderRadius: 4
//       }
//     ]
//   };

//   const barChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false
//       },
//       title: {
//         display: false
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: '#e7eef7'
//         }
//       },
//       x: {
//         grid: {
//           display: false
//         }
//       }
//     }
//   };

//   const pieChartData = {
//     labels: likelihoodChartData.map(d => d.name),
//     datasets: [
//       {
//         data: likelihoodChartData.map(d => d.value),
//         backgroundColor: [
//           '#7367f0',
//           '#28c76f',
//           '#ff9f43',
//           '#ea5455',
//           '#00cfe8',
//           '#82868b',
//           '#ff6b9d',
//           '#c9cad1'
//         ]
//       }
//     ]
//   };

//   const pieChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'bottom'
//       },
//       title: {
//         display: false
//       }
//     }
//   };

//   const donutChartData = {
//     labels: sectorChartData.map(d => d.name),
//     datasets: [
//       {
//         data: sectorChartData.map(d => d.value),
//         backgroundColor: [
//           '#7367f0',
//           '#28c76f',
//           '#ff9f43',
//           '#ea5455',
//           '#00cfe8',
//           '#82868b',
//           '#ff6b9d',
//           '#c9cad1'
//         ]
//       }
//     ]
//   };

//   const donutChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'bottom'
//       },
//       title: {
//         display: false
//       }
//     }
//   };

//   const areaChartData = {
//     labels: relevanceChartData.map(d => d.name),
//     datasets: [
//       {
//         label: 'Average Relevance',
//         data: relevanceChartData.map(d => d.value),
//         borderColor: '#7367f0',
//         backgroundColor: 'rgba(115, 103, 240, 0.3)',
//         tension: 0.4,
//         fill: true
//       }
//     ]
//   };

//   const areaChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         display: false
//       },
//       title: {
//         display: false
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         grid: {
//           color: '#e7eef7'
//         }
//       },
//       x: {
//         grid: {
//           color: '#e7eef7'
//         }
//       }
//     }
//   };

//   if (loading && data.length === 0) {
//     return (
//       <Layout>
//         <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
//           <div className="spinner-border text-primary" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="mb-4">
//         <h4 className="mb-1 fw-bold" style={{ color: '#5e5873', fontSize: '1.5rem' }}>Chart.js Charts</h4>
//         <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Interactive charts built with Chart.js</p>
//       </div>

//       {/* Filters */}
//       <div className="card-vuexy mb-4">
//         <div className="card-header-vuexy d-flex justify-content-between align-items-center">
//           <h5 className="mb-0 fw-bold d-flex align-items-center" style={{ color: '#5e5873' }}>
//             <Filter size={20} className="me-2" />
//             Filters
//           </h5>
//           <button className="btn btn-sm btn-outline-primary" onClick={clearFilters}>
//             Clear All
//           </button>
//         </div>
//         <div className="card-body-vuexy">
//           <div className="row g-3">
//             <div className="col-md-3">
//               <label className="form-label small text-muted">End Year</label>
//               <select
//                 className="form-select"
//                 value={filters.end_year}
//                 onChange={(e) => handleFilterChange('end_year', e.target.value)}
//               >
//                 <option value="">All Years</option>
//                 {filterOptions.endYears.map((year) => (
//                   <option key={year} value={year}>{year}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3">
//               <label className="form-label small text-muted">Topics</label>
//               <select
//                 className="form-select"
//                 value={filters.topics}
//                 onChange={(e) => handleFilterChange('topics', e.target.value)}
//               >
//                 <option value="">All Topics</option>
//                 {filterOptions.topics.map((topic) => (
//                   <option key={topic} value={topic}>{topic}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3">
//               <label className="form-label small text-muted">Sector</label>
//               <select
//                 className="form-select"
//                 value={filters.sector}
//                 onChange={(e) => handleFilterChange('sector', e.target.value)}
//               >
//                 <option value="">All Sectors</option>
//                 {filterOptions.sectors.map((sector) => (
//                   <option key={sector} value={sector}>{sector}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3">
//               <label className="form-label small text-muted">Region</label>
//               <select
//                 className="form-select"
//                 value={filters.region}
//                 onChange={(e) => handleFilterChange('region', e.target.value)}
//               >
//                 <option value="">All Regions</option>
//                 {filterOptions.regions.map((region) => (
//                   <option key={region} value={region}>{region}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3">
//               <label className="form-label small text-muted">PEST</label>
//               <select
//                 className="form-select"
//                 value={filters.pestle}
//                 onChange={(e) => handleFilterChange('pestle', e.target.value)}
//               >
//                 <option value="">All PEST</option>
//                 {filterOptions.pestles.map((pestle) => (
//                   <option key={pestle} value={pestle}>{pestle}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3">
//               <label className="form-label small text-muted">Source</label>
//               <select
//                 className="form-select"
//                 value={filters.source}
//                 onChange={(e) => handleFilterChange('source', e.target.value)}
//               >
//                 <option value="">All Sources</option>
//                 {filterOptions.sources.map((source) => (
//                   <option key={source} value={source}>{source}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3">
//               <label className="form-label small text-muted">Country</label>
//               <select
//                 className="form-select"
//                 value={filters.country}
//                 onChange={(e) => handleFilterChange('country', e.target.value)}
//               >
//                 <option value="">All Countries</option>
//                 {filterOptions.countries.map((country) => (
//                   <option key={country} value={country}>{country}</option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3">
//               <label className="form-label small text-muted">City</label>
//               <select
//                 className="form-select"
//                 value={filters.city}
//                 onChange={(e) => handleFilterChange('city', e.target.value)}
//               >
//                 <option value="">All Cities</option>
//                 {filterOptions.cities.map((city) => (
//                   <option key={city} value={city}>{city}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts */}
//       <div className="row g-4">
//         <div className="col-xl-8">
//           <div className="card-vuexy">
//             <div className="card-header-vuexy d-flex justify-content-between align-items-center">
//               <h5 className="mb-0 fw-bold" style={{ color: '#5e5873' }}>Line Chart - Trends Over Years</h5>
//               <button className="btn btn-link text-secondary p-0" style={{ border: 'none' }}>
//                 <MoreVertical size={18} />
//               </button>
//             </div>
//             <div className="card-body-vuexy" style={{ height: '400px' }}>
//               {yearChartData.length > 0 ? (
//                 <Line data={lineChartData} options={lineChartOptions} />
//               ) : (
//                 <div className="text-center py-5 text-muted">No data available</div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="col-xl-4">
//           <div className="card-vuexy">
//             <div className="card-header-vuexy d-flex justify-content-between align-items-center">
//               <h5 className="mb-0 fw-bold" style={{ color: '#5e5873' }}>Pie Chart - Likelihood by Topic</h5>
//               <button className="btn btn-link text-secondary p-0" style={{ border: 'none' }}>
//                 <MoreVertical size={18} />
//               </button>
//             </div>
//             <div className="card-body-vuexy" style={{ height: '400px' }}>
//               {likelihoodChartData.length > 0 ? (
//                 <Pie data={pieChartData} options={pieChartOptions} />
//               ) : (
//                 <div className="text-center py-5 text-muted">No data available</div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="col-xl-6">
//           <div className="card-vuexy">
//             <div className="card-header-vuexy d-flex justify-content-between align-items-center">
//               <h5 className="mb-0 fw-bold" style={{ color: '#5e5873' }}>Bar Chart - Intensity by Country</h5>
//               <button className="btn btn-link text-secondary p-0" style={{ border: 'none' }}>
//                 <MoreVertical size={18} />
//               </button>
//             </div>
//             <div className="card-body-vuexy" style={{ height: '400px' }}>
//               {intensityChartData.length > 0 ? (
//                 <Bar data={barChartData} options={barChartOptions} />
//               ) : (
//                 <div className="text-center py-5 text-muted">No data available</div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="col-xl-6">
//           <div className="card-vuexy">
//             <div className="card-header-vuexy d-flex justify-content-between align-items-center">
//               <h5 className="mb-0 fw-bold" style={{ color: '#5e5873' }}>Doughnut Chart - Sector Distribution</h5>
//               <button className="btn btn-link text-secondary p-0" style={{ border: 'none' }}>
//                 <MoreVertical size={18} />
//               </button>
//             </div>
//             <div className="card-body-vuexy" style={{ height: '400px' }}>
//               {sectorChartData.length > 0 ? (
//                 <Doughnut data={donutChartData} options={donutChartOptions} />
//               ) : (
//                 <div className="text-center py-5 text-muted">No data available</div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="col-12">
//           <div className="card-vuexy">
//             <div className="card-header-vuexy d-flex justify-content-between align-items-center">
//               <h5 className="mb-0 fw-bold" style={{ color: '#5e5873' }}>Area Chart - Relevance by Region</h5>
//               <button className="btn btn-link text-secondary p-0" style={{ border: 'none' }}>
//                 <MoreVertical size={18} />
//               </button>
//             </div>
//             <div className="card-body-vuexy" style={{ height: '400px' }}>
//               {relevanceChartData.length > 0 ? (
//                 <Area data={areaChartData} options={areaChartOptions} />
//               ) : (
//                 <div className="text-center py-5 text-muted">No data available</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default ChartPage;

// import React, { useState, useEffect } from 'react';
// import api from '../utils/api';
// import Layout from '../components/Layout';
// import { Filter, MoreVertical } from 'lucide-react';

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// } from 'chart.js';

// import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';

// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const ChartPage = () => {
//   const [data, setData] = useState([]);
//   const [filters, setFilters] = useState({
//     end_year: '',
//     topics: '',
//     sector: '',
//     region: '',
//     pestle: '',
//     source: '',
//     country: '',
//     city: '',
//   });

//   const [filterOptions, setFilterOptions] = useState({
//     endYears: [],
//     sectors: [],
//     regions: [],
//     pestles: [],
//     sources: [],
//     countries: [],
//     cities: [],
//     topics: [],
//   });

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchFilters();
//     fetchData();
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [filters]);

//   const fetchFilters = async () => {
//     try {
//       const res = await api.get('/data/filters');
//       setFilterOptions(res.data.filters);
//     } catch (err) {
//       console.error('Filter fetch error:', err);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       const params = Object.fromEntries(
//         Object.entries(filters).filter(([_, v]) => v !== '')
//       );
//       const res = await api.get('/data', { params });
//       setData(res.data.data);
//     } catch (err) {
//       console.error('Data fetch error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ----------------------- DATA PROCESSING ----------------------- */

//   const yearMap = {};
//   data.forEach(item => {
//     if (!item.end_year) return;
//     if (!yearMap[item.end_year]) {
//       yearMap[item.end_year] = { intensity: 0, relevance: 0, likelihood: 0, count: 0 };
//     }
//     yearMap[item.end_year].intensity += item.intensity || 0;
//     yearMap[item.end_year].relevance += item.relevance || 0;
//     yearMap[item.end_year].likelihood += item.likelihood || 0;
//     yearMap[item.end_year].count += 1;
//   });

//   const yearData = Object.entries(yearMap).map(([year, v]) => ({
//     year,
//     intensity: +(v.intensity / v.count).toFixed(2),
//     relevance: +(v.relevance / v.count).toFixed(2),
//     likelihood: +(v.likelihood / v.count).toFixed(2),
//   }));

//   const intensityData = {};
//   data.forEach(d => {
//     if (!d.country) return;
//     intensityData[d.country] = (intensityData[d.country] || 0) + (d.intensity || 0);
//   });

//   const barData = Object.entries(intensityData)
//     .map(([k, v]) => ({ name: k, value: v }))
//     .slice(0, 8);

//   const topicData = {};
//   data.forEach(d => {
//     if (!d.topic) return;
//     topicData[d.topic] = (topicData[d.topic] || 0) + 1;
//   });

//   const pieData = Object.entries(topicData).map(([k, v]) => ({
//     name: k,
//     value: v,
//   }));

//   /* ----------------------- CHART CONFIGS ----------------------- */

//   const lineChartData = {
//     labels: yearData.map(d => d.year),
//     datasets: [
//       {
//         label: 'Intensity',
//         data: yearData.map(d => d.intensity),
//         borderColor: '#7367f0',
//         backgroundColor: 'rgba(115,103,240,0.2)',
//         fill: true,
//         tension: 0.4
//       }
//     ]
//   };

//   const barChartData = {
//     labels: barData.map(d => d.name),
//     datasets: [
//       {
//         label: 'Intensity',
//         data: barData.map(d => d.value),
//         backgroundColor: '#28c76f'
//       }
//     ]
//   };

//   const pieChartData = {
//     labels: pieData.map(d => d.name),
//     datasets: [
//       {
//         data: pieData.map(d => d.value),
//         backgroundColor: [
//           '#7367f0', '#28c76f', '#ff9f43',
//           '#ea5455', '#00cfe8', '#82868b'
//         ]
//       }
//     ]
//   };

//   return (
//     <Layout>
//       <div className="mb-4">
//         <h4 className="fw-bold">Analytics Dashboard</h4>
//       </div>

//       <div className="row g-4">

//         <div className="col-xl-6">
//           <div className="fw-bold">
//             <h6>Line Chart (Trend)</h6>
//             <Line data={lineChartData} />
//           </div>
//         </div>

//         <div className="col-xl-6">
//           <div className="fw-bold">
//             <h6>Bar Chart</h6>
//             <Bar data={barChartData} />
//           </div>
//         </div>

//         <div className="col-xl-6">
//           <div className="fw-bold">
//             <h6>Pie Chart</h6>
//             <Pie data={pieChartData} />
//           </div>
//         </div>

//         <div className="col-xl-6">
//           <div className="fw-bold">
//             <h6>Area Chart</h6>
//             <Line data={lineChartData} />
//           </div>
//         </div>

//       </div>
//     </Layout>
//   );
// };

// export default ChartPage;


import React, { useState, useEffect } from "react";
import api from "../utils/api";
import Layout from "../components/Layout";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar, Pie } from "react-chartjs-2";

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartPage = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/data");
      setData(res.data.data);
    } catch (err) {
      console.error("Data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- DATA PROCESSING ---------------- */

  const yearMap = {};
  data.forEach((item) => {
    if (!item.end_year) return;
    if (!yearMap[item.end_year]) {
      yearMap[item.end_year] = {
        intensity: 0,
        relevance: 0,
        likelihood: 0,
        count: 0,
      };
    }
    yearMap[item.end_year].intensity += item.intensity || 0;
    yearMap[item.end_year].count += 1;
  });

  const yearData = Object.entries(yearMap).map(([year, v]) => ({
    year,
    intensity: +(v.intensity / v.count).toFixed(2),
  }));

  const barData = data
    .filter((d) => d.country)
    .slice(0, 8)
    .map((d) => ({
      name: d.country,
      value: d.intensity || 0,
    }));

  const pieData = data
    .filter((d) => d.topic)
    .slice(0, 6)
    .map((d) => ({
      name: d.topic,
      value: 1,
    }));

  /* ---------------- CHART THEME (DARK SAFE) ---------------- */

  const axisColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--text-color")
    .trim();

  const gridColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--border-color")
    .trim();

  const commonOptions = {
    plugins: {
      legend: {
        labels: {
          color: axisColor,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: axisColor },
        grid: { color: gridColor },
      },
      y: {
        ticks: { color: axisColor },
        grid: { color: gridColor },
      },
    },
  };

  const lineChartData = {
    labels: yearData.map((d) => d.year),
    datasets: [
      {
        label: "Intensity",
        data: yearData.map((d) => d.intensity),
        borderColor: "#7367f0",
        backgroundColor: "rgba(115,103,240,0.25)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: barData.map((d) => d.name),
    datasets: [
      {
        label: "Intensity",
        data: barData.map((d) => d.value),
        backgroundColor: "#28c76f",
      },
    ],
  };

  const pieChartData = {
    labels: pieData.map((d) => d.name),
    datasets: [
      {
        data: pieData.map((d) => d.value),
        backgroundColor: [
          "#7367f0",
          "#28c76f",
          "#ff9f43",
          "#ea5455",
          "#00cfe8",
          "#82868b",
        ],
      },
    ],
  };

  if (loading) {
    return <div className="page-bg p-5">Loading...</div>;
  }

  return (
    <Layout>
      <div className="page-bg">
        <div className="mb-4">
          <h4 className="fw-bold">Analytics Dashboard</h4>
        </div>

        <div className="row g-4">
          <div className="col-xl-6">
            <div className="theme-card p-3">
              <h6>Line Chart (Trend)</h6>
              <Line data={lineChartData} options={commonOptions} />
            </div>
          </div>

          <div className="col-xl-6">
            <div className="theme-card p-3">
              <h6>Bar Chart</h6>
              <Bar data={barChartData} options={commonOptions} />
            </div>
          </div>

          <div className="col-xl-6">
            <div className="theme-card p-3">
              <h6>Pie Chart</h6>
              <Pie data={pieChartData} />
            </div>
          </div>

          <div className="col-xl-6">
            <div className="theme-card p-3">
              <h6>Area Chart</h6>
              <Line data={lineChartData} options={commonOptions} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChartPage;

