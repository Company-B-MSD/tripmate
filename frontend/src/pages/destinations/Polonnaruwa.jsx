import { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import DestinationHero from '@/components/destinations/DestinationHero';
import DestinationOverview from '@/components/destinations/DestinationOverview';
import DestinationGallery from '@/components/destinations/DestinationGallery';
import DestinationSidebar from '@/components/destinations/DestinationSidebar';

export default function PolonnaruwaPage() {
  const [isLiked, setIsLiked] = useState(false);
  const { isAuthenticated } = useAuth();

  const destination = {
    name: 'Polonnaruwa',
    country: 'Sri Lanka',
    rating: 4.8,
    reviews: 2000,
    price: {
      from: 10,
      to: 120,
    },
    description: 'Polonnaruwa, a UNESCO World Heritage site, reveals ancient Sri Lankan grandeur through its remarkably preserved ruins of palaces, temples, and statues.',
    image: '/destinations/Polonnaruwa/cover.JPG',
    gallery: [
      '/destinations/Polonnaruwa/cover.JPG',
      '/destinations/Polonnaruwa/lake.jpeg',
      '/destinations/Polonnaruwa/pic.jpeg',
    ],
    highlights: [
      'Marvel at the Royal Palace ruins',
      'Discover the sacred Quadrangle',
      'Admire the Gal Vihara Buddha statues',
      'Explore the massive Lankatilaka temple',
      'Wander by the Parakrama Samudra lak'
    ],
    bestTimeToVisit: 'January to December',
    weather: {
      spring: 'Warm and dry',
      summer: 'Hot and rainy',
      autumn: 'Pleasant and dry',
      winter: 'Cool and dry'
    },
    transportation: [
      'Tuk-tuk',
      'Private car',
      'Tour bus',
      'Local bus/train'
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