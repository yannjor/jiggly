'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Feature } from 'geojson';
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MapClickHandler from './MapClickHandler';

interface Props {
  currentFeature: Feature;
  showResult: boolean;
  setCanConfirm: (can: boolean) => void;
  setIsCorrect: (correct: boolean) => void;
}

const KantoMap = ({
  currentFeature,
  showResult,
  setCanConfirm,
  setIsCorrect,
}: Props) => {
  const boundX = -199.984375;
  const boundY = 203.9840625;
  const outOfBoundsInt = 25;

  const bounds = L.latLngBounds(L.latLng(boundX, 0), L.latLng(0, boundY));
  const maxBounds = L.latLngBounds(
    L.latLng(boundX - outOfBoundsInt, 0 - outOfBoundsInt),
    L.latLng(0 + outOfBoundsInt, boundY + outOfBoundsInt),
  );

  return (
    <div className="flex justify-center mt-4">
      <MapContainer
        center={[boundX / 2, boundY / 2]}
        crs={L.CRS.Simple}
        markerZoomAnimation={true}
        maxBounds={maxBounds}
        maxBoundsViscosity={1}
        maxZoom={5}
        minZoom={2}
        preferCanvas={true}
        zoom={2}
      >
        <MapClickHandler
          currentFeature={currentFeature}
          showResult={showResult}
          setCanConfirm={setCanConfirm}
          setIsCorrect={setIsCorrect}
        />
        <TileLayer
          bounds={bounds}
          tileSize={256}
          tms={false}
          url={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/tiles/{z}/{x}/{y}.png`}
        />
      </MapContainer>
    </div>
  );
};

export default KantoMap;
