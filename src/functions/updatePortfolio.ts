import { GoogleGenAI } from "@google/genai";


export async function updatePortfolio() {
  const alpacaKey = process.env.ALPACA_KEY;
  const alpacaSecret = process.env.ALPACA_SECRET;
  const geminiKey = process.env.GEMINI_KEY;

  if (!alpacaKey || !alpacaSecret || !geminiKey) {
    return;
  }

  const ai = new GoogleGenAI({ apiKey: geminiKey }); 
  
  try {
    const portfolioResponse = await fetch('https://paper-api.alpaca.markets/v2/positions', {
      headers: {
        'APCA-API-KEY-ID': alpacaKey,
        'APCA-API-SECRET-KEY': alpacaSecret
      }
    });
    
    if (!portfolioResponse.ok) {
      throw new Error(`Failed to fetch portfolio: ${portfolioResponse.statusText}`);
    }
    
    const currentPortfolio = await portfolioResponse.json();
    
    const portfolioMap = currentPortfolio.reduce((acc, position) => {
      acc[position.symbol] = {
        quantity: parseFloat(position.qty),
        marketValue: parseFloat(position.market_value)
      };
      return acc;
    }, {});
        
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

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: geminiPrompt,
    });

    const recommendationsText = response.text();
    
    const jsonStartIndex = recommendationsText.indexOf('[');
    const jsonEndIndex = recommendationsText.lastIndexOf(']') + 1;
    const jsonString = recommendationsText.substring(jsonStartIndex, jsonEndIndex);
    
    const recommendations = JSON.parse(jsonString);
    
    const transactions = [];
    
    for (const recommendation of recommendations) {
      const { ticker: symbol, recommendation: action } = recommendation;
      
      switch (action.toLowerCase()) {
        case 'sell':
          if (portfolioMap[symbol] && portfolioMap[symbol].quantity > 0) {
            const sellResponse = await fetch('https://paper-api.alpaca.markets/v2/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'APCA-API-KEY-ID': alpacaKey,
                'APCA-API-SECRET-KEY': alpacaSecret
              },
              body: JSON.stringify({
                symbol,
                qty: portfolioMap[symbol].quantity,
                side: 'sell',
                type: 'market',
                time_in_force: 'day'
              })
            });
            
            if (sellResponse.ok) {
              const orderResult = await sellResponse.json();
              transactions.push({
                type: 'sell',
                symbol,
                quantity: portfolioMap[symbol].quantity,
                orderId: orderResult.id,
                timestamp: new Date(),
                reasoning: recommendation.reasoning
              });
            }
          }
          break;
          
        case 'hold':
          break;
          
        case 'buy':
          const accountResponse = await fetch('https://paper-api.alpaca.markets/v2/account', {
            headers: {
              'APCA-API-KEY-ID': alpacaKey,
              'APCA-API-SECRET-KEY': alpacaSecret
            }
          });
          
          if (accountResponse.ok) {
            const account = await accountResponse.json();
            const buyingPower = parseFloat(account.buying_power);
            
            const quoteResponse = await fetch(`https://paper-api.alpaca.markets/v2/stocks/${symbol}/quotes/latest`, {
              headers: {
                'APCA-API-KEY-ID': alpacaKey,
                'APCA-API-SECRET-KEY': alpacaSecret
              }
            });
            
            if (quoteResponse.ok) {
              const quote = await quoteResponse.json();
              const currentPrice = quote.quote.ap || quote.quote.bp;
              
              const allocationAmount = buyingPower * 0.05;
              const sharesToBuy = Math.floor(allocationAmount / currentPrice);
              
              if (sharesToBuy > 0) {
                const buyResponse = await fetch('https://paper-api.alpaca.markets/v2/orders', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'APCA-API-KEY-ID': alpacaKey,
                    'APCA-API-SECRET-KEY': alpacaSecret
                  },
                  body: JSON.stringify({
                    symbol,
                    qty: sharesToBuy,
                    side: 'buy',
                    type: 'market',
                    time_in_force: 'day'
                  })
                });
                
                if (buyResponse.ok) {
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
                }
              }
            }
          }
          break;
      }
    }
    
    await fetch(`${process.env.MONGODB_API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MONGODB_API_KEY}`
      },
      body: JSON.stringify({
        transactions,
        recommendations
      })
    });
    
    return {
      success: true,
      transactions,
      recommendations
    };
    
  } catch (error: any) {
    console.error('Error updating portfolio:', error);
    return {
      success: false,
      error: error.message
    };
  }
}