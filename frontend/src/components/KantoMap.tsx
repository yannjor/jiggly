'use client';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

const KantoMap = () => {
  const boundX = -199.984375;
  const boundY = 203.9840625;
  const outOfBoundsInt = 25;

  const bounds = L.latLngBounds(L.latLng(boundX, 0), L.latLng(0, boundY));
  const maxBounds = L.latLngBounds(
    L.latLng(boundX - outOfBoundsInt, 0 - outOfBoundsInt),
    L.latLng(0 + outOfBoundsInt, boundY + outOfBoundsInt)
  );

  return (
    <div className="flex justify-center mt-20">
      <MapContainer
        center={[boundX / 2, boundY / 2]}
        crs={L.CRS.Simple}
        markerZoomAnimation={true}
        maxBounds={maxBounds}
        maxBoundsViscosity={1}
        maxZoom={6}
        minZoom={2}
        preferCanvas={true}
        zoom={2}
      >
        <TileLayer
          bounds={bounds}
          tileSize={256}
          tms={false}
          url="/tiles/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default KantoMap;
