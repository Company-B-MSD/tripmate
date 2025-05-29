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
  
  // Base URL - update this to match your backend URL in development
  const API_BASE_URL = 'http://localhost:8080'; // Add your actual backend URL

  // Auto-fetch insights when component mounts
  useEffect(() => {
    fetchInsights();
    
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
      // Fetch insights from the backend API with the correct URL
      const response = await fetch(`${API_BASE_URL}/api/ai/insights`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Include credentials if you need authentication
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.analysis) {
        // Process insights - replace $ separators if needed
        const processedInsights = data.analysis.split('$').join('\n\n• ');
        setInsights(processedInsights.startsWith('• ') ? processedInsights : `• ${processedInsights}`);
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
      // Try to get the latest trip's insights directly
      const response = await fetch(`${API_BASE_URL}/api/trips/latest/insights`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.recommendations) {
          setRecommendations(data.recommendations);
        }
        if (data.itinerary) {
          setItinerary(data.itinerary);
        }
        return;
      }
      
      // Fallback to fetching trips and then getting insights
      const tripsResponse = await fetch(`${API_BASE_URL}/api/trips`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!tripsResponse.ok) {
        console.error('Failed to fetch trips:', tripsResponse.status);
        return;
      }
      
      const trips = await tripsResponse.json();
      if (!Array.isArray(trips) || trips.length === 0) {
        console.log('No trips found');
        return;
      }
      
      // Get latest trip index
      const latestIndex = trips.length - 1;
      
      // Get recommendations
      const recommendationsResponse = await fetch(`${API_BASE_URL}/api/ai/recommendations/${latestIndex}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (recommendationsResponse.ok) {
        const recData = await recommendationsResponse.json();
        if (recData.recommendations) {
          setRecommendations(recData.recommendations);
        }
      }
      
      // Get itinerary
      const itineraryResponse = await fetch(`${API_BASE_URL}/api/ai/itinerary/${latestIndex}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
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

  // The rest of your component remains the same
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
          {!loading && (
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