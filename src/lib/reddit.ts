import axios from 'axios';

interface RedditPost {
  title: string;
  content: string;
  company: string;
  date: string;
  subreddit: string;
  score: number;
  url: string;
}

interface RedditResponse {
  data: {
    children: Array<{
      data: {
        title: string;
        selftext: string;
        created_utc: number;
        subreddit: string;
        score: number;
        permalink: string;
      }
    }>
  }
}

const REDDIT_API_BASE = 'https://www.reddit.com';

// Company to subreddit mapping
const COMPANY_SUBREDDITS: { [key: string]: string[] } = {
  'AAPL': ['apple', 'investing', 'stocks'],
  'MSFT': ['microsoft', 'investing', 'stocks'],
  'TSLA': ['teslamotors', 'investing', 'stocks'],
  'AMZN': ['amazon', 'investing', 'stocks'],
  'GOOGL': ['google', 'investing', 'stocks']
};

export async function fetchRedditPosts(company: string, limit: number = 100): Promise<RedditPost[]> {
  const subreddits = COMPANY_SUBREDDITS[company] || [];
  const posts: RedditPost[] = [];

  for (const subreddit of subreddits) {
    try {
      const response = await axios.get<RedditResponse>(
        `${REDDIT_API_BASE}/r/${subreddit}/search.json`,
        {
          params: {
            q: company,
            sort: 'new',
            limit: limit,
            restrict_sr: 'on',
            t: 'year'
          },
          headers: {
            'User-Agent': 'StockSense/1.0'
          }
        }
      );

      const redditPosts = response.data.data.children.map(post => ({
        title: post.data.title,
        content: post.data.selftext,
        company: company,
        date: new Date(post.data.created_utc * 1000).toISOString().split('T')[0],
        subreddit: post.data.subreddit,
        score: post.data.score,
        url: `https://reddit.com${post.data.permalink}`
      }));

      posts.push(...redditPosts);
    } catch (error) {
      console.error(`Error fetching posts from r/${subreddit}:`, error);
      // Continue with other subreddits even if one fails
      continue;
    }
  }

  return posts;
}

export async function fetchAllCompanyPosts(): Promise<RedditPost[]> {
  const allPosts: RedditPost[] = [];
  
  for (const company of Object.keys(COMPANY_SUBREDDITS)) {
    try {
      const posts = await fetchRedditPosts(company);
      allPosts.push(...posts);
    } catch (error) {
      console.error(`Error fetching posts for ${company}:`, error);
      // Continue with other companies even if one fails
      continue;
    }
  }

  return allPosts;
} 