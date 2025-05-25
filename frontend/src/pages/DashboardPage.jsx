import Dashboard from "@/components/dashboard/CreateTrip";
import AiInsightsSection from "@/components/dashboard/AiInsightsSection";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Dashboard />
        </div>
        <div className="md:col-span-1">
          <AiInsightsSection />
        </div>
      </div>
    </div>
  );
}