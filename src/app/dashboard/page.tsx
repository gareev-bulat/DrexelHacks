"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from "recharts"
import { ArrowDown, ArrowUp, BarChart3, RefreshCw, Newspaper, Zap, TrendingUp, LogOut, Filter, ArrowUpDown, Star, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import SentimentAnalysis from "@/components/SentimentAnalysis"
import { fetchAllCompanyPosts } from '@/lib/reddit'
import { fetchNewsArticles } from '@/lib/gemini'
import { fetchPositions } from "@/functions/fetchPositions"
import { updatePortfolio } from "@/functions/updatePortfolio"


export type TPortfolioData = {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  change: number;
  changePercent: number;
  value: number;
  history: Array<{
    date: string;
    price: number;
  }>;
  assetClass: string,

}

interface StockData {
  symbol: string
  name: string
  shares: number
  avgPrice: number
  currentPrice: number
  change: number
  changePercent: number
  value: number
  history: { date: string; price: number }[]
}

interface RedditPost {
  title: string
  content: string
  company: string
  date: string
}

interface TNewsSource {
  id?: number
  title: string
  source: string
  date: string
  impact: "positive" | "negative" | "neutral"
  stocks: string[]
  summary?: string
  credibility?: number
  importance?: number
  relatedArticles?: string[]
}

// Mock Reddit posts data
const redditPosts: RedditPost[] = [
  // January 2024
  {
    title: "Apple's Vision Pro pre-orders exceed expectations",
    content: "Initial pre-order numbers for Apple's Vision Pro are breaking records, showing strong consumer interest.",
    company: "AAPL",
    date: "2024-01-15"
  },
  {
    title: "Microsoft's AI integration in Windows 12",
    content: "Early preview of Windows 12 shows deep AI integration across the operating system.",
    company: "MSFT",
    date: "2024-01-20"
  },
  {
    title: "Tesla's new factory in Mexico approved",
    content: "Local government has given the green light for Tesla's new manufacturing facility.",
    company: "TSLA",
    date: "2024-01-25"
  },
  {
    title: "Amazon's AWS continues to dominate cloud market",
    content: "AWS maintains its lead in cloud computing with innovative new services.",
    company: "AMZN",
    date: "2024-01-30"
  },
  {
    title: "Google's AI research breakthrough",
    content: "New research paper shows significant advancements in AI capabilities.",
    company: "GOOGL",
    date: "2024-01-05"
  },

  // February 2024
  {
    title: "Apple's new MacBook Pro with M3 chip announced",
    content: "Apple unveils new MacBook Pro models featuring the powerful M3 chip.",
    company: "AAPL",
    date: "2024-02-10"
  },
  {
    title: "Microsoft's Azure growth accelerates",
    content: "Microsoft reports strong growth in Azure cloud services.",
    company: "MSFT",
    date: "2024-02-15"
  },
  {
    title: "Tesla's Cybertruck production ramps up",
    content: "Tesla increases production of its highly anticipated Cybertruck.",
    company: "TSLA",
    date: "2024-02-20"
  },
  {
    title: "Amazon's Prime Video original content success",
    content: "Amazon's original content on Prime Video receives critical acclaim.",
    company: "AMZN",
    date: "2024-02-25"
  },
  {
    title: "Google's Pixel 8 Pro review roundup",
    content: "Early reviews praise Google's latest flagship smartphone.",
    company: "GOOGL",
    date: "2024-02-28"
  },

  // March 2024
  {
    title: "Apple's iOS 18 beta features leaked",
    content: "Major new features coming to iOS 18 revealed in early beta.",
    company: "AAPL",
    date: "2024-03-10"
  },
  {
    title: "Microsoft's Copilot AI assistant expands",
    content: "Microsoft expands Copilot AI assistant to more enterprise customers.",
    company: "MSFT",
    date: "2024-03-15"
  },
  {
    title: "Tesla's Full Self-Driving v12 review",
    content: "Early testers share their experiences with Tesla's latest FSD version.",
    company: "TSLA",
    date: "2024-03-20"
  },
  {
    title: "Amazon's drone delivery expansion",
    content: "Amazon expands drone delivery service to more cities.",
    company: "AMZN",
    date: "2024-03-25"
  },
  {
    title: "Google's Gemini AI improvements",
    content: "Google announces significant improvements to its Gemini AI model.",
    company: "GOOGL",
    date: "2024-03-30"
  },

  // April 2024
  {
    title: "Apple's Q2 earnings beat expectations",
    content: "Apple reports strong Q2 earnings, exceeding analyst predictions.",
    company: "AAPL",
    date: "2024-04-05"
  },
  {
    title: "Microsoft's gaming division growth",
    content: "Microsoft's gaming division shows strong growth with new acquisitions.",
    company: "MSFT",
    date: "2024-04-10"
  },
  {
    title: "Tesla's energy storage milestone",
    content: "Tesla reaches new milestone in energy storage deployment.",
    company: "TSLA",
    date: "2024-04-15"
  },
  {
    title: "Amazon's grocery delivery expansion",
    content: "Amazon expands grocery delivery service to new markets.",
    company: "AMZN",
    date: "2024-04-20"
  },
  {
    title: "Google's cloud computing growth",
    content: "Google Cloud shows strong growth in enterprise adoption.",
    company: "GOOGL",
    date: "2024-04-25"
  },

  // May 2024
  {
    title: "Apple's new iPad Pro with OLED display",
    content: "Apple announces new iPad Pro models with OLED displays.",
    company: "AAPL",
    date: "2024-05-05"
  },
  {
    title: "Microsoft's Surface Pro 10 launch",
    content: "Microsoft unveils new Surface Pro 10 with AI features.",
    company: "MSFT",
    date: "2024-05-10"
  },
  {
    title: "Tesla's new factory in India",
    content: "Tesla announces plans for new manufacturing facility in India.",
    company: "TSLA",
    date: "2024-05-15"
  },
  {
    title: "Amazon's healthcare expansion",
    content: "Amazon expands healthcare services to more states.",
    company: "AMZN",
    date: "2024-05-20"
  },
  {
    title: "Google's Android 15 preview",
    content: "Google releases first preview of Android 15.",
    company: "GOOGL",
    date: "2024-05-25"
  },

  // June 2024
  {
    title: "Apple's WWDC 2024 announcements",
    content: "Apple reveals major software updates at WWDC 2024.",
    company: "AAPL",
    date: "2024-06-05"
  },
  {
    title: "Microsoft's AI for Good initiative",
    content: "Microsoft expands AI for Good program with new partnerships.",
    company: "MSFT",
    date: "2024-06-10"
  },
  {
    title: "Tesla's battery technology breakthrough",
    content: "Tesla announces breakthrough in battery technology.",
    company: "TSLA",
    date: "2024-06-15"
  },
  {
    title: "Amazon's Prime Day 2024 success",
    content: "Amazon reports record-breaking Prime Day sales.",
    company: "AMZN",
    date: "2024-06-20"
  },
  {
    title: "Google's quantum computing milestone",
    content: "Google achieves new milestone in quantum computing.",
    company: "GOOGL",
    date: "2024-06-25"
  },

  // July 2024
  {
    title: "Apple's new iPhone 16 rumors",
    content: "Leaked details about Apple's upcoming iPhone 16.",
    company: "AAPL",
    date: "2024-07-05"
  },
  {
    title: "Microsoft's Windows 12 release date",
    content: "Microsoft announces Windows 12 release date.",
    company: "MSFT",
    date: "2024-07-10"
  },
  {
    title: "Tesla's new vehicle models",
    content: "Tesla unveils new vehicle models at annual event.",
    company: "TSLA",
    date: "2024-07-15"
  },
  {
    title: "Amazon's logistics network expansion",
    content: "Amazon expands its logistics network with new facilities.",
    company: "AMZN",
    date: "2024-07-20"
  },
  {
    title: "Google's AI ethics framework",
    content: "Google releases new AI ethics framework.",
    company: "GOOGL",
    date: "2024-07-25"
  },

  // August 2024
  {
    title: "Apple's services revenue growth",
    content: "Apple reports strong growth in services revenue.",
    company: "AAPL",
    date: "2024-08-05"
  },
  {
    title: "Microsoft's gaming subscription growth",
    content: "Microsoft's gaming subscription service reaches new milestone.",
    company: "MSFT",
    date: "2024-08-10"
  },
  {
    title: "Tesla's solar roof expansion",
    content: "Tesla expands solar roof installation to more states.",
    company: "TSLA",
    date: "2024-08-15"
  },
  {
    title: "Amazon's AI shopping assistant",
    content: "Amazon launches new AI-powered shopping assistant.",
    company: "AMZN",
    date: "2024-08-20"
  },
  {
    title: "Google's search algorithm update",
    content: "Google announces major search algorithm update.",
    company: "GOOGL",
    date: "2024-08-25"
  },

  // September 2024
  {
    title: "Apple's iPhone 16 launch event",
    content: "Apple announces new iPhone 16 lineup.",
    company: "AAPL",
    date: "2024-09-10"
  },
  {
    title: "Microsoft's Surface event",
    content: "Microsoft unveils new Surface devices.",
    company: "MSFT",
    date: "2024-09-15"
  },
  {
    title: "Tesla's AI Day 2024",
    content: "Tesla showcases latest AI and robotics developments.",
    company: "TSLA",
    date: "2024-09-20"
  },
  {
    title: "Amazon's hardware event",
    content: "Amazon announces new Echo and Fire devices.",
    company: "AMZN",
    date: "2024-09-25"
  },
  {
    title: "Google's Pixel 9 launch",
    content: "Google unveils new Pixel 9 smartphones.",
    company: "GOOGL",
    date: "2024-09-30"
  },

  // October 2024
  {
    title: "Apple's Q4 earnings report",
    content: "Apple reports strong Q4 earnings with record iPhone sales.",
    company: "AAPL",
    date: "2024-10-05"
  },
  {
    title: "Microsoft's cloud growth",
    content: "Microsoft Azure continues strong growth trajectory.",
    company: "MSFT",
    date: "2024-10-10"
  },
  {
    title: "Tesla's new factory plans",
    content: "Tesla announces plans for new manufacturing facilities.",
    company: "TSLA",
    date: "2024-10-15"
  },
  {
    title: "Amazon's holiday season preparation",
    content: "Amazon ramps up for holiday shopping season.",
    company: "AMZN",
    date: "2024-10-20"
  },
  {
    title: "Google's AI research breakthrough",
    content: "Google announces breakthrough in AI research.",
    company: "GOOGL",
    date: "2024-10-25"
  },

  // November 2024
  {
    title: "Apple's new MacBook Air",
    content: "Apple unveils new MacBook Air with M4 chip.",
    company: "AAPL",
    date: "2024-11-05"
  },
  {
    title: "Microsoft's AI integration",
    content: "Microsoft integrates AI across Office suite.",
    company: "MSFT",
    date: "2024-11-10"
  },
  {
    title: "Tesla's new vehicle features",
    content: "Tesla announces new features for existing vehicles.",
    company: "TSLA",
    date: "2024-11-15"
  },
  {
    title: "Amazon's Black Friday deals",
    content: "Amazon announces Black Friday deals and promotions.",
    company: "AMZN",
    date: "2024-11-20"
  },
  {
    title: "Google's AI assistant update",
    content: "Google announces major update to AI assistant.",
    company: "GOOGL",
    date: "2024-11-25"
  },

  // December 2024
  {
    title: "Apple's holiday sales",
    content: "Apple reports strong holiday season sales.",
    company: "AAPL",
    date: "2024-12-05"
  },
  {
    title: "Microsoft's year-end review",
    content: "Microsoft highlights major achievements of 2024.",
    company: "MSFT",
    date: "2024-12-10"
  },
  {
    title: "Tesla's delivery milestone",
    content: "Tesla reaches new delivery milestone.",
    company: "TSLA",
    date: "2024-12-15"
  },
  {
    title: "Amazon's Prime membership growth",
    content: "Amazon Prime membership continues to grow.",
    company: "AMZN",
    date: "2024-12-20"
  },
  {
    title: "Google's year in review",
    content: "Google highlights major achievements of 2024.",
    company: "GOOGL",
    date: "2024-12-25"
  },

  // January 2025
  {
    title: "Apple's Vision Pro 2 rumors",
    content: "Early rumors about Apple's next-generation Vision Pro.",
    company: "AAPL",
    date: "2025-01-05"
  },
  {
    title: "Microsoft's AI roadmap",
    content: "Microsoft outlines AI development roadmap for 2025.",
    company: "MSFT",
    date: "2025-01-10"
  },
  {
    title: "Tesla's new vehicle platform",
    content: "Tesla announces new vehicle platform for future models.",
    company: "TSLA",
    date: "2025-01-15"
  },
  {
    title: "Amazon's drone delivery expansion",
    content: "Amazon expands drone delivery to more locations.",
    company: "AMZN",
    date: "2025-01-20"
  },
  {
    title: "Google's AI research focus",
    content: "Google outlines AI research priorities for 2025.",
    company: "GOOGL",
    date: "2025-01-25"
  },

  // February 2025
  {
    title: "Apple's Q1 earnings report",
    content: "Apple reports strong Q1 earnings with new records.",
    company: "AAPL",
    date: "2025-02-05"
  },
  {
    title: "Microsoft's cloud innovations",
    content: "Microsoft announces new cloud computing innovations.",
    company: "MSFT",
    date: "2025-02-10"
  },
  {
    title: "Tesla's battery day 2025",
    content: "Tesla showcases new battery technology developments.",
    company: "TSLA",
    date: "2025-02-15"
  },
  {
    title: "Amazon's AI shopping features",
    content: "Amazon introduces new AI-powered shopping features.",
    company: "AMZN",
    date: "2025-02-20"
  },
  {
    title: "Google's search innovations",
    content: "Google announces new search innovations.",
    company: "GOOGL",
    date: "2025-02-25"
  },

  // March 2025
  {
    title: "Apple's new product line",
    content: "Apple announces new product line expansion.",
    company: "AAPL",
    date: "2025-03-05"
  },
  {
    title: "Microsoft's gaming innovations",
    content: "Microsoft unveils new gaming innovations.",
    company: "MSFT",
    date: "2025-03-10"
  },
  {
    title: "Tesla's new factory plans",
    content: "Tesla announces plans for additional factories.",
    company: "TSLA",
    date: "2025-03-15"
  },
  {
    title: "Amazon's logistics innovations",
    content: "Amazon introduces new logistics innovations.",
    company: "AMZN",
    date: "2025-03-20"
  },
  {
    title: "Google's AI assistant update",
    content: "Google announces major update to AI assistant.",
    company: "GOOGL",
    date: "2025-03-25"
  },

  // April 2025
  {
    title: "Apple's services expansion",
    content: "Apple expands its services portfolio.",
    company: "AAPL",
    date: "2025-04-05"
  },
  {
    title: "Microsoft's AI integration",
    content: "Microsoft expands AI integration across products.",
    company: "MSFT",
    date: "2025-04-10"
  },
  {
    title: "Tesla's new vehicle features",
    content: "Tesla announces new features for existing vehicles.",
    company: "TSLA",
    date: "2025-04-15"
  },
  {
    title: "Amazon's cloud innovations",
    content: "Amazon Web Services announces new innovations.",
    company: "AMZN",
    date: "2025-04-20"
  },
  {
    title: "Google's AI research breakthrough",
    content: "Google announces breakthrough in AI research.",
    company: "GOOGL",
    date: "2025-04-25"
  },

  // May 2025
  {
    title: "Apple's new iPad lineup",
    content: "Apple unveils new iPad models with M4 chip.",
    company: "AAPL",
    date: "2025-05-05"
  },
  {
    title: "Microsoft's Surface updates",
    content: "Microsoft announces updates to Surface lineup.",
    company: "MSFT",
    date: "2025-05-10"
  },
  {
    title: "Tesla's energy storage growth",
    content: "Tesla reports strong growth in energy storage.",
    company: "TSLA",
    date: "2025-05-15"
  },
  {
    title: "Amazon's retail innovations",
    content: "Amazon introduces new retail innovations.",
    company: "AMZN",
    date: "2025-05-20"
  },
  {
    title: "Google's Android 16 preview",
    content: "Google releases first preview of Android 16.",
    company: "GOOGL",
    date: "2025-05-25"
  },

  // June 2025
  {
    title: "Apple's WWDC 2025 announcements",
    content: "Apple reveals major software updates at WWDC 2025.",
    company: "AAPL",
    date: "2025-06-05"
  },
  {
    title: "Microsoft's AI for Good expansion",
    content: "Microsoft expands AI for Good program.",
    company: "MSFT",
    date: "2025-06-10"
  },
  {
    title: "Tesla's new vehicle platform",
    content: "Tesla announces new vehicle platform.",
    company: "TSLA",
    date: "2025-06-15"
  },
  {
    title: "Amazon's Prime Day 2025",
    content: "Amazon announces Prime Day 2025 details.",
    company: "AMZN",
    date: "2025-06-20"
  },
  {
    title: "Google's quantum computing update",
    content: "Google provides update on quantum computing progress.",
    company: "GOOGL",
    date: "2025-06-25"
  },

  // July 2025
  {
    title: "Apple's new iPhone rumors",
    content: "Leaked details about Apple's upcoming iPhone 17.",
    company: "AAPL",
    date: "2025-07-05"
  },
  {
    title: "Microsoft's Windows update",
    content: "Microsoft announces major Windows update.",
    company: "MSFT",
    date: "2025-07-10"
  },
  {
    title: "Tesla's new factory plans",
    content: "Tesla announces plans for new manufacturing facilities.",
    company: "TSLA",
    date: "2025-07-15"
  },
  {
    title: "Amazon's logistics expansion",
    content: "Amazon expands logistics network with new facilities.",
    company: "AMZN",
    date: "2025-07-20"
  },
  {
    title: "Google's AI ethics framework",
    content: "Google updates AI ethics framework.",
    company: "GOOGL",
    date: "2025-07-25"
  },

  // August 2025
  {
    title: "Apple's services growth",
    content: "Apple reports strong growth in services revenue.",
    company: "AAPL",
    date: "2025-08-05"
  },
  {
    title: "Microsoft's gaming growth",
    content: "Microsoft's gaming division shows strong growth.",
    company: "MSFT",
    date: "2025-08-10"
  },
  {
    title: "Tesla's solar expansion",
    content: "Tesla expands solar installation services.",
    company: "TSLA",
    date: "2025-08-15"
  },
  {
    title: "Amazon's AI shopping features",
    content: "Amazon introduces new AI shopping features.",
    company: "AMZN",
    date: "2025-08-20"
  },
  {
    title: "Google's search update",
    content: "Google announces major search algorithm update.",
    company: "GOOGL",
    date: "2025-08-25"
  },

  // September 2025
  {
    title: "Apple's iPhone 17 launch",
    content: "Apple announces new iPhone 17 lineup.",
    company: "AAPL",
    date: "2025-09-10"
  },
  {
    title: "Microsoft's Surface event",
    content: "Microsoft unveils new Surface devices.",
    company: "MSFT",
    date: "2025-09-15"
  },
  {
    title: "Tesla's AI Day 2025",
    content: "Tesla showcases latest AI developments.",
    company: "TSLA",
    date: "2025-09-20"
  },
  {
    title: "Amazon's hardware event",
    content: "Amazon announces new Echo and Fire devices.",
    company: "AMZN",
    date: "2025-09-25"
  },
  {
    title: "Google's Pixel 10 launch",
    content: "Google unveils new Pixel 10 smartphones.",
    company: "GOOGL",
    date: "2025-09-30"
  },

  // October 2025
  {
    title: "Apple's Q4 earnings report",
    content: "Apple reports strong Q4 earnings.",
    company: "AAPL",
    date: "2025-10-05"
  },
  {
    title: "Microsoft's cloud growth",
    content: "Microsoft Azure shows strong growth.",
    company: "MSFT",
    date: "2025-10-10"
  },
  {
    title: "Tesla's new vehicle features",
    content: "Tesla announces new features for vehicles.",
    company: "TSLA",
    date: "2025-10-15"
  },
  {
    title: "Amazon's holiday preparation",
    content: "Amazon ramps up for holiday season.",
    company: "AMZN",
    date: "2025-10-20"
  },
  {
    title: "Google's AI research update",
    content: "Google announces AI research progress.",
    company: "GOOGL",
    date: "2025-10-25"
  },

  // November 2025
  {
    title: "Apple's new MacBook Pro",
    content: "Apple unveils new MacBook Pro with M5 chip.",
    company: "AAPL",
    date: "2025-11-05"
  },
  {
    title: "Microsoft's AI integration",
    content: "Microsoft expands AI across products.",
    company: "MSFT",
    date: "2025-11-10"
  },
  {
    title: "Tesla's new factory plans",
    content: "Tesla announces new manufacturing plans.",
    company: "TSLA",
    date: "2025-11-15"
  },
  {
    title: "Amazon's Black Friday deals",
    content: "Amazon announces Black Friday promotions.",
    company: "AMZN",
    date: "2025-11-20"
  },
  {
    title: "Google's AI assistant update",
    content: "Google announces major AI assistant update.",
    company: "GOOGL",
    date: "2025-11-25"
  },

  // December 2025
  {
    title: "Apple's holiday sales",
    content: "Apple reports strong holiday sales.",
    company: "AAPL",
    date: "2025-12-05"
  },
  {
    title: "Microsoft's year-end review",
    content: "Microsoft highlights 2025 achievements.",
    company: "MSFT",
    date: "2025-12-10"
  },
  {
    title: "Tesla's delivery milestone",
    content: "Tesla reaches new delivery record.",
    company: "TSLA",
    date: "2025-12-15"
  },
  {
    title: "Amazon's Prime growth",
    content: "Amazon Prime membership continues growth.",
    company: "AMZN",
    date: "2025-12-20"
  },
  {
    title: "Google's year in review",
    content: "Google highlights 2025 achievements.",
    company: "GOOGL",
    date: "2025-12-25"
  }
];

// Add sentiment analysis data type and mock data
interface IndustryTrend {
  title: string
  description: string
  impact: string
  date: string
}

interface SentimentAnalysisData {
  industryTrends: IndustryTrend[]
}

const sentimentAnalysisData: SentimentAnalysisData = {
  industryTrends: [
    {
      title: "Tech Sector Growth",
      description: "Technology sector showing strong growth with AI and cloud computing leading the charge.",
      impact: "Positive",
      date: "2024-04-27"
    },
    {
      title: "EV Market Expansion",
      description: "Electric vehicle market continues to expand with new players entering the space.",
      impact: "Positive",
      date: "2024-04-26"
    },
    {
      title: "Supply Chain Challenges",
      description: "Global supply chain issues affecting tech manufacturing.",
      impact: "Negative",
      date: "2024-04-25"
    }
  ]
}

type Section = "overview" | "sentiment"
type SortOption = "date" | "importance" | "credibility" | "impact"
type FilterOption = "all" | "positive" | "negative" | "neutral"

export default function Dashboard() {
  
  const [activeSection, setActiveSection] = useState<Section>("overview")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAnalysisComplete, setShowAnalysisComplete] = useState(false)
  const [redditPosts, setRedditPosts] = useState<RedditPost[]>([])
  const [newsArticles, setNewsArticles] = useState<TNewsSource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>("date")
  const [filterBy, setFilterBy] = useState<FilterOption>("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleReanalyze = async () => {
    try {
      setIsAnalyzing(true);

      await updatePortfolio();
      setIsAnalyzing(false);
      setShowAnalysisComplete(true);
    } catch (error) {
      console.error('Error during portfolio update:', error);
      setIsAnalyzing(false);
    }
  }

  const [newsSources, setNewsSources] = useState<TNewsSource[] | undefined>(undefined)
  const [positions, setPositions] = useState<TPortfolioData[] | undefined>(undefined)
  
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>()

  const [performanceData, setPerformanceData] = useState<any>()
  useEffect(() => {
    // Prepare data for portfolio performance chart
    if (positions) {
      const performanceData = positions.map((stock) => {
        return {
          name: stock.history[stock.history.length - 1].date, // Assuming we want the last date for performance
          portfolioValue: Number.parseFloat((stock.history.reduce((total, entry) => {
            return total + entry.price * stock.shares;
          }, 0)).toFixed(2)),
        };
      });
      setPerformanceData(performanceData);
    }
  }, [positions]);


  useEffect(() => {
    const portfolioData = positions?.reduce((total, stock) => total + stock.value, 0)
    setTotalPortfolioValue(portfolioData ?? 0)
  }, [positions])

  useEffect(() => {
    const initialFetch = async () => {
      const newPositions = await fetchPositions()
      setPositions(newPositions);
    };
    initialFetch();
  }, []);


  const handleSort = (option: SortOption) => {
    setSortBy(option)
  }

  const handleFilter = (option: FilterOption) => {
    setFilterBy(option)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const newArticles = await fetchNewsArticles()
      setNewsArticles(newArticles)
    } catch (error) {
      console.error('Error refreshing news:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const filteredAndSortedArticles = newsArticles
    .filter(article => filterBy === "all" ? true : article.impact === filterBy)
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "importance":
          return (b.importance || 0) - (a.importance || 0)
        case "credibility":
          return (b.credibility || 0) - (a.credibility || 0)
        case "impact":
          const impactOrder = { positive: 3, neutral: 2, negative: 1 }
          return impactOrder[b.impact as keyof typeof impactOrder] - impactOrder[a.impact as keyof typeof impactOrder]
        default:
          return 0
      }
    })

  useEffect(() => {
    async function loadData() {
      try {
        const [posts, articles] = await Promise.all([
          fetchAllCompanyPosts(),
          fetchNewsArticles()
        ]);
        setRedditPosts(posts);
        setNewsArticles(articles);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-12">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
                <BarChart3 className="h-6 w-6 text-emerald-500" />
                <span>StockSense</span>
              </Link>

              <div className="flex gap-2">
                <Button
                  variant={activeSection === "overview" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection("overview")}
                  className="hover:bg-emerald-50 transition-colors"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Overview
                </Button>
                <Button
                  variant={activeSection === "sentiment" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveSection("sentiment")}
                  className="hover:bg-emerald-50 transition-colors"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Sentiment
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">Portfolio Value</div>
              <div className="text-xl font-bold">${totalPortfolioValue?.toFixed(2)}</div>
              <div className="text-sm text-emerald-500 flex items-center">
                <ArrowUp className="mr-1 h-3 w-3" />
                <span>5.2%</span>
              </div>
              <a href="/auth/logout" className="ml-4">
                <Button variant="outline" size="sm" className="hover:bg-emerald-50 transition-colors">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {showAnalysisComplete && (
            <Alert className="mb-8 bg-emerald-50 border-emerald-200 animate-fade-in">
              <Zap className="h-4 w-4 text-emerald-500" />
              <AlertTitle className="text-emerald-500">Analysis Complete</AlertTitle>
              <AlertDescription>
                Your portfolio has been reanalyzed based on the latest news.
              </AlertDescription>
            </Alert>
          )}

          {activeSection === "overview" && (
            <>
              <div className="mb-12 text-center bg-white border rounded-xl py-10 space-y-2 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
                <h2 className="text-2xl font-bold flex items-center">
                  Analyze the current news and let Gemini AI automatically update your portfolio
                </h2>
                <div className="text-sm mb-4 max-w-2xl text-muted-foreground">
                  Experience the power of Gemini AI as it intelligently analyzes the web and optimizes your stock trades.
                </div>
                <Button
                  onClick={handleReanalyze}
                  disabled={isAnalyzing}
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg transition-colors"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Market Dynamics...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Reupdate Portfolio from News
                    </>
                  )}
                </Button>
                <div className="text-sm text-muted-foreground">Last reupdated: 4/27/25 - 12:32am</div>
              </div>

              <div className="mb-12">
                <div className="flex mb-6 flex-col items-start">
                  <h2 className="text-2xl font-bold flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5 text-emerald-400" />
                    Portfolio Overview
                  </h2>
                  <div className="text-muted-foreground text-sm">A comprehensive summary of the performance of your owned stocks and the overall health of your investment portfolio.</div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {positions?.map((stock: StockData) => (
                    <Card key={stock.symbol} className="py-0 gap-0 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <CardHeader className="p-6 pb-4 bg-gray-50 border-b">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-2xl font-bold tracking-tight">{stock.symbol}</CardTitle>
                            </div>
                            <CardDescription className="text-sm text-gray-600">{stock.name}</CardDescription>
                          </div>
                          <div
                            className={`text-sm flex items-center gap-1 font-medium ${
                              stock.change >= 0 ? "text-emerald-500" : "text-red-600"
                            }`}
                          >
                            {stock.change >= 0 ? (
                              <ArrowUp className="h-4 w-4" />
                            ) : (
                              <ArrowDown className="h-4 w-4" />
                            )}
                            <span>{Math.abs(stock.changePercent).toFixed(4)}%</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                        <Badge variant="outline" className="text-xs font-medium bg-white">
                          {stock.shares.toFixed(4)} shares
                        </Badge>
                          <div className="text-xl font-bold">${stock.currentPrice}</div>
                        </div>
                        <div className="h-[100px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={stock.history}>
                              <Line
                                type="monotone"
                                dataKey="price"
                                stroke={stock.change >= 0 ? "#10b981" : "#dc2626"}
                                strokeWidth={2}
                                dot={false}
                              />
                              <YAxis domain={["auto", "auto"]} hide />
                              <XAxis dataKey="date" hide />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">Total Value</div>
                          <div className="text-lg font-semibold">${stock.value.toFixed(2)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mb-16">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex flex-col items-start">
                    <h2 className="text-2xl font-bold flex items-center mb-1">
                      <Newspaper className="mr-2 h-5 w-5 text-emerald-500" />
                      Latest News Sources
                    </h2>
                    <div className="text-muted-foreground text-sm">Real-time news articles analyzed by Gemini AI</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => {
                          const currentIndex = ["all", "positive", "negative", "neutral"].indexOf(filterBy)
                          const nextIndex = (currentIndex + 1) % 4
                          handleFilter(["all", "positive", "negative", "neutral"][nextIndex] as FilterOption)
                        }}
                      >
                        <Filter className="h-4 w-4" />
                        {filterBy === "all" ? "All" : filterBy.charAt(0).toUpperCase() + filterBy.slice(1)}
                      </Button>
                    </div>
                    <div className="relative">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => {
                          const currentIndex = ["date", "importance", "credibility", "impact"].indexOf(sortBy)
                          const nextIndex = (currentIndex + 1) % 4
                          handleSort(["date", "importance", "credibility", "impact"][nextIndex] as SortOption)
                        }}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                        {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                    >
                      <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                  </div>
                </div>

                <div className="relative min-h-[400px]">
                  <Card className="shadow-sm py-0 rounded-3xl h-full">
                    <CardContent className="p-6 pr-0 h-full">
                      <ScrollArea className="w-full whitespace-nowrap relative h-full">
                        <div className="absolute inset-y-0 right-0 w-1/20 bg-gradient-to-l from-white via-white/50 to-transparent z-10" />
                        <div className="flex space-x-6">
                          {filteredAndSortedArticles.map((news, index) => (
                            <div key={index} className="w-[420px]">
                              <Card className="h-[500px] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                <div className="h-full flex flex-col">
                                  <div className="bg-gray-50 p-4 rounded-t-xl border-b">
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-start">
                                        <h3 className="text-base font-semibold break-words whitespace-pre-wrap pr-3">{news.title}</h3>
                                        {news.importance && (
                                          <div className="flex items-center gap-1 flex-shrink-0">
                                            <Star className="h-4 w-4 text-yellow-500" />
                                            <span className="text-xs text-muted-foreground">{news.importance}/5</span>
                                          </div>
                                        )}
                                      </div>
                                      {news.credibility && (
                                        <div className="flex items-center gap-1">
                                          <Shield className="h-4 w-4 text-blue-500" />
                                          <span className="text-xs text-muted-foreground">{news.credibility}%</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex-1 p-4 overflow-y-auto">
                                    <div className="space-y-3">
                                      {news.summary && (
                                        <p className="text-sm text-muted-foreground break-words whitespace-pre-wrap">{news.summary}</p>
                                      )}
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                          <span className="truncate">{news.source}</span>
                                          <span>•</span>
                                          <span className="whitespace-nowrap">{news.date}</span>
                                        </div>
                                        <Badge
                                          variant="outline"
                                          className={
                                            news.impact === "positive"
                                              ? "bg-emerald-50 text-emerald-400 border-emerald-200 hover:bg-emerald-100 transition-colors"
                                              : news.impact === "negative"
                                              ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 transition-colors"
                                              : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 transition-colors"
                                          }
                                        >
                                          {news.impact === "positive" ? "Positive" : news.impact === "negative" ? "Negative" : "Neutral"}
                                        </Badge>
                                      </div>
                                      <div className="flex gap-2 flex-wrap">
                                        {news.stocks.map((stock: string) => (
                                          <Badge key={stock} variant="secondary" className="hover:bg-gray-100 transition-colors">
                                            {stock}
                                          </Badge>
                                        ))}
                                      </div>
                                      {news.relatedArticles && news.relatedArticles.length > 0 && (
                                        <div className="mt-3">
                                          <h4 className="text-xs font-medium text-muted-foreground mb-1">Related Articles</h4>
                                          <div className="flex flex-col gap-1">
                                            {news.relatedArticles.slice(0, 2).map((article, idx) => (
                                              <div key={idx} className="text-xs text-muted-foreground line-clamp-1 hover:text-foreground transition-colors cursor-pointer">
                                                {article}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}

          {activeSection === "sentiment" && (
          
              
              <SentimentAnalysis posts={redditPosts} />
            
          )}
        </div>
      </main>

      <footer className="bg-gradient-to-b from-emerald-500 to-teal-600 text-white border-t py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-lg">
                <BarChart3 className="h-6 w-6 text-emerald-200" />
                <span>StockSense</span>
              </div>
              <p className="text-sm text-emerald-100">
                AI-powered portfolio optimization based on real-time news analysis.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-emerald-100 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-emerald-100 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
                <a href="#" className="text-emerald-100 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-emerald-200">Product</h3>
              <ul className="space-y-2 text-sm text-emerald-100">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-emerald-200">Company</h3>
              <ul className="space-y-2 text-sm text-emerald-100">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-emerald-200">Legal</h3>
              <ul className="space-y-2 text-sm text-emerald-100">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-emerald-400 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-emerald-100">
                © 2025 StockSense. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="#" className="text-sm text-emerald-100 hover:text-white transition-colors">Security</a>
                <a href="#" className="text-sm text-emerald-100 hover:text-white transition-colors">Status</a>
                <a href="#" className="text-sm text-emerald-100 hover:text-white transition-colors">Help</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
