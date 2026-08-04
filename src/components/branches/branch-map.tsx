'use client';

import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useMemo } from 'react';

import { branches, directionsUrl, formatAddress, type Branch } from '@/content/branches';
import { cn } from '@/lib/utils';

/**
 * OpenStreetMap via Leaflet.
 *
 * Deliberately not Google Maps: this project's promise is that it deploys to Vercel with
 * no additional work, and the Google Maps JavaScript API needs a billing-enabled key
 * before it renders a single tile. OSM needs nothing. Directions links still point at
 * Google Maps by Place ID, so members get the routing they expect.
 *
 * Leaflet's default marker icons resolve to a CDN path that breaks under a bundler, so
 * the marker below is an inline SVG divIcon in the brand palette instead.
 */
const markerIcon = (index: number) =>
  L.divIcon({
    className: 'abh-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 34],
    popupAnchor: [0, -30],
    html: `
      <span style="
        display:flex;align-items:center;justify-content:center;
        width:36px;height:36px;border-radius:50% 50% 50% 4px;
        transform:rotate(-45deg);
        background:linear-gradient(135deg,#E11B22,#8E0F17);
        border:2px solid #C9A227;
        box-shadow:0 8px 20px rgba(0,0,0,.6);
      ">
        <span style="
          transform:rotate(45deg);color:#F5F2ED;
          font:600 13px/1 ui-monospace,monospace;
        ">${index}</span>
      </span>`,
  });

type BranchMapProps = {
  /** Render one branch, or leave undefined to plot all three. */
  branch?: Branch;
  className?: string;
  zoom?: number;
};

export function BranchMap({ branch, className, zoom }: BranchMapProps) {
  const shown = useMemo(() => (branch ? [branch] : branches), [branch]);

  const centre = useMemo<[number, number]>(() => {
    if (branch) return [branch.coordinates.lat, branch.coordinates.lng];
    const lat = shown.reduce((sum, entry) => sum + entry.coordinates.lat, 0) / shown.length;
    const lng = shown.reduce((sum, entry) => sum + entry.coordinates.lng, 0) / shown.length;
    return [lat, lng];
  }, [branch, shown]);

  return (
    <div className={cn('relative overflow-hidden rounded-lg border border-brand-chalk/10', className)}>
      <MapContainer
        center={centre}
        zoom={zoom ?? (branch ? 16 : 13)}
        scrollWheelZoom={false}
        className="h-full w-full"
        // The dark basemap is a CSS filter rather than a paid dark tile set.
        style={{ background: '#08070A' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="[filter:invert(1)_hue-rotate(180deg)_brightness(0.82)_contrast(1.1)_saturate(0.6)]"
        />
        {shown.map((entry) => (
          <Marker
            key={entry.slug}
            position={[entry.coordinates.lat, entry.coordinates.lng]}
            icon={markerIcon(entry.index)}
          >
            <Popup>
              <strong style={{ display: 'block', marginBottom: 4 }}>{entry.name}</strong>
              <span style={{ display: 'block', marginBottom: 6 }}>{formatAddress(entry)}</span>
              <a href={directionsUrl(entry)} target="_blank" rel="noopener noreferrer">
                Get directions
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default BranchMap;
