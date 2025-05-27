import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AiInsightsSection() {
  const [insights, setInsights] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [itinerary, setItinerary] = useState('');
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
      // Fetch insights from the backend API
      const response = await fetch('/api/ai/insights');
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.analysis) {
        setInsights(data.analysis);
      } else if (data.message) {
        // Handle case where there are no trips
        setInsights(data.message);
      } else if (data.error) {
        throw new Error(data.error);
      }
      
      // Fetch recommendations and itinerary if there are trips
      if (data.tripCount && data.tripCount > 0) {
        fetchTripDetails();
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching AI insights:', err);
      setError(`Failed to fetch AI insights: ${err.message}`);
      setLoading(false);
    }
  };
  
  const fetchTripDetails = async () => {
    try {
      // Fetch the latest trip's recommendations and itinerary
      const response = await fetch('/api/trips');
      
      if (!response.ok) {
        return; // Just skip if this fails
      }
      
      const data = await response.json();
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }
      
      // Get itinerary
      const itineraryResponse = await fetch('/api/ai/itinerary/0');
      if (itineraryResponse.ok) {
        const itineraryData = await itineraryResponse.json();
        if (itineraryData.itinerary) {
          setItinerary(itineraryData.itinerary);
        }
      }
    } catch (err) {
      console.error('Error fetching trip details:', err);
      // Don't set error here, we still want to show insights
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
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="insights">Trip Analysis</TabsTrigger>
              <TabsTrigger value="recommendations" disabled={!recommendations}>Recommendations</TabsTrigger>
              <TabsTrigger value="itinerary" disabled={!itinerary}>Suggested Itinerary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="insights" className="prose prose-sm max-w-none">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 whitespace-pre-line">
                {insights}
              </div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="prose prose-sm max-w-none">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 whitespace-pre-line">
                {recommendations}
              </div>
            </TabsContent>
            
            <TabsContent value="itinerary" className="prose prose-sm max-w-none">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10 whitespace-pre-line">
                {itinerary}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}