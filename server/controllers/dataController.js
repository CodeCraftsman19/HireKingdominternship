import Data from '../models/Data.js';

// @desc    Get all data with filters
// @route   GET /api/data
// @access  Private
export const getData = async (req, res) => {
  try {
    const {
      end_year,
      topics,
      sector,
      region,
      pestle,
      source,
      country,
      city,
      limit = 1000,
      skip = 0,
    } = req.query;

    // Build filter object
    const filter = {};

    if (end_year) {
      filter.end_year = parseInt(end_year);
    }
    if (sector) {
      filter.sector = sector;
    }
    if (region) {
      filter.region = region;
    }
    if (pestle) {
      filter.pestle = pestle;
    }
    if (source) {
      filter.source = source;
    }
    if (country) {
      filter.country = country;
    }
    if (city) {
      filter.city = city;
    }
    if (topics) {
      filter.topic = topics;
    }

    const data = await Data.find(filter)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Data.countDocuments(filter);

    res.json({
      success: true,
      count: data.length,
      total,
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get aggregated statistics
// @route   GET /api/data/stats
// @access  Private
export const getStats = async (req, res) => {
  try {
    const stats = await Data.aggregate([
      {
        $group: {
          _id: null,
          avgIntensity: { $avg: '$intensity' },
          avgLikelihood: { $avg: '$likelihood' },
          avgRelevance: { $avg: '$relevance' },
          totalRecords: { $sum: 1 },
          minYear: { $min: '$end_year' },
          maxYear: { $max: '$end_year' },
        },
      },
    ]);

    res.json({
      success: true,
      stats: stats[0] || {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get unique values for filters
// @route   GET /api/data/filters
// @access  Private
export const getFilters = async (req, res) => {
  try {
    const [endYears, sectors, regions, pestles, sources, countries, cities, topics] = await Promise.all([
      Data.distinct('end_year').then((years) => years.filter((y) => y !== null).sort((a, b) => b - a)),
      Data.distinct('sector').then((s) => s.filter((x) => x !== null && x !== '')),
      Data.distinct('region').then((r) => r.filter((x) => x !== null && x !== '')),
      Data.distinct('pestle').then((p) => p.filter((x) => x !== null && x !== '')),
      Data.distinct('source').then((s) => s.filter((x) => x !== null && x !== '')),
      Data.distinct('country').then((c) => c.filter((x) => x !== null && x !== '')),
      Data.distinct('city').then((c) => c.filter((x) => x !== null && x !== '')),
      Data.distinct('topic').then((t) => t.filter((x) => x !== null && x !== '')),
    ]);

    res.json({
      success: true,
      filters: {
        endYears,
        sectors,
        regions,
        pestles,
        sources,
        countries,
        cities,
        topics,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get data grouped by various fields for visualization
// @route   GET /api/data/grouped
// @access  Private
export const getGroupedData = async (req, res) => {
  try {
    const { groupBy = 'country' } = req.query;

    const groupedData = await Data.aggregate([
      {
        $match: {
          [groupBy]: { $exists: true, $ne: null, $ne: '' },
        },
      },
      {
        $group: {
          _id: `$${groupBy}`,
          avgIntensity: { $avg: '$intensity' },
          avgLikelihood: { $avg: '$likelihood' },
          avgRelevance: { $avg: '$relevance' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 20,
      },
    ]);

    res.json({
      success: true,
      groupBy,
      data: groupedData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


