import connectDB from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';

const portfolioData = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 15,
    avgPrice: 145.32,
    currentPrice: 178.61,
    change: 2.34,
    changePercent: 1.33,
    value: 2679.15,
    history: [
      { date: "2023-01-01", price: 130.21 },
      { date: "2023-02-01", price: 143.8 },
      { date: "2023-03-01", price: 151.03 },
      { date: "2023-04-01", price: 165.21 },
      { date: "2023-05-01", price: 173.57 },
      { date: "2023-06-01", price: 180.95 },
      { date: "2023-07-01", price: 175.84 },
      { date: "2023-08-01", price: 178.61 },
    ],
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    shares: 10,
    avgPrice: 240.11,
    currentPrice: 337.94,
    change: -1.23,
    changePercent: -0.36,
    value: 3379.4,
    history: [
      { date: "2023-01-01", price: 239.58 },
      { date: "2023-02-01", price: 252.75 },
      { date: "2023-03-01", price: 275.23 },
      { date: "2023-04-01", price: 288.8 },
      { date: "2023-05-01", price: 305.56 },
      { date: "2023-06-01", price: 328.6 },
      { date: "2023-07-01", price: 340.54 },
      { date: "2023-08-01", price: 337.94 },
    ],
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    shares: 8,
    avgPrice: 102.53,
    currentPrice: 138.12,
    change: 1.87,
    changePercent: 1.37,
    value: 1104.96,
    history: [
      { date: "2023-01-01", price: 98.12 },
      { date: "2023-02-01", price: 103.39 },
      { date: "2023-03-01", price: 98.7 },
      { date: "2023-04-01", price: 106.96 },
      { date: "2023-05-01", price: 120.58 },
      { date: "2023-06-01", price: 130.36 },
      { date: "2023-07-01", price: 133.68 },
      { date: "2023-08-01", price: 138.12 },
    ],
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    shares: 12,
    avgPrice: 95.44,
    currentPrice: 129.66,
    change: 0.78,
    changePercent: 0.6,
    value: 1555.92,
    history: [
      { date: "2023-01-01", price: 88.73 },
      { date: "2023-02-01", price: 94.86 },
      { date: "2023-03-01", price: 103.71 },
      { date: "2023-04-01", price: 108.22 },
      { date: "2023-05-01", price: 122.76 },
      { date: "2023-06-01", price: 119.7 },
      { date: "2023-07-01", price: 125.42 },
      { date: "2023-08-01", price: 129.66 },
    ],
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    shares: 20,
    avgPrice: 190.72,
    currentPrice: 215.49,
    change: -3.45,
    changePercent: -1.58,
    value: 4309.8,
    history: [
      { date: "2023-01-01", price: 113.06 },
      { date: "2023-02-01", price: 189.98 },
      { date: "2023-03-01", price: 207.46 },
      { date: "2023-04-01", price: 160.31 },
      { date: "2023-05-01", price: 203.93 },
      { date: "2023-06-01", price: 261.77 },
      { date: "2023-07-01", price: 274.43 },
      { date: "2023-08-01", price: 215.49 },
    ],
  },
];

async function seed() {
  try {
    await connectDB();
    await Portfolio.deleteMany({});
    await Portfolio.insertMany(portfolioData);
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed(); 