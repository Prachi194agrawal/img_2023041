import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

function FraudDashboard() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000/alerts');
    
    ws.onmessage = (event) => {
      setAlerts(prev => [...prev, JSON.parse(event.data)]);
    };

    return () => ws.close();
  }, []);

  return (
    <div>
      <h1>Real-time Fraud Detection</h1>
      <div className="map-container">
        <MapContainer center={[20.5937, 78.9629]} zoom={5}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {alerts.map(alert => (
            <Marker position={[alert.lat, alert.lon]} />
          ))}
        </MapContainer>
      </div>
      <div className="alerts-list">
        {alerts.map(alert => (
          <div key={alert.id} className="alert-card">
            <h3>{alert.bank} Alert</h3>
            <p>Amount: ₹{alert.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
