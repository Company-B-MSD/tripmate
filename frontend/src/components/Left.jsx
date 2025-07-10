import React, { useRef, useState } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 7.8731,
  lng: 80.7718,
};

const sriLankaBounds = {
  north: 9.8,
  south: 5.9,
  west: 79.8,
  east: 81.9,
};

function Left({
  start, end,
  directions, setDirections,
  attractions, setAttractions,
  routeFinderRef
}) {
  const [startLoc, setStartLoc] = useState(null);
  const [endLoc, setEndLoc] = useState(null);
  const [error, setError] = useState("");
  const mapRef = useRef(null);

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  const geocodePlace = (place, callback) => {
    if (!window.google) {
      return;
    }
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: place }, (results, status) => {
      if (status === "OK" && results[0]) {
        callback(results[0].geometry.location);
      } else {
        setError(`Could not geocode: ${place}`);
        callback(null);
      }
    });
  };

  const handleFindRoute = () => {
    setError("");
    setDirections(null);
    setAttractions([]);
    if (!start || !end) {
      setError("Please enter both start and end locations.");
      return;
    }
    
    geocodePlace(start, (startLocResult) => {
      if (!startLocResult) return;
      setStartLoc(startLocResult);
      
      geocodePlace(end, (endLocResult) => {
        if (!endLocResult) return;
        setEndLoc(endLocResult);
        
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: startLocResult,
            destination: endLocResult,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK") {
              setDirections(result);
              findAttractions(result.routes[0].overview_path);
            } else {
              setError("Could not find route.");
            }
          }
        );
      });
    });
  };

  const findAttractions = (path) => {
    if (!mapRef.current || !window.google) {
      return;
    }
    
    setTimeout(() => {
      try {
        const placesService = new window.google.maps.places.PlacesService(mapRef.current);
        
        const searchPoints = [];
        const stepSize = Math.max(1, Math.floor(path.length / 15));
        
        for (let i = 0; i < path.length; i += stepSize) {
          searchPoints.push(path[i]);
        }
        
        if (searchPoints[searchPoints.length - 1] !== path[path.length - 1]) {
          searchPoints.push(path[path.length - 1]);
        }
        
        let allAttractions = [];
        let completedSearches = 0;
        
        const handleSearchResult = (results, status, pointIndex) => {
          completedSearches++;
          
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            const newAttractions = results.filter(place => {
              const isDuplicate = allAttractions.some(existing => existing.place_id === place.place_id);
              if (isDuplicate) return false;
              
              const placeLocation = place.geometry.location;
              const placeLat = typeof placeLocation.lat === 'function' ? placeLocation.lat() : placeLocation.lat;
              const placeLng = typeof placeLocation.lng === 'function' ? placeLocation.lng() : placeLocation.lng;
              
              const isNearRoute = path.some(pathPoint => {
                const pathLat = typeof pathPoint.lat === 'function' ? pathPoint.lat() : pathPoint.lat;
                const pathLng = typeof pathPoint.lng === 'function' ? pathPoint.lng() : pathPoint.lng;
                
                const latDiff = Math.abs(placeLat - pathLat);
                const lngDiff = Math.abs(placeLng - pathLng);
                const roughDistance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
                
                return roughDistance < 0.08;
              });
              
              return isNearRoute;
            });
            
            const ratedAttractions = newAttractions.map(place => ({
              ...place,
              priority: (place.rating || 3) + (place.user_ratings_total || 0) / 1000
            }));
            
            allAttractions = [...allAttractions, ...ratedAttractions];
          }
          
          if (completedSearches === searchPoints.length) {
            const sortedAttractions = allAttractions
              .sort((a, b) => (b.priority || 0) - (a.priority || 0))
              .slice(0, 20);
            
            setAttractions(sortedAttractions);
          }
        };
        
        searchPoints.forEach((point, index) => {
          const googleLatLng = new window.google.maps.LatLng(
            typeof point.lat === 'function' ? point.lat() : point.lat,
            typeof point.lng === 'function' ? point.lng() : point.lng
          );
          
          const request = {
            location: googleLatLng,
            radius: 20000,
            types: ['tourist_attraction'],
          };
          
          setTimeout(() => {
            placesService.nearbySearch(request, (results, status) => {
              handleSearchResult(results, status, index);
            });
          }, index * 150);
        });
        
      } catch (serviceError) {
        console.error('Error creating PlacesService or calling nearbySearch:', serviceError);
      }
    }, 500);
  };

  React.useEffect(() => {
    if (routeFinderRef) {
      routeFinderRef.current = handleFindRoute;
    }
  }, [start, end]);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
    >
      <div style={{ height: "100vh", width: "100%" }}>
        {error && <div style={{ color: "red", padding: "8px", backgroundColor: "#ffebee", position: "absolute", top: "10px", left: "10px", zIndex: 1000 }}>{error}</div>}
        
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={7}
          onLoad={onMapLoad}
          options={{ restriction: { latLngBounds: sriLankaBounds, strictBounds: false } }}
        >
          {directions && <DirectionsRenderer directions={directions} />}
          {attractions.map((place, idx) => (
            <Marker
              key={place.place_id || idx}
              position={place.geometry.location}
              title={place.name}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
            />
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}

export default Left;
