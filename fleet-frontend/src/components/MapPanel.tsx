import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPanelProps {
  center: LatLngExpression;
  markers: Array<{ id: string; position: LatLngExpression; label: string; detail?: string }>;
  route?: LatLngExpression[];
}

export default function MapPanel({ center, markers, route }: MapPanelProps) {
  return (
    <div className="map-panel">
      <MapContainer center={center} zoom={12} scrollWheelZoom style={{ height: '360px' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position}>
            <Popup>
              <strong>{marker.label}</strong>
              {marker.detail && <div>{marker.detail}</div>}
            </Popup>
          </Marker>
        ))}
        {route && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
}
