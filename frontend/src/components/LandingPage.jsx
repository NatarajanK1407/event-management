import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Music, Mic2, Rocket, Cpu, Code, HeartPulse, UtensilsCrossed, Palette, Pencil, Trash
} from 'lucide-react';
import axios from 'axios';

const LandingPage = () => {
  const genres = [
    { name: 'Music', icon: <Music size={18} className="mr-2" /> },
    { name: 'Comedy', icon: <Mic2 size={18} className="mr-2" /> },
    { name: 'Product Launch', icon: <Rocket size={18} className="mr-2" /> },
    { name: 'Tech', icon: <Cpu size={18} className="mr-2" /> },
    { name: 'Coding', icon: <Code size={18} className="mr-2" /> },
    { name: 'Health', icon: <HeartPulse size={18} className="mr-2" /> },
    { name: 'Food', icon: <UtensilsCrossed size={18} className="mr-2" /> },
    { name: 'Art', icon: <Palette size={18} className="mr-2" /> },
  ];

  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/events', {
          params: { id: user.id, role: user.role }
        });
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, [user.id, user.role]);

  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setSelectedGenres((prevSelectedGenres) =>
      prevSelectedGenres.includes(genre)
        ? prevSelectedGenres.filter((item) => item !== genre)
        : [...prevSelectedGenres, genre]
    );
  };

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/events/${eventId}`, {
        data: { id: user.id }
      });
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const filteredEvents = events.filter(
    (event) => selectedGenres.length === 0 || selectedGenres.includes(event.genre)
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-800 text-white p-6 transition-all duration-300">
        <h2 className="text-2xl font-semibold mb-6">Genres</h2>
        <ul>
          {genres.map(({ name, icon }) => (
            <li key={name} className="mb-4 flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value={name}
                  checked={selectedGenres.includes(name)}
                  onChange={handleGenreChange}
                  className="mr-2"
                />
                {icon} {name}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="w-4/5 p-6">
        <h1 className="text-3xl font-semibold mb-6">Events</h1>
        <div className="grid grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-lg rounded-lg p-6 mb-6 transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-2xl font-semibold mb-2">{event.title}</h3>
              <p className="text-gray-700 mb-4">{event.description.slice(0, 100)}...</p>
              <p className="text-gray-600 mb-4">Location: {event.location}</p>
              <p className="text-gray-600 mb-4">Date: {new Date(event.date).toLocaleDateString()}</p>
              <Link
                to={`/event/${event.id}`}
                className="text-blue-600 hover:text-blue-800 font-semibold"
              >
                Read More
              </Link>

              {user.role === 'organizer' && user.id === event.organizer_id && (
                <div className="mt-4 flex gap-3">
                  <Link to={`/edit-event/${event.id}`} className="text-green-600 hover:text-green-800">
                    <Pencil size={18} />
                  </Link>
                  <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-800">
                    <Trash size={18} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
