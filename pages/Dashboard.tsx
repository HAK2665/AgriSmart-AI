import React, { useState, useEffect } from 'react';
import { UserProfile, WeatherData } from '../types';
import { Link } from 'react-router-dom';
import { geocodeLocation, fetchWeatherData, getWeatherIcon } from '../weatherService';

const Dashboard: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        let latitude: number;
        let longitude: number;

        // Try to use stored user location first
        if (user.location && user.location.trim()) {
          console.log('Using stored location:', user.location);
          try {
            const coords = await geocodeLocation(user.location);
            latitude = coords.latitude;
            longitude = coords.longitude;
          } catch (err) {
            console.warn('Failed to geocode stored location, falling back to browser geolocation:', err);
            // Fallback to browser geolocation
            const position = await new Promise<GeolocationCoordinates>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(
                (pos) => resolve(pos.coords),
                (err) => reject(err)
              );
            });
            latitude = position.latitude;
            longitude = position.longitude;
          }
        } else {
          // Use browser geolocation if no stored location
          console.log('No stored location, using browser geolocation');
          const position = await new Promise<GeolocationCoordinates>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve(pos.coords),
              (err) => reject(err)
            );
          });
          latitude = position.latitude;
          longitude = position.longitude;
        }

        console.log('Fetching weather for:', latitude, longitude);
        const weatherData = await fetchWeatherData(latitude, longitude);
        setWeather(weatherData);
        setError(null);
      } catch (err) {
        console.error('Error fetching weather:', err);
        const errorMsg = err instanceof Error ? err.message : 'Unable to fetch weather data. Please check your location settings.';
        setError(errorMsg);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user.location]);

  const stats = [
    { label: 'Analyses Run', value: '12', icon: 'fa-microscope', color: 'bg-blue-500' },
    { label: 'Saved Crops', value: user.cropInterests.length.toString(), icon: 'fa-leaf', color: 'bg-green-500' },
    { label: 'Alerts', value: '2', icon: 'fa-exclamation-triangle', color: 'bg-amber-500' },
    { label: 'Days Active', value: '45', icon: 'fa-calendar-check', color: 'bg-indigo-500' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Welcome back, {user.displayName}!</h2>
        <p className="text-slate-500">Here's what's happening on your farm today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-inner`}>
              <i className={`fas ${stat.icon} text-xl`}></i>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Quick Tools</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/detect" className="group p-4 bg-green-50 hover:bg-green-100 rounded-xl border border-green-200 transition-all text-center md:text-left">
                <div className="w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform mx-auto md:mx-0">
                  <i className="fas fa-camera"></i>
                </div>
                <h4 className="font-bold text-green-900">Disease Detection</h4>
                <p className="text-sm text-green-700">Scan plants for immediate diagnosis and remedies.</p>
              </Link>
              
              <Link to="/calendar" className="group p-4 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition-all text-center md:text-left">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform mx-auto md:mx-0">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <h4 className="font-bold text-indigo-900">Crop Calendar</h4>
                <p className="text-sm text-indigo-700">View seasonal timelines for your selected crops.</p>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { type: 'Disease', label: 'Potato Late Blight', time: '2 hours ago', status: 'Warning' },
                { type: 'Soil', label: 'Loamy Soil Analysis', time: 'Yesterday', status: 'Completed' },
                { type: 'Disease', label: 'Healthy Tomato', time: '3 days ago', status: 'Safe' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${activity.status === 'Warning' ? 'bg-red-500' : activity.status === 'Safe' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <div>
                      <p className="font-semibold text-slate-800">{activity.label}</p>
                      <p className="text-xs text-slate-400">{activity.type} • {activity.time}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    activity.status === 'Warning' ? 'bg-red-50 text-red-600' : activity.status === 'Safe' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Community / Advice */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Smart Tip of the Day</h3>
              <p className="text-green-50 text-sm leading-relaxed mb-4">
                "Crop rotation with legumes can naturally boost nitrogen levels in your soil without heavy reliance on synthetic fertilizers."
              </p>
              <button className="bg-white text-green-700 px-4 py-2 rounded-full text-xs font-bold hover:bg-green-50 transition-colors">
                Learn More
              </button>
            </div>
            <i className="fas fa-lightbulb absolute -bottom-4 -right-4 text-8xl text-green-500/20 rotate-12"></i>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Local Weather</h3>
            <div className="flex flex-col items-center text-center p-4">
              {loading ? (
                <div className="py-8">
                  <i className="fas fa-spinner animate-spin text-2xl text-blue-500"></i>
                  <p className="text-sm text-slate-500 mt-2">Loading weather...</p>
                </div>
              ) : error ? (
                <div className="py-6 px-2">
                  <i className="fas fa-cloud-exclamation text-3xl text-amber-500 mb-2 block"></i>
                  <p className="text-xs text-slate-500">{error}</p>
                </div>
              ) : weather ? (
                <>
                  <i className={`fas ${getWeatherIcon(weather.weatherCode)} text-5xl text-amber-400 mb-2`}></i>
                  <p className="text-3xl font-bold text-slate-800">{weather.temperature}°C</p>
                  <p className="text-slate-500">{weather.description}</p>
                  <p className="text-slate-500 text-sm">{user.location || 'Rural Region'}</p>
                  <div className="grid grid-cols-2 gap-4 w-full mt-6 text-sm">
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <p className="text-slate-400">Humidity</p>
                      <p className="font-bold">{weather.humidity}%</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <p className="text-slate-400">Wind</p>
                      <p className="font-bold">{weather.windSpeed} km/h</p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-6 px-2">
                  <i className="fas fa-cloud text-3xl text-slate-300 mb-2 block"></i>
                  <p className="text-xs text-slate-500">Weather data unavailable</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
