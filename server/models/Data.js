import mongoose from 'mongoose';

const dataSchema = mongoose.Schema(
  {
    end_year: Number,
    intensity: Number,
    sector: String,
    topic: String,
    insight: String,
    url: String,
    region: String,
    start_year: String,
    impact: String,
    added: String,
    published: String,
    country: String,
    relevance: Number,
    pestle: String,
    source: String,
    title: String,
    likelihood: Number,
    city: String,
  },
  {
    timestamps: false,
  }
);

const Data = mongoose.model('Data', dataSchema);

export default Data;


