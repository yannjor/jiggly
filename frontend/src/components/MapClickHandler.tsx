'use client';

import geojsondata from '@/data/GeoJSON';
import type { GeoJsonObject, Feature } from 'geojson';
import L, { Icon, type LeafletMouseEvent } from 'leaflet';
import defaultIconPng from 'leaflet/dist/images/marker-icon.png';
import React, { useEffect, useState } from 'react';
import { GeoJSON, Marker, useMapEvents } from 'react-leaflet';

interface Props {
  currentFeature: Feature;
  showResult: boolean;
  setCanConfirm: (can: boolean) => void;
  setIsCorrect: (correct: boolean) => void;
}

const MapClickHandler = ({
  currentFeature,
  showResult,
  setCanConfirm,
  setIsCorrect,
}: Props) => {
  const [markerPosition, setMarkerPosition] = useState<L.LatLng | null>(null);
  const [userGuessed, setUserGuessed] = useState(false);
  const currentPolygon = currentFeature.geometry;

  const isPointInFeature = (latlng: L.LatLng, feature: Feature): boolean => {
    const geometry = feature.geometry;

    if (geometry.type === 'Polygon') {
      const polygon_layer = L.geoJSON(geometry as GeoJsonObject);
      return polygon_layer.getBounds().contains(latlng);
    } else if (geometry.type === 'MultiPolygon') {
      // For MultiPolygon, check each polygon in the coordinates array
      return geometry.coordinates.some((polygonCoords) => {
        const tempPolygon = {
          type: 'Polygon' as const,
          coordinates: polygonCoords,
        };
        const polygon_layer = L.geoJSON(tempPolygon as GeoJsonObject);
        return polygon_layer.getBounds().contains(latlng);
      });
    }
    return false;
  };

  const map = useMapEvents({
    click: (e: LeafletMouseEvent) => {
      if (showResult) return;

      setMarkerPosition(e.latlng);
      const clickedFeature = geojsondata.features.find((feature) => {
        return isPointInFeature(e.latlng, feature as Feature);
      });

      setCanConfirm(true);
      setIsCorrect(clickedFeature === currentFeature);
    },
  });

  useEffect(() => {
    if (showResult) {
      setUserGuessed(true);
      const center = L.geoJSON(currentPolygon).getBounds().getCenter();
      map.panTo(center, { duration: 0.5, animate: true });
    } else {
      setUserGuessed(false);
      setMarkerPosition(null);
    }
  }, [showResult]);

  const defaultIcon = new Icon({
    iconUrl: defaultIconPng.src,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <div>
      {markerPosition && (
        <Marker icon={defaultIcon} position={markerPosition} />
      )}
      {userGuessed && (
        <GeoJSON
          data={currentPolygon}
          style={() => ({
            color: '#800080', // Outline color
            fillColor: '#800080', // Fill color
            weight: 5, // Outline thickness
            fillOpacity: 0.5, // Opacity of fill
          })}
        />
      )}
    </div>
  );
};

export default MapClickHandler;
