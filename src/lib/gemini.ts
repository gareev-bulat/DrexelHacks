import { GoogleGenerativeAI } from '@google/generative-ai';

// Get the API key from environment variables
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

interface NewsArticle {
  id: number;
  title: string;
  source: string;
  date: string;
  impact: "positive" | "negative" | "neutral";
  stocks: string[];
  summary?: string;
  credibility?: number;
  importance?: number;
  relatedArticles?: string[];
}

function parseNewsText(text: string): NewsArticle[] {
  const articles: NewsArticle[] = [];
  const lines = text.split('\n');
  let currentArticle: Partial<NewsArticle> = {};
  let id = 1;

  for (const line of lines) {
    if (line.toLowerCase().includes('title:')) {
      if (Object.keys(currentArticle).length > 0) {
        articles.push({ ...currentArticle, id } as NewsArticle);
        id++;
        currentArticle = {};
      }
      currentArticle.title = line.split(':')[1].trim();
    } else if (line.toLowerCase().includes('source:')) {
      currentArticle.source = line.split(':')[1].trim();
    } else if (line.toLowerCase().includes('date:')) {
      currentArticle.date = line.split(':')[1].trim();
    } else if (line.toLowerCase().includes('impact:')) {
      const impact = line.split(':')[1].trim().toLowerCase();
      currentArticle.impact = (impact === 'positive' || impact === 'negative' || impact === 'neutral') 
        ? impact as "positive" | "negative" | "neutral"
        : "neutral";
    } else if (line.toLowerCase().includes('stocks:')) {
      const stocks = line.split(':')[1].trim().split(',').map(s => s.trim());
      currentArticle.stocks = stocks;
    } else if (line.toLowerCase().includes('summary:')) {
      currentArticle.summary = line.split(':')[1].trim();
    } else if (line.toLowerCase().includes('credibility:')) {
      const credibility = parseInt(line.split(':')[1].trim());
      currentArticle.credibility = isNaN(credibility) ? undefined : credibility;
    } else if (line.toLowerCase().includes('importance:')) {
      const importance = parseInt(line.split(':')[1].trim());
      currentArticle.importance = isNaN(importance) ? undefined : importance;
    } else if (line.toLowerCase().includes('related:')) {
      const related = line.split(':')[1].trim().split('|').map(s => s.trim());
      currentArticle.relatedArticles = related;
    }
  }

  // Add the last article if exists
  if (Object.keys(currentArticle).length > 0) {
    articles.push({ ...currentArticle, id } as NewsArticle);
  }

  return articles;
}

export async function fetchNewsArticles(): Promise<NewsArticle[]> {
  try {
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      return [];
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Generate 5 recent news articles about major tech companies (AAPL, MSFT, TSLA, AMZN, GOOGL).
    For each article, provide the following information in this exact format:
    
    Title: [Article title]
    Source: [News source name]
    Date: [YYYY-MM-DD]
    Impact: [positive/negative/neutral]
    Stocks: [TICKER1, TICKER2]
    Summary: [2-3 sentence summary of the article]
    Credibility: [0-100 score based on source reliability]
    Importance: [1-5 score based on market impact]
    Related: [Related article title 1|Related article title 2]
    
    Make sure:
    1. Use real, recent news events
    2. Include diverse sources (Reuters, Bloomberg, CNBC, etc.)
    3. Mix positive, negative, and neutral impacts
    4. Include relevant stock tickers
    5. Use dates from the last 7 days
    6. Provide accurate credibility scores based on source reputation
    7. Assess importance based on potential market impact
    8. Include relevant related articles
    9. Separate each article with a blank line`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const articles = parseNewsText(text);
    
    // Validate the articles
    const validArticles = articles.filter(article => 
      article.id &&
      article.title &&
      article.source &&
      article.date &&
      article.impact &&
      Array.isArray(article.stocks) &&
      article.stocks.length > 0
    );
    
    return validArticles;
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return [];
  }
} 