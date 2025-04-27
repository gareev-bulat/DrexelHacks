"use client"

import { TPortfolioData } from "@/app/dashboard/page";

interface StockHistory {
  date: string;
  price: number;
}

interface AlpacaPosition {
  symbol: string;
  qty: string;
  current_price: string;
  avg_entry_price: string;
  change_today: string;
  market_value: string;
}

export async function fetchPositions(): Promise<TPortfolioData[]> {
  if (!process.env.NEXT_PUBLIC_ALPACA_KEY || !process.env.NEXT_PUBLIC_ALPACA_SECRET) {
    console.log(process.env.NEXT_PUBLIC_ALPACA_KEY, process.env.NEXT_PUBLIC_ALPACA_SECRET)
    return []
  }
  const response = await fetch('https://paper-api.alpaca.markets/v2/positions', {
    method: 'GET',
    headers: {
      'APCA-API-KEY-ID': process.env.NEXT_PUBLIC_ALPACA_KEY,
      'APCA-API-SECRET-KEY': process.env.NEXT_PUBLIC_ALPACA_SECRET,
      'accept': 'application/json',
    },
  })
  
  if (!response.ok) {
    console.error('Failed to fetch positions:', response.status, response.statusText);
    return []
  }

  const positionsData = await response.json();
  const fetchStockHistory = async (symbol: string, isCrypto: boolean): Promise<StockHistory[]> => {
    let historyResponse = undefined
    const end = new Date().toISOString();
    const start = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
    if (isCrypto) {
      const newSymbolForFetch = symbol.replace(/(.*)(usd)$/i, '$1%2F$2');
      const newSymbolForHistory = symbol.replace(/(.*)(usd)$/i, '$1/$2');

      historyResponse = await fetch(`https://data.alpaca.markets/v1beta3/crypto/us/bars?symbols=${newSymbolForFetch}&timeframe=1Day&start=${start}&end=${end}&limit=1000&sort=asc`, {
        method: 'GET',
        headers: {
          'APCA-API-KEY-ID': process.env.NEXT_PUBLIC_ALPACA_KEY as string,
          'APCA-API-SECRET-KEY': process.env.NEXT_PUBLIC_ALPACA_SECRET as string,
          'accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        console.error(`Failed to fetch history for ${symbol}:`, response.status, response.statusText);
        return [];
      }
      symbol = newSymbolForHistory
    } else {
      historyResponse = await fetch(`https://data.alpaca.markets/v2/stocks/${symbol}/bars?start=${start}&end=${end}&timeframe=1Day`, {
        headers: {
          'APCA-API-KEY-ID': process.env.NEXT_PUBLIC_ALPACA_KEY as string,
          'APCA-API-SECRET-KEY': process.env.NEXT_PUBLIC_ALPACA_SECRET as string,
          'accept': 'application/json',
        },
      });
    }

    if (!historyResponse?.ok) {
      console.error(`Failed to fetch history for ${symbol}:`, historyResponse?.status, historyResponse?.statusText);
      return [];
    }

    const historyData = await historyResponse.json();
    const bars = isCrypto ? historyData.bars[symbol] : historyData.bars;
    
    return bars.map((bar: { t: string; c: number }) => ({
      date: bar.t,
      price: bar.c,
    }));
  };

  const positions: TPortfolioData[] = await Promise.all(
    positionsData.map(async (position: AlpacaPosition) => {
      const isCrypto = position.symbol.toLowerCase().endsWith('usd');
      const history = await fetchStockHistory(position.symbol, isCrypto);
      
      return {
        symbol: position.symbol,
        name: position.symbol,
        shares: parseFloat(position.qty),
        avgPrice: parseFloat(position.avg_entry_price),
        currentPrice: parseFloat(position.current_price),
        change: parseFloat(position.change_today),
        changePercent: (parseFloat(position.change_today) / parseFloat(position.current_price)) * 100,
        value: parseFloat(position.market_value),
        history,
        assetClass: isCrypto ? 'crypto' : 'stock',
      };
    })
  );

  return positions;
}