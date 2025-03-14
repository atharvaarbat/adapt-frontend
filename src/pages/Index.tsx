
import React, { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import MapView from '@/components/MapView';
import ActionButtons from '@/components/ActionButtons';
import { Location, Route, ThreatZone, Priority } from '@/types';
import { toast } from '@/components/ui/use-toast';
import RouteView from '@/components/RouteView';

const Index = () => {
  const [pointA, setPointA] = useState<Location | null>(null);
  const [pointB, setPointB] = useState<Location | null>(null);
  const [convoySize, setConvoySize] = useState<string | null>(null);
  const [areasToAvoid, setAreasToAvoid] = useState<string[] | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [threatZones, setThreatZones] = useState<ThreatZone[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | undefined>();
  const [isMapReady, setIsMapReady] = useState(false);

  // Generate mock routes when both points and all parameters are set
  useEffect(() => {
    if (pointA && pointB && convoySize && areasToAvoid && priority) {
      // Simulate route calculation
      setTimeout(() => {
        const mockRoutes: Route[] = [
          {
            id: '1',
            name: 'Main Route',
            distance: 45.7,
            duration: 53, // minutes
            coordinates: generateRouteCoordinates(pointA.coordinates, pointB.coordinates, 0),
            isRecommended: true,
          },
          {
            id: '2',
            name: 'Alternative Route A',
            distance: 52.3,
            duration: 67, // minutes
            coordinates: generateRouteCoordinates(pointA.coordinates, pointB.coordinates, 0.02),
            isRecommended: false,
          },
          {
            id: '3',
            name: 'Alternative Route B',
            distance: 61.9,
            duration: 72, // minutes
            coordinates: generateRouteCoordinates(pointA.coordinates, pointB.coordinates, -0.03),
            isRecommended: false,
          },
        ];
        
        const mockThreats: ThreatZone[] = [
          {
            id: '1',
            name: 'High Risk Zone Alpha',
            riskScore: 8.5,
            coordinates: generatePolygon(
              [(pointA.coordinates[0] + pointB.coordinates[0]) / 2 + 0.05, 
               (pointA.coordinates[1] + pointB.coordinates[1]) / 2 + 0.05],
              0.05
            ),
          },
          {
            id: '2',
            name: 'Medium Risk Zone Bravo',
            riskScore: 5.2,
            coordinates: generatePolygon(
              [(pointA.coordinates[0] + pointB.coordinates[0]) / 2 - 0.08, 
               (pointA.coordinates[1] + pointB.coordinates[1]) / 2 - 0.02],
              0.03
            ),
          },
        ];
        
        setRoutes(mockRoutes);
        setThreatZones(mockThreats);
        setSelectedRouteId(mockRoutes[0].id);
      }, 2000);
    }
  }, [pointA, pointB, convoySize, areasToAvoid, priority]);

  // Helper function to generate route coordinates
  const generateRouteCoordinates = (
    start: [number, number],
    end: [number, number],
    offset: number
  ): [number, number][] => {
    const result: [number, number][] = [];
    const steps = 10;
    
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const lng = start[0] + (end[0] - start[0]) * ratio + Math.sin(ratio * Math.PI) * offset;
      const lat = start[1] + (end[1] - start[1]) * ratio + Math.cos(ratio * Math.PI) * offset;
      result.push([lng, lat]);
    }
    
    return result;
  };

  // Helper function to generate polygon coordinates for threat zones
  const generatePolygon = (center: [number, number], radius: number): [number, number][] => {
    const sides = 6;
    const result: [number, number][] = [];
    
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * 2 * Math.PI;
      const lng = center[0] + Math.cos(angle) * radius;
      const lat = center[1] + Math.sin(angle) * radius;
      result.push([lng, lat]);
    }
    
    return result;
  };

  // Handle location submission
  const handleLocationSubmit = (point: string, location: Location) => {
    if (point === 'Point A') {
      setPointA(location);
    } else if (point === 'Point B') {
      setPointB(location);
    }
  };

  // Handle convoy size selection
  const handleConvoySizeSelect = (size: string) => {
    setConvoySize(size);
  };

  // Handle areas to avoid selection
  const handleAreasToAvoidSelect = (areas: string[]) => {
    setAreasToAvoid(areas);
  };

  // Handle priority selection
  const handlePrioritySelect = (priority: Priority) => {
    setPriority(priority);
  };

  // Handle route selection
  const handleRouteSelect = (routeId: string) => {
    setSelectedRouteId(routeId);
  };

  // Handle clear chat
  const handleClearChat = () => {
    setPointA(null);
    setPointB(null);
    setConvoySize(null);
    setAreasToAvoid(null);
    setPriority(null);
    setRoutes([]);
    setThreatZones([]);
    setSelectedRouteId(undefined);
    
    toast({
      title: "Chat Cleared",
      description: "All route planning data has been reset.",
    });
  };

  // Handle download route
  const handleDownloadRoute = () => {
    if (!selectedRouteId) {
      toast({
        title: "Error",
        description: "Please select a route to download.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedRoute = routes.find(route => route.id === selectedRouteId);
    if (!selectedRoute) return;
    
    // In a real application, generate a GPX or PDF file
    // For this demo, we'll just show a success toast
    setTimeout(() => {
      toast({
        title: "Route Downloaded",
        description: `${selectedRoute.name} has been downloaded successfully.`,
      });
    }, 1000);
  };

  // Handle feedback
  const handleFeedback = () => {
    // In a real application, open a feedback form
    // For this demo, just show a toast
    toast({
      title: "Feedback",
      description: "Thank you for your feedback! It helps us improve.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-convoy-lightGray">
      <div className="container mx-auto p-4 md:p-6">
        {/* Action Buttons */}
        {/* <div className="mb-6 animate-slide-up">
          <ActionButtons
            onClearChat={handleClearChat}
            onDownloadRoute={handleDownloadRoute}
            onFeedback={handleFeedback}
          />
        </div> */}
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-110px)] min-h-[500px]">
          {/* Chat Interface */}
          <div className="h-full animate-slide-in">
            <ChatInterface
              onLocationSubmit={handleLocationSubmit}
              onConvoySizeSelect={handleConvoySizeSelect}
              onAreasToAvoidSelect={handleAreasToAvoidSelect}
              onPrioritySelect={handlePrioritySelect}
              onRouteSelect={handleRouteSelect}
              routes={routes}
              selectedRouteId={selectedRouteId}
              pointA={pointA}
              pointB={pointB}
            />
          </div>
          
          {/* Map View */}
          <div className="h-full animate-slide-in">
           
            <RouteView response={{
                "route": [
                    [
                        19,
                        "Village S",
                        "2024-07-08",
                        2,
                        "Village",
                        [
                            100,
                            110
                        ],
                        6
                    ],
                    [
                        18,
                        "Bridge R",
                        "2024-06-25",
                        1,
                        "Bridge",
                        [
                            95,
                            105
                        ],
                        10
                    ],
                    [
                        20,
                        "City T",
                        "2024-08-13",
                        1,
                        "City",
                        [
                            105,
                            115
                        ],
                        1
                    ]
                ],
                "total_cost": 1100257
            }}/>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Index;
