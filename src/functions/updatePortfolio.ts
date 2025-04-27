"use client"

import { GoogleGenAI } from "@google/genai";

// Define types for better type safety
interface Position {
  symbol: string;
  qty: string;
  market_value: string;
}

interface PortfolioMap {
  [symbol: string]: {
    quantity: number;
    marketValue: number;
  };
}

interface StockRecommendation {
  ticker: string;
  recommendation: 'buy' | 'hold' | 'sell';
  reasoning: string;
  sources: string[];
}

interface Transaction {
  type: 'buy' | 'sell';
  symbol: string;
  quantity: number;
  price?: number;
  orderId: string;
  timestamp: Date;
  reasoning: string;
}

interface UpdateResult {
  success: boolean;
  transactions?: Transaction[];
  recommendations?: StockRecommendation[];
  error?: string;
}

export async function updatePortfolio(): Promise<UpdateResult> {
  // Get environment variables
  const alpacaKey = process.env.NEXT_PUBLIC_ALPACA_KEY;
  const alpacaSecret = process.env.NEXT_PUBLIC_ALPACA_SECRET;
  const geminiKey = process.env.NEXT_PUBLIC_GEMINI_KEY;

  // Validate API keys exist
  if (!alpacaKey || !alpacaSecret || !geminiKey) {
    return {
      success: false,
      error: "Missing API keys in environment variables"
    };
  }

  const alpacaBaseUrl = 'https://paper-api.alpaca.markets/v2';
  const alpacaHeaders = {
    'APCA-API-KEY-ID': alpacaKey,
    'APCA-API-SECRET-KEY': alpacaSecret,
    'Content-Type': 'application/json'
  };

  const ai = new GoogleGenAI({ apiKey: geminiKey });
  const transactions: Transaction[] = [];
  
  try {
    // Fetch current portfolio
    const portfolioResponse = await fetch(`${alpacaBaseUrl}/positions`, {
      headers: alpacaHeaders
    });
    
    if (!portfolioResponse.ok) {
      throw new Error(`Failed to fetch portfolio: ${portfolioResponse.status} ${portfolioResponse.statusText}`);
    }
    
    const currentPortfolio: Position[] = await portfolioResponse.json();
    
    // Build portfolio map for easier access
    const portfolioMap: PortfolioMap = currentPortfolio.reduce((acc, position) => {
      acc[position.symbol] = {
        quantity: parseFloat(position.qty),
        marketValue: parseFloat(position.market_value)
      };
      return acc;
    }, {} as PortfolioMap);

    // Get recommendations from Gemini AI
    const recommendations = await getAIRecommendations(ai);
    
    // Execute trades based on recommendations
    for (const recommendation of recommendations) {
      await executeTradeStrategy(
        recommendation,
        portfolioMap,
        alpacaBaseUrl,
        alpacaHeaders,
        transactions
      );
    }
    
    // Store transaction data
    await storeTransactionData(transactions, recommendations);
    
    return {
      success: true,
      transactions,
      recommendations
    };
    
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

async function getAIRecommendations(ai: GoogleGenAI): Promise<StockRecommendation[]> {
  const geminiPrompt = `
You are a highly skilled AI financial analyst tasked with analyzing today's major financial news and providing stock recommendations. Your analysis should be comprehensive, covering a wide range of news sources and affected stocks. Make sure to gather relevant information from reputable financial news websites and other credible sources.
Follow these steps to complete your task:
1. Search for today's major financial news from reputable sources.
2. Identify a large number of stock tickers significantly impacted by the news.
3. For each identified ticker:
   a. Categorize it as "buy", "hold", or "sell" based on your analysis.
   b. Gather information from web sources to support your categorization, and provide a concise but informative reasoning based on the gathered data. Include the URLs of the sources used in the reasoning.
Your final output must be a valid JSON array with the following structure:
\`\`\`json
[
  {
    "ticker": "<stock_ticker>",
    "recommendation": "<buy|hold|sell>",
    "reasoning": "<brief_reasoning>",
    "sources": [
      "<source_url_1>",
      "<source_url_2>",
      ...
    ]
  },
  ...
]
\`\`\``;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: geminiPrompt,
    });

    if (!response || !response.text) {
      throw new Error("Failed to get recommendations from AI model");
    }

    const recommendationsText = response.text;
    
    // Extract JSON content from the response
    const jsonStartIndex = recommendationsText.indexOf('[');
    const jsonEndIndex = recommendationsText.lastIndexOf(']') + 1;
    
    if (jsonStartIndex === -1 || jsonEndIndex === 0) {
      throw new Error("AI response doesn't contain valid JSON array");
    }
    
    const jsonString = recommendationsText.substring(jsonStartIndex, jsonEndIndex);
    
    try {
      return JSON.parse(jsonString) as StockRecommendation[];
    } catch (e) {
      throw new Error(`Failed to parse AI recommendations: ${e instanceof Error ? e.message : 'Invalid JSON'}`);
    }
  } catch (error) {
    console.error("Error getting AI recommendations:", error);
    throw error;
  }
}

async function executeTradeStrategy(
  recommendation: StockRecommendation,
  portfolioMap: PortfolioMap,
  alpacaBaseUrl: string,
  alpacaHeaders: Record<string, string>,
  transactions: Transaction[]
): Promise<void> {
  const { ticker: symbol, recommendation: action } = recommendation;
  
  try {
    switch (action.toLowerCase()) {
      case 'sell':
        await handleSellRecommendation(symbol, recommendation, portfolioMap, alpacaBaseUrl, alpacaHeaders, transactions);
        break;
          
      case 'buy':
        await handleBuyRecommendation(symbol, recommendation, alpacaBaseUrl, alpacaHeaders, transactions);
        break;
          
      case 'hold':
        // No action needed for hold recommendations
        break;
        
      default:
        console.warn(`Unknown recommendation action: ${action} for ${symbol}`);
    }
  } catch (error) {
    console.error(`Error executing trade strategy for ${symbol}:`, error);
    // Continue with other recommendations rather than stopping execution
  }
}

async function handleSellRecommendation(
  symbol: string,
  recommendation: StockRecommendation,
  portfolioMap: PortfolioMap,
  alpacaBaseUrl: string,
  alpacaHeaders: Record<string, string>,
  transactions: Transaction[]
): Promise<void> {
  // Only sell if we actually own the stock
  if (portfolioMap[symbol] && portfolioMap[symbol].quantity > 0) {
    try {
      const sellResponse = await fetch(`${alpacaBaseUrl}/orders`, {
        method: 'POST',
        headers: alpacaHeaders,
        body: JSON.stringify({
          symbol,
          qty: portfolioMap[symbol].quantity,
          side: 'sell',
          type: 'market',
          time_in_force: 'day'
        })
      });
      
      if (!sellResponse.ok) {
        const errorData = await sellResponse.json().catch(() => ({}));
        throw new Error(`Failed to place sell order: ${sellResponse.status} ${sellResponse.statusText} ${JSON.stringify(errorData)}`);
      }
      
      const orderResult = await sellResponse.json();
      transactions.push({
        type: 'sell',
        symbol,
        quantity: portfolioMap[symbol].quantity,
        orderId: orderResult.id,
        timestamp: new Date(),
        reasoning: recommendation.reasoning
      });
    } catch (error) {
      console.error(`Error selling ${symbol}:`, error);
      throw error;
    }
  }
}

async function handleBuyRecommendation(
  symbol: string,
  recommendation: StockRecommendation,
  alpacaBaseUrl: string,
  alpacaHeaders: Record<string, string>,
  transactions: Transaction[]
): Promise<void> {
  try {
    // Get account information to determine buying power
    const accountResponse = await fetch(`${alpacaBaseUrl}/account`, {
      headers: alpacaHeaders
    });
    
    if (!accountResponse.ok) {
      throw new Error(`Failed to fetch account: ${accountResponse.status} ${accountResponse.statusText}`);
    }
    
    const account = await accountResponse.json();
    const buyingPower = parseFloat(account.buying_power);
    
    if (buyingPower <= 0) {
      console.log(`Insufficient buying power to purchase ${symbol}`);
      return;
    }
    
    // Get current stock price
    const quoteResponse = await fetch(`${alpacaBaseUrl}/v2/stocks/${symbol}/trades/latest`, {
      headers: alpacaHeaders
    });
    console.log(quoteResponse)
    if (!quoteResponse.ok) {
      throw new Error(`Failed to fetch quote for ${symbol}: ${quoteResponse.status} ${quoteResponse.statusText}`);
    }
    
    const quote = await quoteResponse.json();
    
    // Use ask price if available, otherwise bid price
    const currentPrice = quote.quote.ap || quote.quote.bp;
    
    if (!currentPrice || currentPrice <= 0) {
      throw new Error(`Invalid price for ${symbol}: ${currentPrice}`);
    }
    
    // Allocate 5% of buying power to this stock
    const allocationAmount = buyingPower * 0.05;
    const sharesToBuy = Math.floor(allocationAmount / currentPrice);
    
    if (sharesToBuy <= 0) {
      console.log(`Not enough buying power to purchase at least one share of ${symbol}`);
      return;
    }
    
    // Place buy order
    const buyResponse = await fetch(`${alpacaBaseUrl}/orders`, {
      method: 'POST',
      headers: alpacaHeaders,
      body: JSON.stringify({
        symbol,
        qty: sharesToBuy,
        side: 'buy',
        type: 'market',
        time_in_force: 'day'
      })
    });
    
    if (!buyResponse.ok) {
      const errorData = await buyResponse.json().catch(() => ({}));
      throw new Error(`Failed to place buy order: ${buyResponse.status} ${buyResponse.statusText} ${JSON.stringify(errorData)}`);
    }
    
    const orderResult = await buyResponse.json();
    transactions.push({
      type: 'buy',
      symbol,
      quantity: sharesToBuy,
      price: currentPrice,
      orderId: orderResult.id,
      timestamp: new Date(),
      reasoning: recommendation.reasoning
    });
  } catch (error) {
    console.error(`Error buying ${symbol}:`, error);
    throw error;
  }
}

async function storeTransactionData(
  transactions: Transaction[],
  recommendations: StockRecommendation[]
): Promise<void> {
  const mongodbApiUrl = process.env.MONGODB_API_URL;
  
  if (!mongodbApiUrl) {
    throw new Error("Missing MongoDB API configuration");
  }
  
  try {
    const storeResponse = await fetch(`${mongodbApiUrl}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactions,
        recommendations
      })
    });
    
    if (!storeResponse.ok) {
      throw new Error(`Failed to store transaction data: ${storeResponse.status} ${storeResponse.statusText}`);
    }
  } catch (error) {
    console.error("Error storing transaction data:", error);
    throw error;
  }
}