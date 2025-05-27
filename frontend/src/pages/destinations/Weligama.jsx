import { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import DestinationHero from '@/components/destinations/DestinationHero';
import DestinationOverview from '@/components/destinations/DestinationOverview';
import DestinationGallery from '@/components/destinations/DestinationGallery';
import DestinationSidebar from '@/components/destinations/DestinationSidebar';

export default function WeligamaPage() {
  const [isLiked, setIsLiked] = useState(false);
  const { isAuthenticated } = useAuth();

  const destination = {
    name: 'Weligama',
    country: 'Sri Lanka',
    rating: 5.0,
    reviews: 2150,
    price: {
      from: 40,
      to: 300,
    },
    description: 'Weligama, a scenic Sri Lankan town, offers beautiful beaches, heritage sites, local cuisine, and unique attractions, making it a perfect spot for relaxation and adventure.',
    image: '/destinations/Weligama/wel.jpg',
    gallery: [
      '/destinations/Weligama/rock.jpg',
      '/destinations/Weligama/hotels.jpg',
      '/destinations/Weligama/surf.webp'
    ],
    highlights: [
      'Worship the ancient Temples',
      'View the beautiful frescoes',
      'Explore the water gardens',
      'Visit the tea Factories',
      'Watch the sunset from the top'
    ],
    bestTimeToVisit: 'November to April',
    weather: {
      spring: 'Warm and humid',
      summer: 'Hot and windy',
      autumn: 'Pleasant and dry',
      winter: 'Cool and wet'
    },
    transportation: [
      'Tuk-tuk',
      'Mini car',
      'Tour bus/van',
      'Local bus'
    ]
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="min-h-screen bg-background">
      <DestinationHero 
        destination={destination}
        isLiked={isLiked}
        onToggleLike={toggleLike}
      />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <DestinationOverview destination={destination} />
              <DestinationGallery 
                images={destination.gallery}
                name={destination.name}
              />
            </div>
            <DestinationSidebar destination={destination} />
          </div>
        </div>
      </section>
    </div>
  );
}