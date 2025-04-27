import yfinance from 'yfinance';

interface StockData {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  value: number;
  history: { date: string; price: number }[];
}

export async function fetchStockData(symbols: string[]): Promise<StockData[]> {
  const stockData: StockData[] = [];

  for (const symbol of symbols) {
    try {
      const stock = await yfinance.ticker(symbol);
      const info = await stock.info;
      const history = await stock.history({ period: '1y' });

      const currentPrice = info.currentPrice;
      const previousClose = info.previousClose;
      const change = currentPrice - previousClose;
      const changePercent = (change / previousClose) * 100;

      // Mock shares for now - you can replace this with actual user portfolio data
      const shares = Math.floor(Math.random() * 100) + 1;
      const avgPrice = previousClose * 0.95; // Mock average price

      stockData.push({
        symbol: symbol,
        name: info.longName || info.shortName || symbol,
        shares: shares,
        avgPrice: avgPrice,
        currentPrice: currentPrice,
        change: change,
        changePercent: changePercent,
        value: currentPrice * shares,
        history: history.map((item: any) => ({
          date: item.date.toISOString().split('T')[0],
          price: item.close
        }))
      });
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
    }
  }

  return stockData;
}

// Example usage:
// const symbols = ['AAPL', 'MSFT', 'AMZN', 'GOOGL', 'TSLA'];
// const data = await fetchStockData(symbols); 