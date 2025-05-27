import { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import DestinationHero from '@/components/destinations/DestinationHero';
import DestinationOverview from '@/components/destinations/DestinationOverview';
import DestinationGallery from '@/components/destinations/DestinationGallery';
import DestinationSidebar from '@/components/destinations/DestinationSidebar';

export default function YalaPage() {
  const [isLiked, setIsLiked] = useState(false);
  const { isAuthenticated } = useAuth();

  const destination = {
    name: 'Yala Park',
    country: 'Sri Lanka',
    rating: 4.8,
    reviews: 995,
    price: {
      from: 30,
      to: 70,
    },
    description: 'Yala National Park, a wildlife haven, boasts diverse ecosystems, high leopard density, and abundant elephants, promising thrilling safaris.',
    image: '/destinations/Yala/elephants.jpg',
    gallery: [
      '/destinations/Yala/bear.jpg',
      '/destinations/Yala/deer.jpg',
      '/destinations/Yala/ele.jpg'
    ],
    highlights: [
      'Yala safari with fair prices',
      'View the beautiful wildlife',
      'Explore the water gardens',
      'Visit the nature beauty',
      
    ],
    bestTimeToVisit: 'november to january',
    weather: {
      spring: 'Warm and humid',
      summer: 'Hot and dry',
      autumn: 'Pleasant and wet',
      winter: 'Cool and dry'
    },
    transportation: [
      'Tuk-tuk',
      'Safari jeep',
      'Tour bus',
      
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