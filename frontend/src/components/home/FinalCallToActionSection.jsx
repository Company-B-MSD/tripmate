import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function FinalCallToActionSection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-primary/5 relative">
      <div className="absolute inset-0 overflow-hidden z-0 opacity-30">
        <img
          src="https://picsum.photos/seed/srilanka-cta/1920/1080"
          alt="Sri Lanka abstract background"
          className="opacity-20 object-cover w-full h-full"
          data-ai-hint="Sri Lanka pattern"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background opacity-50"></div>
      </div>
      <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary mb-6">
          {isAuthenticated ? "Continue Your Journey" : "Ready to Explore the Pearl of the Indian Ocean?"}
        </h2>
        <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl/relaxed mb-8">
          {isAuthenticated 
            ? "Return to your dashboard to continue planning your perfect Sri Lankan adventure."
            : "Let TripMate be your trusted companion in crafting an unforgettable Sri Lankan journey. Sign up today and start planning your adventure!"}
        </p>
        <Link to={isAuthenticated ? "/planner" : "/auth/signin"}>
        {/* <Link to={isAuthenticated ? "/dashboard" : "/auth/signup"}> */}
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transform hover:scale-105 transition-transform duration-200 px-10 py-6 text-lg">
            {isAuthenticated ? "Plan Your Trip" : "Start Your Sri Lankan Adventure"}
          </Button>
          </Link>
        {/* </Link> */}
      </div>
    </section>
  );
}
