import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 🔥 Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// 🎨 Custom Icons
const startIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
  iconSize: [32, 32],
});

const endIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize: [32, 32],
});

const currentIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png', // 👤 icon
  iconSize: [35, 35],
});

// 🧠 Cache
const addressCache: Record<string, string> = {};

// 📍 Reverse Geocode
const getAddress = async (lat: number, lng: number): Promise<string> => {
  const key = `${lat},${lng}`;
  if (addressCache[key]) return addressCache[key];

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: { 'User-Agent': 'tracking-app' },
      }
    );

    const json = await res.json();
    const addr = json?.display_name || `${lat}, ${lng}`;

    addressCache[key] = addr;
    return addr;
  } catch {
    return `${lat}, ${lng}`;
  }
};

// 📍 Marker Component
const PointMarker: React.FC<{
  pos: [number, number];
  label: string;
  icon?: L.Icon;
}> = ({ pos, label, icon }) => {
  const [address, setAddress] = useState('Click to load...');
  const [loaded, setLoaded] = useState(false);

  const handleOpen = async () => {
    if (loaded) return;
    setAddress('Loading...');
    const addr = await getAddress(pos[0], pos[1]);
    setAddress(addr);
    setLoaded(true);
  };

  return (
    <Marker position={pos} icon={icon}>
      <Popup eventHandlers={{ add: handleOpen }}>
        <div style={{ minWidth: 200 }}>
          <b>{label}</b>
          <br />
          <span style={{ fontSize: 12 }}>{address}</span>
        </div>
      </Popup>
    </Marker>
  );
};

// 🚀 MAIN MAP
const Map: React.FC<any> = ({ data }) => {
  const [positions, setPositions] = useState<[number, number][]>([]);

  useEffect(() => {
    if (data?.path) {
      // 🔥 remove duplicate points
      const unique = data.path.filter(
        (p: any, i: number, arr: any[]) =>
          i === 0 || p[0] !== arr[i - 1][0] || p[1] !== arr[i - 1][1]
      );

      setPositions(unique);
    }
  }, [data]);

  const start = positions[0];
  const end = positions[positions.length - 1];

  const current = data?.currentLocation
    ? [data.currentLocation.lat, data.currentLocation.lng]
    : null;

  return (
    <div style={{ height: '65vh', width: '100%', marginTop: 20 }}>
      <MapContainer
        center={current || start || [26.83865, 75.78781]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ✅ Polyline */}
        {positions.length > 0 && (
          <Polyline
            positions={positions}
            pathOptions={{ color: 'blue', weight: 4 }}
          />
        )}

        {/* 🟢 Start */}
        {start && <PointMarker pos={start} label="🟢 Start" icon={startIcon} />}

        {/* 🔴 End */}
        {end && <PointMarker pos={end} label="🔴 End" icon={endIcon} />}

        {/* 👤 Current Location */}
        {current && (
          <PointMarker
            pos={current as [number, number]}
            label="👤 Current Location"
            icon={currentIcon}
          />
        )}

        {/* 📍 Optional: intermediate points (light markers) */}
        {positions.slice(1, -1).map((pos, i) => (
          <Marker key={i} position={pos} />
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
