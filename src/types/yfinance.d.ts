declare module 'yfinance' {
  interface TickerInfo {
    currentPrice: number;
    previousClose: number;
    longName?: string;
    shortName?: string;
  }

  interface Ticker {
    info: Promise<TickerInfo>;
    history(options: { period: string }): Promise<Array<{
      date: Date;
      close: number;
    }>>;
  }

  function ticker(symbol: string): Ticker;

  export { ticker };
} 