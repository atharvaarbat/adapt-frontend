
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Layers, Loader2 } from 'lucide-react';
import { Location, MapSettings, Route, ThreatZone } from '@/types';
import { initializeMap, getMapStyle, addLocationMarker, drawRoute, drawThreatZone, fitBounds, setMapboxToken } from '@/utils/mapUtils';

interface MapViewProps {
  pointA: Location | null;
  pointB: Location | null;
  routes: Route[];
  threatZones: ThreatZone[];
  selectedRouteId?: string;
  onMapReady: () => void;
}

const MapView: React.FC<MapViewProps> = ({
  pointA,
  pointB,
  routes,
  threatZones,
  selectedRouteId,
  onMapReady,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapSettings, setMapSettings] = useState<MapSettings>({
    style: 'default',
    zoom: 9,
    center: [-74.5, 40], // Default to New York area
  });
  const [isLoading, setIsLoading] = useState(true);
  const [mapboxToken, setMapboxTokenState] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);

  // Initialize map when token is provided
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || map.current) return;
    
    try {
      setMapboxToken(mapboxToken);
      const newMap = initializeMap(mapContainer.current, mapSettings);
      
      newMap.on('load', () => {
        map.current = newMap;
        setIsLoading(false);
        onMapReady();
      });
      
      newMap.on('error', (e) => {
        console.error('Map error:', e);
        setIsLoading(false);
        // Reset token if invalid
        if (e.error?.status === 401) {
          setShowTokenInput(true);
        }
      });
      
      return () => {
        newMap.remove();
      };
    } catch (error) {
      console.error('Map initialization error:', error);
      setIsLoading(false);
    }
  }, [mapboxToken, mapSettings, onMapReady]);

  // Update map when points change
  useEffect(() => {
    if (!map.current) return;
    
    // Add markers for points
    const markers: mapboxgl.Marker[] = [];
    
    if (pointA) {
      const marker = addLocationMarker(map.current, pointA, '#235789');
      markers.push(marker);
    }
    
    if (pointB) {
      const marker = addLocationMarker(map.current, pointB, '#4C956C');
      markers.push(marker);
    }
    
    // Fit map to bounds if both points exist
    if (pointA && pointB) {
      fitBounds(map.current, [pointA.coordinates, pointB.coordinates], 100);
    }
    
    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [pointA, pointB]);

  // Update routes on map
  useEffect(() => {
    if (!map.current || routes.length === 0) return;
    
    routes.forEach(route => {
      const isActive = route.id === selectedRouteId;
      drawRoute(map.current!, route, isActive);
    });
    
    // Fit map to display all routes
    if (routes.length > 0) {
      const allCoordinates = routes.flatMap(route => route.coordinates);
      fitBounds(map.current, allCoordinates);
    }
  }, [routes, selectedRouteId]);

  // Draw threat zones
  useEffect(() => {
    if (!map.current || threatZones.length === 0) return;
    
    threatZones.forEach(zone => {
      drawThreatZone(map.current!, zone);
    });
  }, [threatZones]);

  // Change map style
  const handleStyleChange = (style: MapSettings['style']) => {
    if (!map.current) return;
    
    const newSettings = { ...mapSettings, style };
    setMapSettings(newSettings);
    map.current.setStyle(getMapStyle(style));
  };

  // Handle token submission
  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const token = formData.get('mapboxToken') as string;
    
    if (token) {
      setMapboxTokenState(token);
      setShowTokenInput(false);
    }
  };

  return (
    <div className="relative h-full rounded-lg overflow-hidden border border-convoy-lightGray shadow-lg bg-white">
      {/* Map Container */}
      {showTokenInput ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white p-6">
          <div className="w-full max-w-md">
            <h3 className="text-lg font-semibold text-convoy-darkBlue mb-4">Mapbox Token Required</h3>
            <p className="text-sm text-convoy-gray mb-4">
              Please enter your Mapbox public token to display the map. You can get one from the 
              <a href="https://mapbox.com/" className="text-convoy-blue hover:underline" target="_blank" rel="noreferrer"> Mapbox dashboard</a>.
            </p>
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <input
                type="text"
                name="mapboxToken"
                placeholder="Enter your Mapbox public token"
                className="w-full p-2 border border-convoy-lightGray rounded"
                required
              />
              <Button type="submit" className="w-full bg-convoy-blue hover:bg-convoy-darkBlue text-white transition-colors duration-200">
                Submit Token
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <>
          <div ref={mapContainer} className="absolute inset-0" />
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
              <div className="flex flex-col items-center">
                <Loader2 className="animate-spin text-convoy-blue w-10 h-10 mb-2" />
                <span className="text-convoy-darkGray">Loading map...</span>
              </div>
            </div>
          )}
          
          {/* Map Type Selector */}
          <div className="absolute top-4 right-4 z-10">
            <Button 
              type="button"
              variant="outline"
              className="bg-white shadow-md border border-convoy-lightGray"
              onClick={() => {
                const styles: MapSettings['style'][] = ['default', 'satellite', 'terrain'];
                const currentIndex = styles.indexOf(mapSettings.style);
                const nextIndex = (currentIndex + 1) % styles.length;
                handleStyleChange(styles[nextIndex]);
              }}
            >
              <Layers className="w-4 h-4 mr-2" />
              <span className="capitalize">{mapSettings.style} View</span>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MapView;
