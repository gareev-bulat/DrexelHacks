import mongoose from 'mongoose';

const HistorySchema = new mongoose.Schema({
  date: { type: String, required: true },
  price: { type: Number, required: true }
});

const PortfolioSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  shares: { type: Number, required: true },
  avgPrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  change: { type: Number, required: true },
  changePercent: { type: Number, required: true },
  value: { type: Number, required: true },
  history: [HistorySchema]
});

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema); 