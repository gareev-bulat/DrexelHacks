"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ArrowDown, ArrowUp, BarChart3, RefreshCw, Newspaper, Zap, TrendingUp, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import SentimentAnalysis from "@/components/SentimentAnalysis"

// Mock portfolio data
const portfolioData = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    shares: 15,
    avgPrice: 145.32,
    currentPrice: 178.61,
    change: 2.34,
    changePercent: 1.33,
    value: 2679.15,
    history: [
      { date: "2023-01-01", price: 130.21 },
      { date: "2023-02-01", price: 143.8 },
      { date: "2023-03-01", price: 151.03 },
      { date: "2023-04-01", price: 165.21 },
      { date: "2023-05-01", price: 173.57 },
      { date: "2023-06-01", price: 180.95 },
      { date: "2023-07-01", price: 175.84 },
      { date: "2023-08-01", price: 178.61 },
    ],
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    shares: 10,
    avgPrice: 240.11,
    currentPrice: 337.94,
    change: -1.23,
    changePercent: -0.36,
    value: 3379.4,
    history: [
      { date: "2023-01-01", price: 239.58 },
      { date: "2023-02-01", price: 252.75 },
      { date: "2023-03-01", price: 275.23 },
      { date: "2023-04-01", price: 288.8 },
      { date: "2023-05-01", price: 305.56 },
      { date: "2023-06-01", price: 328.6 },
      { date: "2023-07-01", price: 340.54 },
      { date: "2023-08-01", price: 337.94 },
    ],
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    shares: 8,
    avgPrice: 102.53,
    currentPrice: 138.12,
    change: 1.87,
    changePercent: 1.37,
    value: 1104.96,
    history: [
      { date: "2023-01-01", price: 98.12 },
      { date: "2023-02-01", price: 103.39 },
      { date: "2023-03-01", price: 98.7 },
      { date: "2023-04-01", price: 106.96 },
      { date: "2023-05-01", price: 120.58 },
      { date: "2023-06-01", price: 130.36 },
      { date: "2023-07-01", price: 133.68 },
      { date: "2023-08-01", price: 138.12 },
    ],
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    shares: 12,
    avgPrice: 95.44,
    currentPrice: 129.66,
    change: 0.78,
    changePercent: 0.6,
    value: 1555.92,
    history: [
      { date: "2023-01-01", price: 88.73 },
      { date: "2023-02-01", price: 94.86 },
      { date: "2023-03-01", price: 103.71 },
      { date: "2023-04-01", price: 108.22 },
      { date: "2023-05-01", price: 122.76 },
      { date: "2023-06-01", price: 119.7 },
      { date: "2023-07-01", price: 125.42 },
      { date: "2023-08-01", price: 129.66 },
    ],
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    shares: 20,
    avgPrice: 190.72,
    currentPrice: 215.49,
    change: -3.45,
    changePercent: -1.58,
    value: 4309.8,
    history: [
      { date: "2023-01-01", price: 113.06 },
      { date: "2023-02-01", price: 189.98 },
      { date: "2023-03-01", price: 207.46 },
      { date: "2023-04-01", price: 160.31 },
      { date: "2023-05-01", price: 203.93 },
      { date: "2023-06-01", price: 261.77 },
      { date: "2023-07-01", price: 274.43 },
      { date: "2023-08-01", price: 215.49 },
    ],
  },
]

// Mock news sources
const newsSources = [
  {
    id: 1,
    title: "Tesla Announces New Battery Technology",
    source: "TechCrunch",
    date: "2023-08-15",
    impact: "positive",
    stocks: ["TSLA"],
  },
  {
    id: 2,
    title: "Apple's iPhone 15 Expected to Break Sales Records",
    source: "Bloomberg",
    date: "2023-08-14",
    impact: "positive",
    stocks: ["AAPL"],
  },
  {
    id: 3,
    title: "Microsoft Cloud Services Revenue Surges",
    source: "Wall Street Journal",
    date: "2023-08-12",
    impact: "positive",
    stocks: ["MSFT"],
  },
  {
    id: 4,
    title: "Amazon Faces New Antitrust Challenges",
    source: "Reuters",
    date: "2023-08-10",
    impact: "negative",
    stocks: ["AMZN"],
  },
  {
    id: 5,
    title: "Google's AI Advancements Impress Industry Experts",
    source: "CNBC",
    date: "2023-08-08",
    impact: "positive",
    stocks: ["GOOGL"],
  },
  {
    id: 6,
    title: "Apple Supplier Reports Strong Earnings",
    source: "Financial Times",
    date: "2023-08-07",
    impact: "positive",
    stocks: ["AAPL"],
  },
  {
    id: 7,
    title: "Tesla Expands Manufacturing in Asia",
    source: "Bloomberg",
    date: "2023-08-05",
    impact: "positive",
    stocks: ["TSLA"],
  },
]

// Mock Reddit posts data
const redditPosts = [
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
  {
    title: "Meta's VR headset sales surge",
    content: "Quest 3 sales exceed expectations during holiday season.",
    company: "META",
    date: "2024-01-10"
  },
  {
    title: "NVIDIA's new AI chips announced",
    content: "Next-generation AI processors promise significant performance improvements.",
    company: "NVDA",
    date: "2024-01-15"
  },

  // February 2024
  {
    title: "Apple's supply chain issues resolved",
    content: "After months of delays, Apple has finally resolved its supply chain issues in China.",
    company: "AAPL",
    date: "2024-02-01"
  },
  {
    title: "Microsoft's cloud growth slowing down",
    content: "Recent earnings report shows slower than expected growth in Azure cloud services.",
    company: "MSFT",
    date: "2024-02-10"
  },
  {
    title: "Tesla's Cybertruck production ramping up",
    content: "Production numbers are increasing steadily at the Texas factory.",
    company: "TSLA",
    date: "2024-02-15"
  },
  {
    title: "Amazon's drone delivery expansion",
    content: "Company announces plans to expand drone delivery to more cities.",
    company: "AMZN",
    date: "2024-02-20"
  },
  {
    title: "Google's search algorithm update",
    content: "Latest update improves search results quality significantly.",
    company: "GOOGL",
    date: "2024-02-25"
  },
  {
    title: "Meta's new AI features for Instagram",
    content: "Instagram introduces AI-powered content creation tools.",
    company: "META",
    date: "2024-02-05"
  },
  {
    title: "NVIDIA's gaming revenue exceeds expectations",
    content: "Strong demand for gaming GPUs drives record revenue.",
    company: "NVDA",
    date: "2024-02-15"
  },

  // March 2024
  {
    title: "Apple's new AI features are game-changing",
    content: "The new AI capabilities in iOS 18 are truly revolutionary. The integration with Siri and other apps is seamless.",
    company: "AAPL",
    date: "2024-03-01"
  },
  {
    title: "Microsoft's new AI tools impress developers",
    content: "The new AI development tools from Microsoft are receiving positive feedback from the developer community.",
    company: "MSFT",
    date: "2024-03-15"
  },
  {
    title: "Tesla's battery technology breakthrough",
    content: "New battery design promises longer range and faster charging.",
    company: "TSLA",
    date: "2024-03-20"
  },
  {
    title: "Amazon's new fulfillment center opens",
    content: "State-of-the-art facility promises faster delivery times.",
    company: "AMZN",
    date: "2024-03-10"
  },
  {
    title: "Google's Pixel phone sales surge",
    content: "Strong demand for the latest Pixel models.",
    company: "GOOGL",
    date: "2024-03-25"
  },
  {
    title: "Meta's new VR social platform",
    content: "Company announces innovative social VR experience.",
    company: "META",
    date: "2024-03-05"
  },
  {
    title: "NVIDIA's data center growth",
    content: "Data center revenue continues to show strong growth.",
    company: "NVDA",
    date: "2024-03-15"
  },

  // April 2024
  {
    title: "Apple's Vision Pro sales below expectations",
    content: "Initial sales of the Vision Pro headset have been disappointing according to recent reports.",
    company: "AAPL",
    date: "2024-04-05"
  },
  {
    title: "Microsoft's gaming division shows strong growth",
    content: "Xbox and gaming services continue to show impressive growth numbers.",
    company: "MSFT",
    date: "2024-04-15"
  },
  {
    title: "Tesla's new factory construction delayed",
    content: "Construction of the new Mexico factory faces unexpected delays due to regulatory issues.",
    company: "TSLA",
    date: "2024-04-25"
  },

  // May 2024
  {
    title: "Apple's new MacBook Pro with M3 chip announced",
    content: "New MacBook Pro models with M3 chip show significant performance improvements.",
    company: "AAPL",
    date: "2024-05-10"
  },
  {
    title: "Microsoft's Surface Pro 10 receives mixed reviews",
    content: "New Surface Pro model criticized for high price and minimal upgrades.",
    company: "MSFT",
    date: "2024-05-20"
  },
  {
    title: "Tesla's self-driving software update causes controversy",
    content: "Latest FSD update receives mixed feedback from users and safety advocates.",
    company: "TSLA",
    date: "2024-05-30"
  },

  // June 2024
  {
    title: "Apple's WWDC 2024 announces major iOS updates",
    content: "iOS 18 brings revolutionary AI features and improved privacy controls.",
    company: "AAPL",
    date: "2024-06-10"
  },
  {
    title: "Microsoft's AI Copilot expands to more products",
    content: "AI assistant now available across entire Microsoft 365 suite.",
    company: "MSFT",
    date: "2024-06-20"
  },
  {
    title: "Tesla's new Model 3 refresh receives positive reviews",
    content: "Updated Model 3 design and features impress critics and customers.",
    company: "TSLA",
    date: "2024-06-25"
  },

  // July 2024
  {
    title: "Apple's services revenue hits new record",
    content: "Apple's services division shows strong growth in Q3 2024.",
    company: "AAPL",
    date: "2024-07-05"
  },
  {
    title: "Microsoft's cloud services face outage",
    content: "Major Azure outage affects multiple regions for several hours.",
    company: "MSFT",
    date: "2024-07-15"
  },
  {
    title: "Tesla's new factory in Texas reaches full capacity",
    content: "Gigafactory Texas now producing at maximum capacity.",
    company: "TSLA",
    date: "2024-07-25"
  },

  // August 2024
  {
    title: "Apple's iPhone 16 rumors heat up",
    content: "Leaked information suggests major camera improvements in upcoming iPhone.",
    company: "AAPL",
    date: "2024-08-10"
  },
  {
    title: "Microsoft's Windows 12 release date announced",
    content: "Next version of Windows to launch in early 2025 with AI focus.",
    company: "MSFT",
    date: "2024-08-20"
  },
  {
    title: "Tesla's new energy storage product launch",
    content: "New Powerwall 3 with improved capacity and efficiency announced.",
    company: "TSLA",
    date: "2024-08-30"
  },

  // September 2024
  {
    title: "Apple's iPhone 16 launch event",
    content: "New iPhone models with advanced AI features and improved cameras unveiled.",
    company: "AAPL",
    date: "2024-09-10"
  },
  {
    title: "Microsoft's new AI research breakthrough",
    content: "Company announces significant advancement in natural language processing.",
    company: "MSFT",
    date: "2024-09-20"
  },
  {
    title: "Tesla's new factory in India approved",
    content: "Government approves Tesla's plans for manufacturing facility in India.",
    company: "TSLA",
    date: "2024-09-25"
  },

  // October 2024
  {
    title: "Apple's Vision Pro sales rebound",
    content: "Sales of Vision Pro headset show strong growth after price adjustments.",
    company: "AAPL",
    date: "2024-10-05"
  },
  {
    title: "Microsoft's gaming division acquisition",
    content: "Company announces acquisition of major game studio.",
    company: "MSFT",
    date: "2024-10-15"
  },
  {
    title: "Tesla's new factory construction begins",
    content: "Groundbreaking ceremony held for new Indian manufacturing facility.",
    company: "TSLA",
    date: "2024-10-25"
  },

  // November 2024
  {
    title: "Apple's holiday sales projections",
    content: "Company expects record holiday quarter with new product lineup.",
    company: "AAPL",
    date: "2024-11-10"
  },
  {
    title: "Microsoft's cloud services growth accelerates",
    content: "Azure shows strong growth in enterprise adoption.",
    company: "MSFT",
    date: "2024-11-20"
  },
  {
    title: "Tesla's new vehicle announcement",
    content: "Company teases new affordable EV model for 2025.",
    company: "TSLA",
    date: "2024-11-30"
  },

  // December 2024
  {
    title: "Apple's year-end review",
    content: "Company reports strong performance across all product categories.",
    company: "AAPL",
    date: "2024-12-15"
  },
  {
    title: "Microsoft's AI integration success",
    content: "Company reports positive feedback on AI features across products.",
    company: "MSFT",
    date: "2024-12-20"
  },
  {
    title: "Tesla's production milestone",
    content: "Company celebrates production of 5 millionth vehicle.",
    company: "TSLA",
    date: "2024-12-25"
  },

  // January 2025
  {
    title: "Apple's Vision Pro 2 rumors",
    content: "Early reports suggest significant improvements in next-gen headset.",
    company: "AAPL",
    date: "2025-01-10"
  },
  {
    title: "Microsoft's Windows 12 launch",
    content: "New operating system with advanced AI features now available.",
    company: "MSFT",
    date: "2025-01-20"
  },
  {
    title: "Tesla's new factory progress",
    content: "Indian manufacturing facility construction ahead of schedule.",
    company: "TSLA",
    date: "2025-01-25"
  }
]

// Calculate total portfolio value
const totalPortfolioValue = portfolioData.reduce((total, stock) => total + stock.value, 0)

// Prepare data for portfolio performance chart
const performanceData = portfolioData[0].history.map((entry, index) => {
  const portfolioValue = portfolioData.reduce((total, stock) => {
    return total + stock.history[index].price * stock.shares
  }, 0)
  return {
    name: entry.date,
    portfolioValue: Number.parseFloat(portfolioValue.toFixed(2)),
  }
})

export default function Dashboard() {

  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showAnalysisComplete, setShowAnalysisComplete] = useState(false)

  const handleReanalyze = () => {
    setIsAnalyzing(true)

    // Simulate analysis process
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowAnalysisComplete(true)

      // Hide the alert after 5 seconds
      setTimeout(() => {
        setShowAnalysisComplete(false)
      }, 5000)
    }, 2500)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <BarChart3 className="h-6 w-6 text-green-600" />
              <span>StockSense</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">Portfolio Value</div>
              <div className="text-xl font-bold">${totalPortfolioValue.toFixed(2)}</div>
              <div className="text-sm text-green-600 flex items-center">
                <ArrowUp className="mr-1 h-3 w-3" />
                <span>5.2%</span>
              </div>
              <a href="/auth/logout" className="ml-4">
                <Button variant="outline" size="sm">
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
            <Alert className="mb-8 bg-green-50 border-green-200">
              <Zap className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Analysis Complete</AlertTitle>
              <AlertDescription>
                Your portfolio has been reanalyzed based on the latest news.
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-12 text-center bg-white border rounded-xl py-10 space-y-2 flex flex-col items-center">
            <h2 className="text-2xl font-bold flex items-center">
              Analyze the current news and let Gemini AI automatically update your portfolio
            </h2>
            <div className="text-sm mb-4 ">Experience the power of Gemini AI as it intelligently analyzes the web and optimizes your stock trades.</div>
            <Button
              onClick={handleReanalyze}
              disabled={isAnalyzing}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg shadow-lg"
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
            <div className="text-sm text-muted-foreground ">Last reupdated: 4/27/25 - 12:32am</div>
          </div>

          <div className="mb-12">
            <div className="flex mb-6 flex-col items-start">
              <h2 className="text-2xl font-bold flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                Portfolio Overview
              </h2>
              <div className="text-muted-foreground text-sm">A comprehensive summary of the performance of your owned stocks and the overall health of your investment portfolio.</div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {portfolioData.map((stock) => (
                <Card key={stock.symbol} className="py-0 gap-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-0 bg-gray-50 border-b">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{stock.symbol}</CardTitle>
                        <CardDescription className="text-xs">{stock.name}</CardDescription>
                      </div>
                      <div
                        className={`text-sm flex items-center ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {stock.change >= 0 ? (
                          <ArrowUp className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDown className="mr-1 h-3 w-3" />
                        )}
                        <span>{stock.changePercent}%</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-muted-foreground">{stock.shares} shares</div>
                      <div className="text-lg font-semibold">${stock.currentPrice}</div>
                    </div>
                    <div className="h-[100px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={stock.history}>
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke={stock.change >= 0 ? "#16a34a" : "#dc2626"}
                            strokeWidth={2}
                            dot={false}
                          />
                          <YAxis domain={["auto", "auto"]} hide />
                          <XAxis dataKey="date" hide />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-2 text-sm font-medium">Value: ${stock.value.toFixed(2)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <div className="flex mb-6 flex-col items-start">
              <h2 className="text-2xl font-bold flex items-center">
                <Newspaper className="mr-2 h-5 w-5 text-green-600" />
                Latest News Sources
              </h2>
              <div className="text-muted-foreground text-sm">Sources utilized by Gemini AI today to inform its stock purchases.</div>
            </div>

            <Card className="shadow-sm py-0 rounded-3xl">
              <CardContent className="p-6 pr-0">
                <ScrollArea className="w-full whitespace-nowrap relative">
                  <div className="absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />
                  <div className="flex space-x-4">
                    {newsSources.map((news) => (
                      <Card
                        key={news.id}
                        className="w-[350px] p-0 flex-shrink-0 shadow-sm hover:shadow-md transition-shadow gap-0"
                      >
                        <div className="rounded-t-xl bg-gray-50 border-b p-4">
                          <div className="text-base font-semibold line-clamp-2">{news.title}</div>
                        </div>
                        <CardContent className="p-4 flex flex-col gap-2">
                          <div className="text-sm text-muted-foreground">
                            {news.source} • {news.date}
                          </div>
                          <div className="flex gap-2">
                            <div className="flex gap-2 flex-wrap">
                              {news.stocks.map((stock) => (
                                <Badge key={stock} variant="secondary">
                                  {stock}
                                </Badge>
                              ))}
                            </div>
                            <Badge
                                variant="outline"
                                className={
                                  news.impact === "positive"
                                    ? "bg-green-50 text-green-700 border-green-200 whitespace-nowrap flex-shrink-0"
                                    : "bg-red-50 text-red-700 border-red-200 whitespace-nowrap flex-shrink-0"
                                }
                              >
                                {news.impact === "positive" ? "Positive" : "Negative"}
                              </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <SentimentAnalysis posts={redditPosts} />

          <Card className="shadow-sm mb-8 py-0">
            <CardHeader className="bg-gray-50 border-b p-6 rounded-t-xl">
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Trend of overall portfolio value over time</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        const date = new Date(value)
                        return `${date.getMonth() + 1}/${date.getFullYear().toString().substr(-2)}`
                      }}
                    />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `$${value.toLocaleString()}`} />
                    <Tooltip
                      formatter={(value) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
                      labelFormatter={(label) => {
                        const date = new Date(label)
                        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="portfolioValue"
                      name="Portfolio Value"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="mb-12">
            <div className="flex mb-6 flex-col items-start">
              <h2 className="text-2xl font-bold flex items-center">
                <Newspaper className="mr-2 h-5 w-5 text-green-600" />
                Latest News Sources
              </h2>
              <div className="text-muted-foreground text-sm">Sources utilized by Gemini AI today to inform its stock purchases.</div>
            </div>

            <Card className="shadow-sm py-0 rounded-3xl">
              <CardContent className="p-6 pr-0">
                <ScrollArea className="w-full whitespace-nowrap relative px-2">
                  <div className="absolute inset-y-0 right-0 w-1/12 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />
                  <div className="flex space-x-4">
                    {newsSources.map((news) => (
                      <Card
                        key={news.id}
                        className="w-[350px] p-0 flex-shrink-0 shadow-sm hover:shadow-md transition-shadow gap-0"
                      >
                        <div className="rounded-t-xl bg-gray-50 border-b p-4">
                          <div className="text-base font-semibold line-clamp-2">{news.title}</div>
                        </div>
                        <CardContent className="p-4 flex flex-col gap-2">
                          <div className="text-sm text-muted-foreground">
                            {news.source} • {news.date}
                          </div>
                          <div className="flex gap-2">
                            <div className="flex gap-2 flex-wrap">
                              {news.stocks.map((stock) => (
                                <Badge key={stock} variant="secondary">
                                  {stock}
                                </Badge>
                              ))}
                            </div>
                            <Badge
                                variant="outline"
                                className={
                                  news.impact === "positive"
                                    ? "bg-green-50 text-green-700 border-green-200 whitespace-nowrap flex-shrink-0"
                                    : "bg-red-50 text-red-700 border-red-200 whitespace-nowrap flex-shrink-0"
                                }
                              >
                                {news.impact === "positive" ? "Positive" : "Negative"}
                              </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-lg mb-4 md:mb-0">
            </div>
            <div className="text-sm text-muted-foreground">
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
