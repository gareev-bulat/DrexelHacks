import React, { useEffect, useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import Sentiment from 'sentiment';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TrendingUp, AlertTriangle } from "lucide-react";

interface Post {
  title: string;
  content: string;
  company: string;
  date: string;
}

interface SentimentAnalysisProps {
  posts: Post[];
}

interface SentimentChartData {
  date: string;
  sentiment: number;
  positive: number;
  negative: number;
  neutral: number;
  rollingSentiment: number;
  rollingPositive: number;
  rollingNegative: number;
  rollingNeutral: number;
}

interface CompanySentimentData {
  company: string;
  data: SentimentChartData[];
  overallSentiment: "positive" | "negative" | "neutral";
}

interface SentimentDecision {
  company: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  reasoning: string;
  risk: string;
}

interface TooltipPayload {
  value: number;
  dataKey: string;
  color: string;
  name: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ posts }) => {
  const [sentimentData, setSentimentData] = useState<CompanySentimentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sentimentAnalyzer = useMemo(() => new Sentiment(), []);

  useEffect(() => {
    const analyzeSentiments = async () => {
      try {
        setIsLoading(true);
        const companyGroups = new Map<string, Post[]>();
        
        posts.forEach(post => {
          if (!companyGroups.has(post.company)) {
            companyGroups.set(post.company, []);
          }
          companyGroups.get(post.company)?.push(post);
        });

        const newSentimentData: CompanySentimentData[] = [];
        
        for (const [company, companyPosts] of companyGroups) {
          const sortedPosts = [...companyPosts].sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateA - dateB;
          });

          const sentimentData: SentimentChartData[] = [];
          let rollingSentiment = 0;
          let rollingPositive = 0;
          let rollingNegative = 0;
          let rollingNeutral = 0;
          const windowSize = 5;

          sortedPosts.forEach((post, index) => {
            const text = `${post.title} ${post.content}`;
            const result = sentimentAnalyzer.analyze(text);
            
            const sentimentScore = result.score;
            const positiveCount = result.positive?.length ?? 0;
            const negativeCount = result.negative?.length ?? 0;
            const neutralCount = (result.tokens?.length ?? 0) - positiveCount - negativeCount;

            rollingSentiment = (rollingSentiment * Math.min(index, windowSize) + sentimentScore) / 
                             (Math.min(index, windowSize) + 1);
            rollingPositive = (rollingPositive * Math.min(index, windowSize) + positiveCount) / 
                            (Math.min(index, windowSize) + 1);
            rollingNegative = (rollingNegative * Math.min(index, windowSize) + negativeCount) / 
                            (Math.min(index, windowSize) + 1);
            rollingNeutral = (rollingNeutral * Math.min(index, windowSize) + neutralCount) / 
                           (Math.min(index, windowSize) + 1);

            sentimentData.push({
              date: post.date || new Date().toISOString(),
              sentiment: sentimentScore,
              positive: positiveCount,
              negative: negativeCount,
              neutral: neutralCount,
              rollingSentiment,
              rollingPositive,
              rollingNegative,
              rollingNeutral
            });
          });

          const overallSentiment = rollingSentiment > 0 ? "positive" : 
                                 rollingSentiment < 0 ? "negative" : "neutral";

          newSentimentData.push({
            company,
            data: sentimentData,
            overallSentiment
          });
        }

        setSentimentData(newSentimentData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    analyzeSentiments();
  }, [posts, sentimentAnalyzer]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length && label) {
      const date = new Date(label);
      const sentiment = payload.find((p) => p.dataKey === 'rollingSentiment')?.value;
      const positive = payload.find((p) => p.dataKey === 'rollingPositive')?.value;
      const negative = payload.find((p) => p.dataKey === 'rollingNegative')?.value;
      const neutral = payload.find((p) => p.dataKey === 'rollingNeutral')?.value;

      return (
        <div className="bg-white p-2 border rounded-md shadow-sm">
          <p className="font-medium text-sm mb-1">
            {date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-blue-600 text-xs">Overall Sentiment:</span>
              <span className="font-medium text-xs">{sentiment?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-emerald-600 text-xs">Positive:</span>
              <span className="font-medium text-xs">{Math.round((positive ?? 0) * 100)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-600 text-xs">Negative:</span>
              <span className="font-medium text-xs">{Math.round((negative ?? 0) * 100)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs">Neutral:</span>
              <span className="font-medium text-xs">{Math.round((neutral ?? 0) * 100)}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const analyzeDecisions = (data: CompanySentimentData[]): SentimentDecision[] => {
    return data.map(companyData => {
      const latestData = companyData.data[companyData.data.length - 1];
      const previousData = companyData.data.length > 1 ? companyData.data[companyData.data.length - 2] : null;
      
      // If we don't have enough data points, return a HOLD decision with low confidence
      if (!previousData) {
        return {
          company: companyData.company,
          action: 'HOLD',
          confidence: 'LOW',
          reasoning: 'Insufficient data points for trend analysis.',
          risk: 'High uncertainty due to limited historical data.'
        };
      }
      
      // At this point, TypeScript knows previousData is not null
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
      <div className="space-y-6">
        <div className="space-y-1">
            <h3 className="text-2xl font-bold">Investment Decisions</h3>
            <p className="text-muted-foreground">AI-powered analysis and recommendations based on sentiment trends, market signals, and confidence levels for each stock in your portfolio.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decisions.map((decision) => (
            <Card key={decision.company} className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <CardHeader className="p-0 mb-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{decision.company}</CardTitle>
                  <Badge 
                    variant="outline"
                    className={
                      decision.action === 'BUY' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      decision.action === 'SELL' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
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
                      decision.confidence === 'MEDIUM' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                      'bg-slate-50 text-slate-700 border-slate-200'
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
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-600">Risk Factors</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    {decision.risk}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">Sentiment Trends</h3>
          <p className="text-muted-foreground">Year-long sentiment analysis based on social media and news data</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {sentimentData.map((data) => (
            <Card key={data.company} className="py-0 gap-0 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="p-6 pb-4 bg-gray-50 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{data.company}</CardTitle>
                    <CardDescription className="text-xs">Total Posts: {data.data.length}</CardDescription>
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      data.overallSentiment === 'positive' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      data.overallSentiment === 'negative' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-slate-50 text-slate-700 border-slate-200'
                    }
                  >
                    {data.overallSentiment.charAt(0).toUpperCase() + data.overallSentiment.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 11 }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: '2-digit' 
                        })}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={{ stroke: '#e2e8f0' }}
                        padding={{ left: 20, right: 20 }}
                        y={10}
                      />
                      <YAxis 
                        tick={{ fontSize: 11 }}
                        tickFormatter={(value) => value.toFixed(1)}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={{ stroke: '#e2e8f0' }}
                        padding={{ top: 20, bottom: 20 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="rollingSentiment" 
                        name="Overall Sentiment"
                        stroke="#2563eb" 
                        dot={false}
                        strokeWidth={2}
                        activeDot={{ r: 4, fill: '#2563eb', stroke: '#1e40af', strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rollingPositive" 
                        name="Positive"
                        stroke="#16a34a" 
                        dot={false}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rollingNegative" 
                        name="Negative"
                        stroke="#dc2626" 
                        dot={false}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="rollingNeutral" 
                        name="Neutral"
                        stroke="#4b5563" 
                        dot={false}
                        strokeWidth={1}
                        strokeDasharray="5 5"
                      />
                      <Brush 
                        dataKey="date"
                        height={25}
                        stroke="#2563eb"
                        travellerWidth={8}
                        startIndex={0}
                        endIndex={Math.min(3, data.data.length - 1)}
                        fill="#f1f5f9"
                        gap={5}
                        className="rounded-lg [&_.recharts-brush-texts]:text-xs [&_.recharts-brush-texts]:text-slate-500 [&_.recharts-brush-texts]:font-sans"
                        strokeWidth={1.5}
                        alwaysShowText={true}
                        y={350}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                          month: 'numeric', 
                          day: 'numeric' 
                        })}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-emerald-600 font-medium">Positive</div>
                    <div className="text-lg font-bold">{Math.round(data.data[data.data.length - 1].rollingPositive * 100)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-red-600 font-medium">Negative</div>
                    <div className="text-lg font-bold">{Math.round(data.data[data.data.length - 1].rollingNegative * 100)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-slate-600 font-medium">Neutral</div>
                    <div className="text-lg font-bold">{Math.round(data.data[data.data.length - 1].rollingNeutral * 100)}%</div>
                  </div>
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