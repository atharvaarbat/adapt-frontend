
import React from 'react';
import { Route } from '@/types';
import { Clock, Navigation, AlertTriangle } from 'lucide-react';

interface RouteDisplayProps {
  routes: Route[];
  onRouteSelect: (routeId: string) => void;
  selectedRouteId?: string;
}

const RouteDisplay: React.FC<RouteDisplayProps> = ({
  routes,
  onRouteSelect,
  selectedRouteId,
}) => {
  // Function to format duration in minutes to hours and minutes
  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours} hr`;
    } else {
      return `${hours} hr ${mins} min`;
    }
  };

  // Function to format distance in kilometers
  const formatDistance = (kilometers: number): string => {
    return `${kilometers.toFixed(1)} km`;
  };

  return (
    <div className="w-full space-y-3 animate-fade-in">
      <h3 className="text-sm font-medium text-convoy-darkGray">Available Routes:</h3>
      <div className="space-y-2">
        {routes.map(route => (
          <div
            key={route.id}
            onClick={() => onRouteSelect(route.id)}
            className={`
              p-3 rounded-lg cursor-pointer transition-all duration-200
              border ${selectedRouteId === route.id ? 'border-convoy-blue' : 'border-convoy-lightGray'}
              ${selectedRouteId === route.id ? 'bg-convoy-blue bg-opacity-5' : 'bg-white hover:bg-convoy-lightGray hover:bg-opacity-10'}
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className={`
                    w-3 h-3 rounded-full
                    ${route.isRecommended ? 'bg-convoy-blue' : 'bg-convoy-gray'}
                  `}
                />
                <span className="font-medium">
                  {route.isRecommended ? 'Recommended Route' : route.name}
                </span>
                {route.isRecommended && (
                  <span className="text-xs px-2 py-0.5 bg-convoy-blue text-white rounded-full">
                    Recommended
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between text-sm text-convoy-darkGray">
              <div className="flex items-center gap-1">
                <Navigation className="w-4 h-4 text-convoy-gray" />
                <span>{formatDistance(route.distance)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-convoy-gray" />
                <span>{formatDuration(route.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-4 h-4 text-convoy-gray" />
                <span>{route.isRecommended ? 'Low Risk' : 'Medium Risk'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteDisplay;
