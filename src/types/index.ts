
export interface Location {
  id: string;
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export interface ConvoySize {
  id: string;
  name: string;
  value: string;
}

export interface AvoidArea {
  id: string;
  name: string;
  value: string;
}

export interface Route {
  id: string;
  name: string;
  distance: number;
  duration: number;
  coordinates: [number, number][]; // Array of [longitude, latitude] points
  isRecommended: boolean;
}

export interface ThreatZone {
  id: string;
  name: string;
  riskScore: number;
  coordinates: [number, number][]; // Array of [longitude, latitude] points defining a polygon
}

export type Priority = 'speed' | 'safety';

export interface MapSettings {
  style: 'default' | 'satellite' | 'terrain';
  zoom: number;
  center: [number, number]; // [longitude, latitude]
}

export interface Message {
  id: string;
  content: string | React.ReactNode;
  sender: 'ai' | 'user';
  timestamp: Date;
}

export interface ConvoyParameters {
  pointA: Location | null;
  pointB: Location | null;
  convoySize: string | null;
  areasToAvoid: string[] | null;
  priority: Priority | null;
}
