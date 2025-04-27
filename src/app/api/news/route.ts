import { NextResponse } from 'next/server';
import { saveNewsWithSentiment, getNewsWithSentiment } from '@/lib/news';

export async function POST(request: Request) {
  try {
    const newsData = await request.json();
    const news = await saveNewsWithSentiment(newsData);
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save news' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const news = await getNewsWithSentiment();
    return NextResponse.json(news);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
} 