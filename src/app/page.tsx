import Link from "next/link"
import { ArrowRight, BarChart3, LineChart, Newspaper, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl">
              <BarChart3 className="h-6 w-6 text-green-600" />
              <span>StockSense</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-green-600 hover:bg-green-700">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-50 to-blue-50 py-20">
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
                  <Link href="/sign-up">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="px-8 py-6 text-lg">
                      View Demo
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="/placeholder.svg?height=400&width=500"
                  alt="Portfolio Dashboard Preview"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">How StockSense Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <Newspaper className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">News Analysis</h3>
                <p className="text-gray-600">
                  Our AI continuously scans financial news from thousands of sources, identifying market-moving events
                  in real-time.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Optimization</h3>
                <p className="text-gray-600">
                  With one click, our AI analyzes your portfolio against the latest news and recommends optimal
                  adjustments.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-6">
                  <LineChart className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Performance Tracking</h3>
                <p className="text-gray-600">
                  Track your portfolio's performance over time and see how our AI-driven recommendations have improved
                  your returns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "StockSense has completely transformed how I manage my investments. The AI recommendations have helped
                  me stay ahead of market trends."
                </p>
                <p className="font-bold">- Michael R., Investment Analyst</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "The news analysis feature is incredible. It's like having a team of analysts working for you 24/7. My
                  returns have improved significantly."
                </p>
                <p className="font-bold">- Sarah L., Retail Investor</p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm border">
                <div className="flex items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "As a busy professional, I don't have time to follow the markets all day. StockSense does the heavy
                  lifting for me with its AI analysis."
                </p>
                <p className="font-bold">- David K., Business Owner</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-600 text-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Portfolio?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of investors who are using AI to make smarter investment decisions based on real-time news
              analysis.
            </p>
            <Link href="/sign-up">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-6 text-lg"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg mb-4">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <span>StockSense</span>
              </div>
              <p className="text-sm text-gray-600">
                AI-powered portfolio optimization based on real-time news analysis.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Features</li>
                <li>Pricing</li>
                <li>API</li>
                <li>Integrations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Documentation</li>
                <li>Blog</li>
                <li>Support</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>About</li>
                <li>Careers</li>
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-sm text-gray-600">
            © 2023 StockSense. All rights reserved. Market data provided for educational purposes only.
          </div>
        </div>
      </footer>
    </div>
  )
}
