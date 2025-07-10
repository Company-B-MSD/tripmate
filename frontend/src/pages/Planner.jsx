import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Route,
  Sparkles,
  Clock,
  Navigation,
  ChevronRight,
  Info,
  TrendingUp,
  MapIcon,
  Lightbulb,
} from "lucide-react";
import { api } from "@/lib/api";

const Planner = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [days, setDays] = useState("");
  const [people, setPeople] = useState("");
  const [budget, setBudget] = useState("");
  const [preferences, setPreferences] = useState("");
  const [directions, setDirections] = useState(null);
  const [attractions, setAttractions] = useState([]);
  const [suggestedPlaces, setSuggestedPlaces] = useState([]);
  const [itinerary, setItinerary] = useState("");
  const [parsedResponse, setParsedResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(1);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [optimizedRoute, setOptimizedRoute] = useState(null);
  const location = useLocation();

  // Only run this when component mounts and if tripQuery is present
  useEffect(() => {
      setTimeout(() => {
        window.scrollTo(0,0);
      }, 0);
    if (location.state && location.state.tripQuery) {
      const tripQuery = location.state.tripQuery;
      setPreferences(tripQuery);
    }
    // eslint-disable-next-line
  }, []);

  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markersRef = useRef([]);

  const containerStyle = {
    width: "100%",
    height: "500px",
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

  const onMapLoad = (map) => {
    googleMapRef.current = map;
    setIsMapLoaded(true);
  };

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
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
        setError(`Could not find location: ${place}`);
        callback(null);
      }
    });
  };

  const findAttractions = (path) => {
    if (!googleMapRef.current || !window.google) {
      return;
    }

    setTimeout(() => {
      try {
        const placesService = new window.google.maps.places.PlacesService(
          googleMapRef.current
        );

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

        const handleSearchResult = (results, status) => {
          completedSearches++;

          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            const newAttractions = results.filter((place) => {
              const isDuplicate = allAttractions.some(
                (existing) => existing.place_id === place.place_id
              );
              if (isDuplicate) return false;

              const placeLocation = place.geometry.location;
              const placeLat =
                typeof placeLocation.lat === "function"
                  ? placeLocation.lat()
                  : placeLocation.lat;
              const placeLng =
                typeof placeLocation.lng === "function"
                  ? placeLocation.lng()
                  : placeLocation.lng;

              const isNearRoute = path.some((pathPoint) => {
                const pathLat =
                  typeof pathPoint.lat === "function"
                    ? pathPoint.lat()
                    : pathPoint.lat;
                const pathLng =
                  typeof pathPoint.lng === "function"
                    ? pathPoint.lng()
                    : pathPoint.lng;

                const latDiff = Math.abs(placeLat - pathLat);
                const lngDiff = Math.abs(placeLng - pathLng);
                const roughDistance = Math.sqrt(
                  latDiff * latDiff + lngDiff * lngDiff
                );

                return roughDistance < 0.08;
              });

              return isNearRoute;
            });

            const ratedAttractions = newAttractions.map((place) => ({
              ...place,
              priority:
                (place.rating || 3) + (place.user_ratings_total || 0) / 1000,
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
            typeof point.lat === "function" ? point.lat() : point.lat,
            typeof point.lng === "function" ? point.lng() : point.lng
          );

          const request = {
            location: googleLatLng,
            radius: 20000,
            types: ["tourist_attraction"],
          };

          setTimeout(() => {
            placesService.nearbySearch(request, (results, status) => {
              handleSearchResult(results, status);
            });
          }, index * 150);
        });
      } catch (serviceError) {
        console.error("Error finding attractions:", serviceError);
        setError("Error finding attractions along the route");
      }
    }, 500);
  };

  const createOptimizedRoute = async () => {
    if (
      !parsedResponse?.recommendedPlaces ||
      !googleMapRef.current ||
      !window.google
    )
      return;

    const directionsService = new window.google.maps.DirectionsService();

    // Use recommended places from AI response
    const placesToVisit = parsedResponse.recommendedPlaces.slice(0, 8);

    // Create waypoints by geocoding the place names
    const waypoints = [];

    for (const place of placesToVisit) {
      try {
        await new Promise((resolve) => {
          geocodePlace(place, (location) => {
            if (location) {
              waypoints.push({
                location: location,
                stopover: true,
              });
            }
            resolve();
          });
        });
      } catch (error) {
        console.error("Error geocoding place:", place, error);
      }
    }

    if (waypoints.length > 0) {
      directionsService.route(
        {
          origin: start,
          destination: end,
          waypoints: waypoints,
          optimizeWaypoints: true,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            setOptimizedRoute(result);
            setDirections(result);

            // Add markers for waypoints
            clearMarkers();
            result.routes[0].waypoint_order.forEach((waypointIndex, index) => {
              const waypoint = waypoints[waypointIndex];
              const marker = new window.google.maps.Marker({
                position: waypoint.location,
                map: googleMapRef.current,
                title: placesToVisit[waypointIndex],
                icon: {
                  url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                },
                label: {
                  text: `${index + 1}`,
                  color: "white",
                  fontWeight: "bold",
                },
              });
              markersRef.current.push(marker);
            });
          }
        }
      );
    }
  };

  const parseAIResponse = (responseText) => {
    try {
      const sections = {
        itinerary: "",
        budgetBreakdown: "",
        recommendedPlaces: [],
        travelTips: "",
      };

      // Split response into sections
      const lines = responseText.split("\n");
      let currentSection = "itinerary";

      lines.forEach((line) => {
        const trimmedLine = line.trim();

        // Detect section headers
        if (
          trimmedLine.includes("DETAILED ITINERARY:") ||
          trimmedLine.includes("1. DETAILED ITINERARY:")
        ) {
          currentSection = "itinerary";
          return;
        }
        if (
          trimmedLine.includes("BUDGET BREAKDOWN:") ||
          trimmedLine.includes("3. BUDGET BREAKDOWN:")
        ) {
          currentSection = "budget";
          return;
        }
        if (
          trimmedLine.includes("RECOMMENDED PLACES:") ||
          trimmedLine.includes("4. RECOMMENDED PLACES:")
        ) {
          currentSection = "places";
          return;
        }
        if (
          trimmedLine.includes("TRAVEL TIPS:") ||
          trimmedLine.includes("5. TRAVEL TIPS:")
        ) {
          currentSection = "tips";
          return;
        }

        // Skip JSON section
        if (
          trimmedLine.includes("JSON STRUCTURE:") ||
          trimmedLine.includes("2. JSON STRUCTURE:")
        ) {
          currentSection = "skip";
          return;
        }
        if (currentSection === "skip") {
          if (
            trimmedLine.includes("BUDGET BREAKDOWN:") ||
            trimmedLine.includes("3. BUDGET BREAKDOWN:")
          ) {
            currentSection = "budget";
          }
          return;
        }

        // Handle sections
        if (currentSection === "itinerary") {
          sections.itinerary += line + "\n";
        } else if (currentSection === "budget") {
          sections.budgetBreakdown += line + "\n";
        } else if (currentSection === "places") {
          if (trimmedLine.startsWith("-") || trimmedLine.startsWith("•")) {
            sections.recommendedPlaces.push(
              trimmedLine.replace(/^[-•]\s*/, "")
            );
          } else if (
            trimmedLine &&
            !trimmedLine.includes("RECOMMENDED PLACES")
          ) {
            sections.recommendedPlaces.push(trimmedLine);
          }
        } else if (currentSection === "tips") {
          sections.travelTips += line + "\n";
        }
      });

      return sections;
    } catch (error) {
      console.error("Error parsing AI response:", error);
      return null;
    }
  };

  const handleFindRoute = () => {
    if (!start || !end) {
      setError("Please enter both start and end locations");
      return;
    }

    if (!window.google) {
      setError("Google Maps is not loaded yet. Please try again.");
      return;
    }

    setError("");
    setDirections(null);
    setAttractions([]);
    setActiveStep(2);

    geocodePlace(start, (startLocation) => {
      if (!startLocation) return;

      geocodePlace(end, (endLocation) => {
        if (!endLocation) return;

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: startLocation,
            destination: endLocation,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK") {
              setDirections(result);
              findAttractions(result.routes[0].overview_path);
            } else {
              setError("Could not find route between the locations");
            }
          }
        );
      });
    });
  };

  const handleGeneratePlan = async () => {
    if (!start || !end || !days || !people || !budget) {
      setError("Please fill all required fields");
      return;
    }

    if (attractions.length === 0) {
      setError("Please find route and attractions first");
      return;
    }

    setIsLoading(true);
    setError("");
    setActiveStep(3);

    const requestData = {
      start,
      end,
      days: parseInt(days),
      people: parseInt(people),
      budget: parseInt(budget),
      notes: preferences,
      customPlaces: attractions.slice(0, 10).map((place) => place.name),
    };

    try {
      const response = await api.planTrip(requestData);

      if (!response.data) {
        throw new Error("Failed to generate trip plan");
      }

      const results = response.data;
      console.log(results);
      setItinerary(results.itineraryText);

      // Parse the AI response
      const parsed = parseAIResponse(results.itineraryText);
      if (parsed) {
        setParsedResponse(parsed);
        setSuggestedPlaces(parsed.recommendedPlaces || []);

        // Create optimized route with recommended places
        setTimeout(() => {
          createOptimizedRoute();
        }, 1000);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate trip plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setStart("");
    setEnd("");
    setDays("");
    setPeople("");
    setBudget("");
    setPreferences("");
    setDirections(null);
    setAttractions([]);
    setSuggestedPlaces([]);
    setItinerary("");
    setParsedResponse(null);
    setError("");
    setActiveStep(1);
    setActiveTab("itinerary");
    setOptimizedRoute(null);
    clearMarkers();
  };

  // Load Google Maps script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }&libraries=places`;
      script.async = true;
      script.onload = () => {
        if (mapRef.current) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: center,
            zoom: 7,
            restriction: { latLngBounds: sriLankaBounds, strictBounds: false },
            styles: [
              {
                featureType: "all",
                elementType: "geometry",
                stylers: [{ color: "#1d2c4d" }],
              },
              {
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: [{ color: "#8ec3b9" }],
              },
              {
                featureType: "all",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#1a3646" }],
              },
              {
                featureType: "administrative.country",
                elementType: "geometry.stroke",
                stylers: [{ color: "#4b6878" }],
              },
              {
                featureType: "landscape",
                elementType: "geometry",
                stylers: [{ color: "#2c5a85" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#34495e" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#0e1626" }],
              },
            ],
          });
          onMapLoad(map);
        }
      };
      document.head.appendChild(script);
    } else {
      if (mapRef.current && !googleMapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: center,
          zoom: 7,
          restriction: { latLngBounds: sriLankaBounds, strictBounds: false },
        });
        onMapLoad(map);
      }
    }
  }, []);

  // Update map when directions change
  useEffect(() => {
    if (directions && googleMapRef.current && window.google) {
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: "#f97316",
          strokeWeight: 4,
          strokeOpacity: 0.8,
        },
      });
      directionsRenderer.setMap(googleMapRef.current);
      directionsRenderer.setDirections(directions);
    }
  }, [directions]);

  // Update markers when attractions change
  useEffect(() => {
    if (attractions.length > 0 && googleMapRef.current && window.google) {
      attractions.forEach((place) => {
        const marker = new window.google.maps.Marker({
          position: place.geometry.location,
          map: googleMapRef.current,
          title: place.name,
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/orange-dot.png",
          },
        });
        markersRef.current.push(marker);
      });
    }
  }, [attractions]);

  const stepProgress = activeStep === 1 ? 33 : activeStep === 2 ? 66 : 100;

  const formatContent = (text) => {
    if (!text) return null;
    const lines = text.split("\n");
    const sections = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) {
        sections.push(<div key={index} className="mb-2"></div>);
        return;
      }

      // Main headings (with ** on both ends and nothing else)
      if (/^\*\*[^*]+\*\*$/.test(trimmedLine)) {
        sections.push(
          <h3
            key={index}
            className="text-lg font-bold text-orange-300 mt-6 mb-3 flex items-center border-b border-orange-300/30 pb-2"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {trimmedLine.replace(/\*\*/g, "")}
          </h3>
        );
        return;
      }

      // Day headings (e.g. **Day 1: ...**)
      if (/^\*\*Day\s*\d+[^*]*\*\*$/.test(trimmedLine)) {
        sections.push(
          <h4
            key={index}
            className="text-md font-semibold text-blue-300 mt-4 mb-2 flex items-center bg-blue-900/30 rounded-lg px-3 py-2"
          >
            <Calendar className="h-4 w-4 mr-2" />
            {trimmedLine.replace(/\*\*/g, "")}
          </h4>
        );
        return;
      }

      // Time-based entries (e.g. **6:00 AM:** ...)
      if (/^\*\*\d{1,2}:\d{2}\s*(AM|PM)\*\*:/.test(trimmedLine)) {
        sections.push(
          <div
            key={index}
            className="ml-4 mb-3 flex items-start bg-gray-700/30 rounded-lg p-3"
          >
            <Clock className="h-4 w-4 mr-3 mt-0.5 text-green-400 flex-shrink-0" />
            <span className="text-gray-200">
              {trimmedLine.replace(/\*\*/g, "")}
            </span>
          </div>
        );
        return;
      }

      // Bullet points with possible bold (e.g. * **Place:** Desc)
      if (/^\*\s+\*\*.+\*\*/.test(trimmedLine)) {
        sections.push(
          <div key={index} className="ml-8 mb-2 flex items-start">
            <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
            <span className="text-gray-200">
              {trimmedLine.replace(/^\*\s*/, "").replace(/\*\*/g, "")}
            </span>
          </div>
        );
        return;
      }

      // Bullet points (with * or - at start)
      if (/^(\*|-)\s+/.test(trimmedLine)) {
        sections.push(
          <div key={index} className="ml-4 mb-2 flex items-start">
            <div className="w-2 h-2 bg-orange-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
            <span className="text-gray-200">
              {trimmedLine.replace(/^(\*|-)\s*/, "")}
            </span>
          </div>
        );
        return;
      }

      // Budget items (containing currency symbols)
      if (line.includes("LKR") || line.includes("$") || line.includes("Rs")) {
        sections.push(
          <div
            key={index}
            className="ml-4 mb-2 flex items-start bg-green-900/20 rounded-lg p-2"
          >
            <DollarSign className="h-4 w-4 mr-2 mt-0.5 text-green-400 flex-shrink-0" />
            <span className="text-gray-200">{line}</span>
          </div>
        );
        return;
      }

      // Location-based entries (Visit, Stop, Explore)
      if (line.match(/\b(Visit|Stop|Explore)\b/)) {
        sections.push(
          <div
            key={index}
            className="ml-4 mb-2 flex items-start bg-blue-900/20 rounded-lg p-2"
          >
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-blue-400 flex-shrink-0" />
            <span className="text-gray-200">{line}</span>
          </div>
        );
        return;
      }

      // Tips and advice
      if (
        line.match(
          /\b(Tip|Note|Remember|IMPORTANT|Flexibility|Safari Booking|Mosquitoes|Cash|Language|Respectful Dress|Water)\b/
        )
      ) {
        sections.push(
          <div
            key={index}
            className="ml-4 mb-2 flex items-start bg-yellow-900/20 rounded-lg p-2"
          >
            <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-yellow-400 flex-shrink-0" />
            <span className="text-gray-200">{line}</span>
          </div>
        );
        return;
      }

      // Regular text
      sections.push(
        <p key={index} className="text-gray-200 mb-2 leading-relaxed">
          {line}
        </p>
      );
    });

    return sections;
  };

  const tabs = [
    { id: "itinerary", label: "Day Plans", icon: Calendar },
    { id: "places", label: "Places", icon: MapPin },
    { id: "budget", label: "Budget", icon: DollarSign },
    { id: "tips", label: "Travel Tips", icon: Lightbulb },
  ];

  const renderTabContent = () => {
    if (!parsedResponse) return null;

    switch (activeTab) {
      case "itinerary":
        return (
          <div className="space-y-4">
            <div className="text-sm leading-relaxed">
              {formatContent(parsedResponse.itinerary)}
            </div>
          </div>
        );

      case "budget":
        return (
          <div className="space-y-4">
            <div className="text-sm leading-relaxed">
              {formatContent(parsedResponse.budgetBreakdown)}
            </div>
          </div>
        );

      case "places":
        return (
          <div className="space-y-3">
            {parsedResponse.recommendedPlaces.map((place, index) => (
              <div
                key={index}
                className="bg-gray-700/50 rounded-lg p-4 flex items-start hover:bg-gray-700/70 transition-colors"
              >
                <div className="bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">{place}</h4>
                  <p className="text-sm text-gray-300">
                    Recommended destination along your route
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      case "tips":
        return (
          <div className="space-y-4">
            <div className="text-sm leading-relaxed">
              {formatContent(parsedResponse.travelTips)}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Progress Bar */}
      <div className="bg-gray-800 px-6 py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">
              Planning Progress
            </span>
            <span className="text-sm font-medium text-orange-400">
              {stepProgress}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stepProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel */}
          <div className="space-y-6">
            {!parsedResponse ? (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
                <h2 className="text-xl font-bold text-orange-400 mb-6 flex items-center">
                  <MapPin className="h-6 w-6 mr-2" />
                  Plan Your Adventure
                </h2>
                {error && (
                  <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-4">
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        From
                      </label>
                      <input
                        type="text"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="e.g., Kandy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Navigation className="h-4 w-4 inline mr-1" />
                        To
                      </label>
                      <input
                        type="text"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="e.g., Colombo"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Days
                      </label>
                      <input
                        type="number"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                        min="1"
                        max="30"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="7"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <Users className="h-4 w-4 inline mr-1" />
                        Travelers
                      </label>
                      <input
                        type="number"
                        value={people}
                        onChange={(e) => setPeople(e.target.value)}
                        min="1"
                        max="20"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <DollarSign className="h-4 w-4 inline mr-1" />
                        Budget (LKR)
                      </label>
                      <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        min="1000"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                        placeholder="50000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Sparkles className="h-4 w-4 inline mr-1" />
                      Preferences & Interests
                    </label>
                    <textarea
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                      rows={4}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                      placeholder="Tell us about your interests, food preferences, accommodation type, activities you enjoy..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleFindRoute}
                      disabled={!start || !end || !isMapLoaded}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:from-gray-600 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed"
                    >
                      <Route className="h-5 w-5 mr-2" />
                      Find Route
                    </button>
                    <button
                      onClick={handleGeneratePlan}
                      disabled={
                        isLoading ||
                        !start ||
                        !end ||
                        !days ||
                        !people ||
                        !budget ||
                        attractions.length === 0
                      }
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-600 disabled:to-gray-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Planning...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-5 w-5 mr-2" />
                          Generate Plan
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {/* Attractions Found */}
                {attractions.length > 0 && (
                  <div className="mt-6 bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-300 mb-3 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Attractions Found ({attractions.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {attractions.slice(0, 8).map((place, idx) => (
                        <div
                          key={place.place_id || idx}
                          className="text-xs text-blue-200 bg-blue-800/50 rounded px-2 py-1"
                        >
                          {place.name} {place.rating && `⭐ ${place.rating}`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
                <h3 className="text-xl font-bold text-orange-400 mb-6 flex items-center">
                  <Sparkles className="h-6 w-6 mr-2" />
                  Your AI-Generated Trip Plan
                </h3>
                {/* Tab Navigation */}
                <div className="flex space-x-2 mb-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-orange-600 text-white shadow"
                          : "bg-gray-700 text-gray-300 hover:bg-orange-800/60"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </div>
                {/* Tab Content */}
                <div className="bg-gray-800/60 rounded-lg p-4 min-h-[240px] max-h-[420px] overflow-y-auto">
                  {!parsedResponse ? (
                    <div className="text-gray-400 italic">
                      No plan generated yet. Please complete the form to get
                      your trip plan.
                    </div>
                  ) : (
                    <>
                      {activeTab === "itinerary" && (
                        <div className="space-y-4">
                          <div className="text-sm leading-relaxed">
                            {formatContent(parsedResponse.itinerary)}
                          </div>
                        </div>
                      )}
                      {activeTab === "budget" && (
                        <div className="space-y-4">
                          <div className="text-sm leading-relaxed">
                            {formatContent(parsedResponse.budgetBreakdown)}
                          </div>
                        </div>
                      )}
                      {activeTab === "places" && (
                        <div className="space-y-3">
                          {parsedResponse.recommendedPlaces.map(
                            (place, idx) => (
                              <div
                                key={idx}
                                className="bg-gray-700/50 rounded-lg p-4 flex items-start hover:bg-gray-700/70 transition-colors"
                              >
                                <div className="bg-orange-500 rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">
                                  <span className="text-white font-bold text-sm">
                                    {idx + 1}
                                  </span>
                                </div>
                                <div>
                                  <h4 className="font-medium text-white mb-1">
                                    {place}
                                  </h4>
                                  <p className="text-sm text-gray-300">
                                    Recommended destination along your route
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                      {activeTab === "tips" && (
                        <div className="space-y-4">
                          <div className="text-sm leading-relaxed">
                            {formatContent(parsedResponse.travelTips)}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="mt-6 flex flex-row-reverse">
                  <button
                    onClick={handleStartOver}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow border border-gray-600"
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Right Panel - Map */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
            <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center">
              <Navigation className="h-6 w-6 mr-2" />
              Your Journey Map
            </h3>
            <div className="bg-gray-700 rounded-lg overflow-hidden">
              <div
                ref={mapRef}
                style={containerStyle}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Planner;
