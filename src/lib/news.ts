import connectDB from '@/lib/mongodb';
import News from '@/models/News';
import Sentiment from 'sentiment';

const analyzer = new Sentiment();

export async function saveNewsWithSentiment(newsData: {
  title: string;
  content: string;
  source: string;
  url: string;
  publishedAt: Date;
}) {
  try {
    await connectDB();
    
    // Calculate sentiment
    const sentiment = analyzer.analyze(newsData.content).score;
    
    // Create news document with sentiment
    const news = new News({
      ...newsData,
      sentiment,
    });
    
    // Save to MongoDB
    await news.save();
    
    return news;
  } catch (error) {
    console.error('Error saving news:', error);
    throw error;
  }
}

export async function getNewsWithSentiment() {
  try {
    await connectDB();
    
    // Get all news sorted by published date
    const news = await News.find()
      .sort({ publishedAt: -1 })
      .limit(100);
    
    return news;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
} 