
import mapboxgl from 'mapbox-gl';
import { Location, Route, ThreatZone, MapSettings } from '../types';

// Temporary access token - should be replaced with user's token or use environment variables
let mapboxAccessToken = '';

export const setMapboxToken = (token: string) => {
  mapboxAccessToken = token;
  mapboxgl.accessToken = token;
};

export const getMapboxToken = () => mapboxAccessToken;

export const initializeMap = (
  container: HTMLElement,
  settings: MapSettings
): mapboxgl.Map => {
  const map = new mapboxgl.Map({
    container,
    style: getMapStyle(settings.style),
    center: settings.center,
    zoom: settings.zoom,
    attributionControl: false,
  });

  // Add navigation controls
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');
  
  return map;
};

export const getMapStyle = (style: MapSettings['style']): string => {
  switch (style) {
    case 'satellite':
      return 'mapbox://styles/mapbox/satellite-streets-v12';
    case 'terrain':
      return 'mapbox://styles/mapbox/outdoors-v12';
    case 'default':
    default:
      return 'mapbox://styles/mapbox/light-v11';
  }
};

export const addLocationMarker = (
  map: mapboxgl.Map,
  location: Location,
  color: string = '#235789'
): mapboxgl.Marker => {
  const markerElement = document.createElement('div');
  markerElement.className = 'w-6 h-6 rounded-full bg-convoy-blue map-marker-pulse flex items-center justify-center';
  markerElement.style.backgroundColor = color;
  
  const innerDot = document.createElement('div');
  innerDot.className = 'w-3 h-3 rounded-full bg-white';
  markerElement.appendChild(innerDot);
  
  const marker = new mapboxgl.Marker(markerElement)
    .setLngLat(location.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${location.name}</h3>`))
    .addTo(map);
  
  return marker;
};

export const drawRoute = (
  map: mapboxgl.Map,
  route: Route,
  isActive: boolean = false
): void => {
  const sourceId = `route-${route.id}`;
  const layerId = `route-line-${route.id}`;
  
  // Add source if it doesn't exist
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route.coordinates,
        },
      },
    });
  }
  
  // Add layer if it doesn't exist
  if (!map.getLayer(layerId)) {
    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': route.isRecommended ? '#235789' : '#8C8C8C',
        'line-width': route.isRecommended ? 5 : 3,
        'line-opacity': isActive ? 1 : 0.7,
      },
    });
  } else {
    // Update existing layer
    map.setPaintProperty(layerId, 'line-color', route.isRecommended ? '#235789' : '#8C8C8C');
    map.setPaintProperty(layerId, 'line-width', route.isRecommended ? 5 : 3);
    map.setPaintProperty(layerId, 'line-opacity', isActive ? 1 : 0.7);
    
    // Update source data
    const source = map.getSource(sourceId) as mapboxgl.GeoJSONSource;
    source.setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route.coordinates,
      },
    });
  }
};

export const drawThreatZone = (
  map: mapboxgl.Map,
  threatZone: ThreatZone
): void => {
  const sourceId = `threat-${threatZone.id}`;
  const layerId = `threat-fill-${threatZone.id}`;
  const outlineLayerId = `threat-outline-${threatZone.id}`;
  
  // Add source if it doesn't exist
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {
          name: threatZone.name,
          riskScore: threatZone.riskScore,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [threatZone.coordinates],
        },
      },
    });
  }
  
  // Add fill layer if it doesn't exist
  if (!map.getLayer(layerId)) {
    map.addLayer({
      id: layerId,
      type: 'fill',
      source: sourceId,
      paint: {
        'fill-color': '#C14953',
        'fill-opacity': 0.3,
      },
    });
  }
  
  // Add outline layer if it doesn't exist
  if (!map.getLayer(outlineLayerId)) {
    map.addLayer({
      id: outlineLayerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': '#C14953',
        'line-width': 2,
        'line-dasharray': [2, 2],
      },
    });
  }
};

export const fitBounds = (
  map: mapboxgl.Map,
  coordinates: [number, number][],
  padding: number = 50
): void => {
  if (coordinates.length === 0) return;
  
  const bounds = coordinates.reduce(
    (bounds, coord) => bounds.extend(coord),
    new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
  );
  
  map.fitBounds(bounds, { padding });
};

export const clearMap = (map: mapboxgl.Map): void => {
  // Get all sources
  const sources = map.getStyle().sources;
  
  // Remove all layers and sources except for the base map
  for (const sourceId in sources) {
    if (sourceId !== 'composite' && sourceId !== 'mapbox' && sourceId.indexOf('mapbox-') !== 0) {
      // Remove all layers that use this source
      map.getStyle().layers.forEach(layer => {
        if (layer.source === sourceId) {
          if (map.getLayer(layer.id)) {
            map.removeLayer(layer.id);
          }
        }
      });
      
      // Remove the source
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
    }
  }
};
