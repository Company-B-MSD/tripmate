import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AiInsightsSection() {
  const [insights, setInsights] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timerRef = useRef(null);

  // Clean up any pending timers when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would fetch from your backend API
      // const response = await fetch('/api/ai/analyze');
      // const data = await response.json();
      // setInsights(data.analysis);
      
      // For demonstration purposes, we'll simulate a response
      timerRef.current = setTimeout(() => {
        setInsights(`Based on your trip preferences to Sri Lanka, here are some recommendations:

• Sigiriya Rock Fortress is best visited early morning to avoid crowds and heat
• Consider adding Ella's Nine Arch Bridge to your itinerary - perfect for photography
• The train journey from Kandy to Ella is considered one of the most scenic in the world
• Mirissa offers excellent whale watching opportunities between November and April
• Local street food markets in Colombo provide authentic culinary experiences at affordable prices

Your planned travel season aligns well with dry conditions in the Cultural Triangle region. Don't forget to pack lightweight clothing and rain protection for unexpected showers!`);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Failed to fetch AI insights. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-primary/5 pb-2 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-xl">AI Travel Insights</CardTitle>
          </div>
          {!loading && insights && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={fetchInsights}
            >
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-5">
        {!insights && !loading && !error && (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">Get personalized AI insights for your Sri Lankan adventure</p>
            <Button 
              onClick={fetchInsights} 
              className="bg-primary hover:bg-primary/90"
            >
              Generate Insights
            </Button>
          </div>
        )}
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Analyzing your travel preferences...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-6">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchInsights}>Try Again</Button>
          </div>
        )}
        
        {insights && !loading && (
          <div className="prose prose-sm max-w-none">
            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 whitespace-pre-line">
              {insights}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}