import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function ClickHandler({ setNewLocation }) {
  useMapEvents({
    click(e) {
      setNewLocation((prev) => ({
        ...prev,
        lat: e.latlng.lat.toFixed(5),
        lng: e.latlng.lng.toFixed(5),
      }));
    },
  });
  return null;
}

export default function ParkFreeMap() {
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [newLocation, setNewLocation] = useState({
    name: '',
    lat: '',
    lng: '',
    hours: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocations() {
      setLoading(true);
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .order('name', { ascending: true });
      if (error) {
        console.error('Error fetching locations:', error);
        setLoading(false);
        return;
      }
      setLocations(data || []);
      setFiltered(data || []);
      setLoading(false);
    }
    fetchLocations();
  }, []);

  useEffect(() => {
    setFiltered(
      locations.filter((loc) =>
        loc.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, locations]);

  const handleAddLocation = async () => {
    const { name, lat, lng, hours } = newLocation;
    if (!name || !lat || !lng || !hours) return alert('Please fill all fields');

    const { data, error } = await supabase.from('locations').insert([
      {
        name,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        hours,
      },
    ]);

    if (error) {
      alert('Error adding location: ' + error.message);
      return;
    }

    const updatedLocations = [...locations, data[0]];
    setLocations(updatedLocations);
    setFiltered(updatedLocations);
    setNewLocation({ name: '', lat: '', lng: '', hours: '' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-screen">
      <div className="p-4 overflow-y-auto bg-white shadow-md">
        <h1 className="text-xl font-bold mb-4">ParkFree - UK Free Parking Map</h1>
        <input
          type="text"
          placeholder="Search by city or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Add Free Parking Spot</h2>
          <input
            placeholder="Name"
            value={newLocation.name}
            onChange={(e) =>
              setNewLocation({ ...newLocation, name: e.target.value })
            }
            className="mb-2 p-2 border rounded w-full"
          />
          <input
            placeholder="Latitude"
            value={newLocation.lat}
            onChange={(e) =>
              setNewLocation({ ...newLocation, lat: e.target.value })
            }
            className="mb-2 p-2 border rounded w-full"
          />
          <input
            placeholder="Longitude"
            value={newLocation.lng}
            onChange={(e) =>
              setNewLocation({ ...newLocation, lng: e.target.value })
            }
            className="mb-2 p-2 border rounded w-full"
          />
          <input
            placeholder="Free Hours (e.g., Free after 6pm)"
            value={newLocation.hours}
            onChange={(e) =>
              setNewLocation({ ...newLocation, hours: e.target.value })
            }
            className="mb-2 p-2 border rounded w-full"
          />
          <button
            onClick={handleAddLocation}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <p className="text-sm text-gray-500 mt-1">
            Tip: Click on the map to autofill coordinates
          </p>
        </div>

        {loading ? (
          <p>Loading parking spots...</p>
        ) : filtered.length === 0 ? (
          <p>No parking spots found.</p>
        ) : (
          filtered.map((loc) => (
            <div
              key={loc.id}
              className="mb-2 border p-2 rounded shadow-sm"
            >
              <h2 className="font-semibold">{loc.name}</h2>
              <p className="text-sm text-gray-600">{loc.hours}</p>
            </div>
          ))
        )}
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
