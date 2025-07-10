import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function TripPlannerCard() {
  const [tripQuery, setTripQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!isAuthenticated) {
    //   toast({
    //     title: "Sign in required",
    //     description: "Please sign in to plan your trip",
    //   });
    //   navigate("/auth/signin");
    //   return;
    // }

    navigate("/planner", {
      state: { tripQuery },
    });
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-center text-xl text-foreground">
          What kind of trip are you dreaming of?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              value={tripQuery}
              onChange={(e) => setTripQuery(e.target.value)}
              placeholder="e.g., A 7-day family trip to Kandy and Ella with beaches"
              className="flex-grow text-base"
              disabled={isLoading}
            />
            <Button
              type="submit"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                "Planning..."
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Plan Your Trip
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {isAuthenticated
              ? "Tell us about your ideal trip duration and interests"
              : "Sign in to start planning your perfect trip!"}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
