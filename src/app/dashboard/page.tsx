"use client"

import { useState } from "react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ArrowDown, ArrowUp, BarChart3, RefreshCw, Newspaper, Zap, TrendingUp, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

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
              <Link href="/sign-in">
                <Button variant="outline" size="sm" className="ml-4">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </Link>
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
                Your portfolio has been reanalyzed based on the latest news. We've identified 5 positive and 1 negative
                impact.
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-12 text-center bg-white border rounded-xl py-10 space-y-2">
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
                  Optimize Portfolio from News
                </>
              )}
            </Button>
            <div className="text-sm text-muted-foreground ">Analyze the current news and let Gemini AI automatically update your portfolio.</div>
          </div>

          <div className="mb-12">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-green-600" />
                Portfolio Overview
              </h2>
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
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <Newspaper className="mr-2 h-5 w-5 text-green-600" />
                Latest News Sources
              </h2>
            </div>

            <Card className="shadow-sm">
              <CardContent className="p-6">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex space-x-4 pb-4">
                    {newsSources.map((news) => (
                      <Card
                        key={news.id}
                        className="w-[350px] p-0 flex-shrink-0 shadow-sm hover:shadow-md transition-shadow gap-0"
                      >
                        <CardHeader className="p-4  bg-gray-50 border-b">
                          <div className="flex justify-between items-start overflow-hidden">
                            <CardTitle className="text-base truncate">{news.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col gap-2">
                          <div className="text-sm text-muted-foreground">
                            {news.source} • {news.date}
                          </div>
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
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm mb-8">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Overall portfolio value trend over time</CardDescription>
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
