import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sentiment from 'sentiment';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface SentimentAnalysisProps {
  posts: Array<{
    title: string;
    content: string;
    company: string;
    date: string;
  }>;
}

interface SentimentData {
  company: string;
  data: Array<{
    date: string;
    sentiment: number;
    positive: number;
    negative: number;
    neutral: number;
    rollingSentiment: number;
    rollingPositive: number;
    rollingNegative: number;
    rollingNeutral: number;
  }>;
  overallSentiment: 'positive' | 'negative' | 'neutral';
}

interface SentimentDecision {
  company: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  reasoning: string;
  risk: string;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ posts }) => {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const sentiment = new Sentiment();

  useEffect(() => {
    const analyzeSentiments = () => {
      const companyData: { [key: string]: Array<{
        date: string;
        sentiment: number;
        positive: number;
        negative: number;
        neutral: number;
      }> } = {};

      // Sort posts by date
      const sortedPosts = [...posts].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Initialize data structure for each company
      const companies = new Set(posts.map(post => post.company));
      companies.forEach(company => {
        companyData[company] = [];
      });

      // Process each post
      sortedPosts.forEach(post => {
        const text = `${post.title} ${post.content}`;
        const result = sentiment.analyze(text);
        
        const sentimentScore = result.score;
        const sentimentType = sentimentScore > 0 ? 'positive' : sentimentScore < 0 ? 'negative' : 'neutral';

        companyData[post.company].push({
          date: post.date,
          sentiment: sentimentScore,
          positive: sentimentType === 'positive' ? 1 : 0,
          negative: sentimentType === 'negative' ? 1 : 0,
          neutral: sentimentType === 'neutral' ? 1 : 0
        });
      });

      // Calculate rolling averages for each company
      const processedData = Object.entries(companyData).map(([company, sentiments]) => {
        // Calculate overall sentiment
        const totalPositive = sentiments.reduce((sum, s) => sum + s.positive, 0);
        const totalNegative = sentiments.reduce((sum, s) => sum + s.negative, 0);
        const totalNeutral = sentiments.reduce((sum, s) => sum + s.neutral, 0);

        const overallSentiment: 'positive' | 'negative' | 'neutral' = 
          totalPositive > totalNegative && totalPositive > totalNeutral ? 'positive' :
          totalNegative > totalPositive && totalNegative > totalNeutral ? 'negative' :
          'neutral';

        // Calculate rolling averages
        const windowSize = 3; // 3-month rolling average
        const processedSentiments = sentiments.map((sentiment, index) => {
          const start = Math.max(0, index - windowSize + 1);
          const end = index + 1;
          const window = sentiments.slice(start, end);
          
          return {
            ...sentiment,
            rollingSentiment: window.reduce((sum, s) => sum + s.sentiment, 0) / window.length,
            rollingPositive: window.reduce((sum, s) => sum + s.positive, 0) / window.length,
            rollingNegative: window.reduce((sum, s) => sum + s.negative, 0) / window.length,
            rollingNeutral: window.reduce((sum, s) => sum + s.neutral, 0) / window.length
          };
        });

        return {
          company,
          data: processedSentiments,
          overallSentiment
        };
      });

      setSentimentData(processedData);
    };

    analyzeSentiments();
  }, [posts]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg">
          <p className="font-bold text-lg mb-2">{new Date(label).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p className="text-lg font-semibold">Sentiment: {payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  const analyzeDecisions = (data: SentimentData[]): SentimentDecision[] => {
    return data.map(companyData => {
      const latestData = companyData.data[companyData.data.length - 1];
      const previousData = companyData.data[companyData.data.length - 2];
      
      const sentimentTrend = latestData.rollingSentiment - previousData.rollingSentiment;
      
      let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
      let confidence: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
      let reasoning = '';
      let risk = '';

      if (sentimentTrend > 0.2) {
        action = 'BUY';
        confidence = 'HIGH';
        reasoning = `Strong positive sentiment trend with increasing overall sentiment.`;
        risk = 'Market volatility and external factors could impact short-term performance.';
      } else if (sentimentTrend < -0.2) {
        action = 'SELL';
        confidence = 'HIGH';
        reasoning = `Significant negative sentiment trend with decreasing overall sentiment.`;
        risk = 'Potential overreaction to temporary negative news.';
      } else if (Math.abs(sentimentTrend) < 0.1) {
        action = 'HOLD';
        confidence = 'HIGH';
        reasoning = `Stable sentiment with minimal changes in overall sentiment.`;
        risk = 'Potential for sudden sentiment shifts due to upcoming events or announcements.';
      } else {
        action = 'HOLD';
        confidence = 'LOW';
        reasoning = `Mixed signals with moderate sentiment changes.`;
        risk = 'High uncertainty in sentiment direction.';
      }

      return {
        company: companyData.company,
        action,
        confidence,
        reasoning,
        risk
      };
    });
  };

  const decisions = analyzeDecisions(sentimentData);

  return (
    <div className="mt-12 space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-3">Sentiment Analysis</h2>
        <p className="text-muted-foreground">Track market sentiment trends across different companies</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-2xl font-bold">Investment Decisions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decisions.map((decision) => (
            <Card key={decision.company} className="p-6">
              <CardHeader className="p-0 mb-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{decision.company}</CardTitle>
                  <Badge 
                    variant="outline"
                    className={
                      decision.action === 'BUY' ? 'bg-green-50 text-green-700 border-green-200' :
                      decision.action === 'SELL' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200'
                    }
                  >
                    {decision.action}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge 
                    variant="outline"
                    className={
                      decision.confidence === 'HIGH' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      decision.confidence === 'MEDIUM' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }
                  >
                    {decision.confidence} Confidence
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <Alert className="bg-blue-50 border-blue-200">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-600">Analysis</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    {decision.reasoning}
                  </AlertDescription>
                </Alert>
                <Alert className="bg-yellow-50 border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-600">Risk Factors</AlertTitle>
                  <AlertDescription className="text-yellow-700">
                    {decision.risk}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-3">Sentiment Trends</h3>
          <p className="text-muted-foreground">Year-long sentiment analysis based on social media and news data</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sentimentData.map((data) => (
            <Card key={data.company} className="py-0 gap-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-6 pb-4 bg-gray-50 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{data.company}</CardTitle>
                    <CardDescription className="text-xs">Total Posts: {data.data.length}</CardDescription>
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      data.overallSentiment === 'positive' ? 'bg-green-50 text-green-700 border-green-200' :
                      data.overallSentiment === 'negative' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }
                  >
                    {data.overallSentiment.charAt(0).toUpperCase() + data.overallSentiment.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: '2-digit' 
                        })}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => value.toFixed(1)}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="rollingSentiment" 
                        stroke="#3b82f6" 
                        dot={false}
                        strokeWidth={2}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis; 