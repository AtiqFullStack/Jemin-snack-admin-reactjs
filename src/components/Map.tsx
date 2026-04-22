import { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  CircleMarker,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const startIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
  iconSize: [32, 32],
});

const endIcon = new L.Icon({
  iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
  iconSize: [32, 32],
});

const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

const fmtDuration = (sec: number) => {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
};

const Map = ({ data }: any) => {
  const [pointsData, setPointsData] = useState<any[]>([]);
  const [timeFilter, setTimeFilter] = useState({ start: '', end: '' });

  const processPoints = (routes: any[]) => {
    const all: any[] = [];
    routes.forEach((r) => {
      r.points.forEach((p: any) => {
        all.push({ lat: p.lat, lng: p.lng, time: new Date(p.timestamp) });
      });
    });
    return all.sort((a, b) => a.time.getTime() - b.time.getTime());
  };

  useEffect(() => {
    if (data?.routes) {
      let pts = processPoints(data.routes);
      if (timeFilter.start && timeFilter.end) {
        pts = pts.filter(
          (p) =>
            p.time >= new Date(timeFilter.start) &&
            p.time <= new Date(timeFilter.end)
        );
      }
      setPointsData(pts);
    }
  }, [data, timeFilter]);

  const { segments, avgTimePer100m } = useMemo(() => {
    const segs: any[] = [];
    let totalDistance = 0;
    let totalTime = 0;

    for (let i = 1; i < pointsData.length; i++) {
      const p1 = pointsData[i - 1];
      const p2 = pointsData[i];
      const distance = haversine(p1.lat, p1.lng, p2.lat, p2.lng);
      const timeDiff = (p2.time.getTime() - p1.time.getTime()) / 1000;

      totalDistance += distance;
      totalTime += timeDiff;

      // Color: time taken between 2 points
      let color = 'green';
      if (timeDiff > 120) color = 'red';
      else if (timeDiff > 30) color = 'orange';

      segs.push({
        positions: [
          [p1.lat, p1.lng],
          [p2.lat, p2.lng],
        ] as [number, number][],
        color,
        timeTaken: Math.round(timeDiff),
        distance: Math.round(distance),
        fromTime: p1.time.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        toTime: p2.time.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    }

    const avg = totalDistance > 0 ? (totalTime / totalDistance) * 100 : 0;
    return { segments: segs, avgTimePer100m: Math.round(avg) };
  }, [pointsData]);

  const start = pointsData[0];
  const end = pointsData[pointsData.length - 1];
  const stays = data?.stays || [];
  const summary = data?.summary;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Summary Cards */}
      {summary && (
        <div
          style={{
            display: 'flex',
            gap: 10,
            marginBottom: 12,
            flexWrap: 'wrap',
          }}
        >
          {[
            {
              label: 'Total Distance',
              value: `${(summary.totalDistance / 1000).toFixed(2)} km`,
              icon: '📍',
            },
            {
              label: 'Moving Time',
              value: fmtDuration(Math.round(summary.totalMovingTime)),
              icon: '🚶',
            },
            {
              label: 'Stay Time',
              value: fmtDuration(summary.totalStayTime),
              icon: '🛑',
            },
            { label: 'Avg per 100m', value: `${avgTimePer100m}s`, icon: '⏱️' },
            { label: 'Stops', value: `${stays.length}`, icon: '📌' },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                flex: 1,
                minWidth: 100,
                background: '#fff',
                border: '1px solid #e8e8e8',
                borderRadius: 10,
                padding: '10px 14px',
                textAlign: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Time Filter */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 10,
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 13, color: '#555' }}>Filter:</span>
        <input
          type="datetime-local"
          style={{
            borderRadius: 6,
            border: '1px solid #d9d9d9',
            padding: '4px 8px',
            fontSize: 13,
          }}
          onChange={(e) =>
            setTimeFilter((p) => ({ ...p, start: e.target.value }))
          }
        />
        <span style={{ color: '#888' }}>→</span>
        <input
          type="datetime-local"
          style={{
            borderRadius: 6,
            border: '1px solid #d9d9d9',
            padding: '4px 8px',
            fontSize: 13,
          }}
          onChange={(e) =>
            setTimeFilter((p) => ({ ...p, end: e.target.value }))
          }
        />
      </div>

      {/* Legend */}
      <div
        style={{
          marginBottom: 10,
          fontSize: 12,
          display: 'flex',
          gap: 16,
          color: '#555',
        }}
      >
        <span>🟢 Fast (&lt;30s)</span>
        <span>🟠 Medium (30–120s)</span>
        <span>🔴 Slow (&gt;120s)</span>
        <span>🔵 Stay Point</span>
      </div>

      <div
        style={{
          height: '65vh',
          borderRadius: 12,
          overflow: 'hidden',
          border: '1px solid #e8e8e8',
        }}
      >
        <MapContainer
          center={
            (start ? [start.lat, start.lng] : [26.83865, 75.78781]) as [
              number,
              number,
            ]
          }
          zoom={13}
          style={{ height: '100%' }}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Route segments */}
          {segments.map((seg, i) => (
            <Polyline
              key={i}
              positions={seg.positions}
              pathOptions={{ color: seg.color, weight: 5, opacity: 0.85 }}
            >
              <Popup>
                <div style={{ fontSize: 13, lineHeight: 1.8 }}>
                  <b>
                    🕒 {seg.fromTime} → {seg.toTime}
                  </b>
                  <br />
                  📏 Distance: <b>{seg.distance}m</b>
                  <br />
                  ⏱️ Time taken: <b>{fmtDuration(seg.timeTaken)}</b>
                </div>
              </Popup>
            </Polyline>
          ))}

          {/* Stay points from backend */}
          {stays.map((s: any, i: number) => (
            <CircleMarker
              key={i}
              center={[s.lat, s.lng] as [number, number]}
              radius={10}
              pathOptions={{
                color: '#1677ff',
                fillColor: '#1677ff',
                fillOpacity: 0.3,
                weight: 2,
              }}
            >
              <Popup>
                <div style={{ fontSize: 13, lineHeight: 1.8 }}>
                  <b>🛑 Stay Point</b>
                  <br />
                  🕒 {fmtTime(s.startTime)} → {fmtTime(s.endTime)}
                  <br />
                  ⏱️ Duration: <b>{fmtDuration(s.duration)}</b>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Start */}
          {start && (
            <Marker
              position={[start.lat, start.lng] as [number, number]}
              icon={startIcon}
            >
              <Popup>
                <b>🟢 Start</b>
                <br />
                {start.time.toLocaleTimeString()}
              </Popup>
            </Marker>
          )}

          {/* End */}
          {end && end !== start && (
            <Marker
              position={[end.lat, end.lng] as [number, number]}
              icon={endIcon}
            >
              <Popup>
                <b>🔴 End</b>
                <br />
                {end.time.toLocaleTimeString()}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
