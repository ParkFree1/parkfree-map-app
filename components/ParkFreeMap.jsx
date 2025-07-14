'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'parkfree-locations';

function ClickHandler({ setNewLocation }) {
  useMapEvents({
    click(e) {
      setNewLocation((prev) => ({ ...prev, lat: e.latlng.lat.toFixed(5), lng: e.latlng.lng.toFixed(5) }));
    },
  });
  return null;
}

export default function ParkFreeMap() {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [newLocation, setNewLocation] = useState({ name: '', lat: '', lng: '', hours: '' });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setLocations(parsed);
      setFiltered(parsed);
    } else {
      const dummyData = [
        {
          id: 1,
          name: 'Free Parking - Manchester City Centre',
          lat: 53.4808,
          lng: -2.2426,
          hours: 'Free after 6pm, Mon–Sat',
        },
        {
          id: 2,
          name: 'Free Parking - Bristol Sundays Only',
          lat: 51.4545,
          lng: -2.5879,
          hours: 'Free all day Sunday',
        },
      ];
      setLocations(dummyData);
      setFiltered(dummyData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyData));
    }
  }, []);

  useEffect(() => {
    setFiltered(
      locations.filter((loc) =>
        loc.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, locations]);

  const handleAddLocation = () => {
    const { name, lat, lng, hours } = newLocation;
    if (!name || !lat || !lng || !hours) return;
    const newId = Date.now();
    const updatedLocations = [
      ...locations,
      { id: newId, name, lat: parseFloat(lat), lng: parseFloat(lng), hours },
    ];
    setLocations(updatedLocations);
    setFiltered(updatedLocations);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLocations));
    setNewLocation({ name: '', lat: '', lng: '', hours: '' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-screen">
      <div className="p-4 overflow-y-auto bg-white shadow-md">
        <h1 className="text-xl font-bold mb-4">ParkFree - UK Free Parking Map</h1>
        <Input
          placeholder="Search by city or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Add Free Parking Spot</h2>
          <Input
            placeholder="Name"
            value={newLocation.name}
            onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
            className="mb-2"
          />
          <Input
            placeholder="Latitude"
            value={newLocation.lat}
            onChange={(e) => setNewLocation({ ...newLocation, lat: e.target.value })}
            className="mb-2"
          />
          <Input
            placeholder="Longitude"
            value={newLocation.lng}
            onChange={(e) => setNewLocation({ ...newLocation, lng: e.target.value })}
            className="mb-2"
          />
          <Input
            placeholder="Free Hours (e.g., Free after 6pm)"
            value={newLocation.hours}
            onChange={(e) => setNewLocation({ ...newLocation, hours: e.target.value })}
            className="mb-2"
          />
          <Button onClick={handleAddLocation}>Submit</Button>
          <p className="text-sm text-gray-500 mt-1">Tip: Click on the map to autofill coordinates</p>
        </div>

        {filtered.map((loc) => (
          <Card key={loc.id} className="mb-2">
            <CardContent>
              <h2 className="font-semibold">{loc.name}</h2>
              <p className="text-sm text-gray-600">{loc.hours}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="col-span-2 h-full">
        <MapContainer
          center={[53.4808, -2.2426]}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <ClickHandler setNewLocation={setNewLocation} />
          {filtered.map((loc) => (
            <Marker key={loc.id} position={[loc.lat, loc.lng]}>
              <Popup>
                <strong>{loc.name}</strong>
                <br />
                {loc.hours}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
