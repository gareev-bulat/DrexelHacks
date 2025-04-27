"use client"
import { ArrowRight, BarChart3, LineChart, Newspaper, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-gradient-to-r from-white to-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <BarChart3 className="h-6 w-6 text-emerald-500" />
              <span className="text-lg sm:text-xl font-bold">StockSense</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/auth/login?returnTo=/dashboard">
                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 sm:px-6 py-2 text-sm sm:text-base transition-colors">
                  Sign In
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-emerald-50 to-teal-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-bold mb-6">AI-Powered Portfolio Optimization</h1>
                <p className="text-xl text-gray-600 mb-8">
                  Our advanced AI engine scans thousands of news sources in real-time to identify market-moving events
                  before they impact your portfolio. Get ahead of the market with intelligent, news-driven investment
                  recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/auth/login?returnTo=/dashboard">
                    <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-7 text-xl font-semibold rounded-lg transition-all duration-200 hover:shadow-lg">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </a>
                </div>
              </div>
              <div className="hidden md:block">
                <Image 
                  src="/hero-image.jpg" 
                  alt="HeadlineTrader Hero Image" 
                  width={1200} 
                  height={600}
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">How HeadlineTrader Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-emerald-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <Newspaper className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">News Analysis</h3>
                <p className="text-gray-600">
                  Our AI continuously scans financial news from thousands of sources, identifying market-moving events
                  in real-time.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-emerald-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Optimization</h3>
                <p className="text-gray-600">
                  With one click, our AI analyzes your portfolio against the latest news and recommends optimal
                  adjustments.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="bg-emerald-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <LineChart className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold mb-3">Performance Tracking</h3>
                <p className="text-gray-600">
                  Track your portfolio&apos;s performance over time and see how our AI-driven recommendations have improved
                  your returns.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-4">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
                <span>HeadlineTrader</span>
              </div>
              <p className="text-sm text-gray-600">
                AI-powered portfolio optimization based on real-time news analysis.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-emerald-500 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-sm text-gray-600">
            © 2025 HeadlineTrader. All rights reserved. Market data provided for educational purposes only.
          </div>
        </div>
      </footer>
    </div>
  )
}
