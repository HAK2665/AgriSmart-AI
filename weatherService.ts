import { WeatherData } from './types';

const WEATHER_API_KEY = 'c7ebe2a6e5ec3a558b01eff8d42bb827';
const OPENWEATHERMAP_API = 'https://api.openweathermap.org/data/2.5';
const GEOCODING_API = 'https://api.openweathermap.org/geo/1.0/direct';

interface GeocodingResult {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

interface OpenWeatherCurrent {
  coord: { lon: number; lat: number };
  weather: Array<{ id: number; main: string; description: string; icon: string }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: { speed: number; deg: number };
  clouds: { all: number };
  rain?: { '1h': number };
  snow?: { '1h': number };
  dt: number;
  sys: { country: string; sunrise: number; sunset: number };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface OpenWeatherForecast {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{ id: number; main: string; description: string }>;
    wind: { speed: number };
    rain?: { '3h': number };
    snow?: { '3h': number };
  }>;
}

// Convert OpenWeatherMap weather ID to our weather code
const convertWeatherCode = (weatherId: number): number => {
  if (weatherId >= 200 && weatherId < 300) return 95; // Thunderstorm
  if (weatherId >= 300 && weatherId < 400) return 51; // Drizzle
  if (weatherId >= 500 && weatherId < 600) {
    if (weatherId === 500) return 61; // Light rain
    if (weatherId === 501 || weatherId === 502) return 63; // Moderate rain
    if (weatherId === 503 || weatherId === 504) return 65; // Heavy rain
    return 61;
  }
  if (weatherId >= 600 && weatherId < 700) return 71; // Snow
  if (weatherId >= 700 && weatherId < 800) return 45; // Mist/Fog
  if (weatherId === 800) return 0; // Clear sky
  if (weatherId === 801) return 1; // Mainly clear
  if (weatherId === 802) return 2; // Partly cloudy
  if (weatherId === 803 || weatherId === 804) return 3; // Overcast
  return 0;
};

// Get weather description
const getWeatherDescription = (weatherId: number, description: string): string => {
  return description.charAt(0).toUpperCase() + description.slice(1);
};

// Geocode location string to get coordinates
export const geocodeLocation = async (locationName: string): Promise<{ latitude: number; longitude: number }> => {
  try {
    if (!locationName || locationName.trim() === '') {
      throw new Error('Location name is empty');
    }

    const response = await fetch(
      `${GEOCODING_API}?q=${encodeURIComponent(locationName)}&limit=1&appid=${WEATHER_API_KEY}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data: GeocodingResult[] = await response.json();

    if (data && data.length > 0) {
      const result = data[0];
      console.log('Geocoding result:', result);
      return {
        latitude: result.lat,
        longitude: result.lon,
      };
    }
    throw new Error(`Location "${locationName}" not found`);
  } catch (error) {
    console.error('Error geocoding location:', error);
    throw error;
  }
};

// Get user's location using geolocation API
export const getUserLocation = (): Promise<{ latitude: number; longitude: number; locationName?: string }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

// Fetch weather data from OpenWeatherMap API
export const fetchWeatherData = async (
  latitude: number,
  longitude: number
): Promise<WeatherData> => {
  try {
    // Fetch current weather
    const currentResponse = await fetch(
      `${OPENWEATHERMAP_API}/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
    );

    if (!currentResponse.ok) {
      throw new Error(`Weather API error: ${currentResponse.status}`);
    }

    const currentData: OpenWeatherCurrent = await currentResponse.json();

    // Fetch forecast data
    const forecastResponse = await fetch(
      `${OPENWEATHERMAP_API}/forecast?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`
    );

    let forecastData: OpenWeatherForecast | null = null;
    if (forecastResponse.ok) {
      forecastData = await forecastResponse.json();
    }

    const weatherId = currentData.weather[0].id;
    const weatherCode = convertWeatherCode(weatherId);
    const precipitation = (currentData.rain?.['1h'] || currentData.snow?.['1h'] || 0) as number;

    // Process hourly forecast (next 6 hours)
    const hourlyForecast = forecastData
      ? forecastData.list
          .slice(0, 6)
          .map((item) => ({
            time: new Date(item.dt * 1000).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            temperature: Math.round(item.main.temp),
          }))
      : [];

    // Process daily forecast (5 days)
    const dailyForecast: Array<{
      date: string;
      maxTemp: number;
      minTemp: number;
      description: string;
      precipitation: number;
    }> = [];

    if (forecastData) {
      const dailyData: {
        [key: string]: {
          temps: number[];
          precip: number;
          description: string;
        };
      } = {};

      forecastData.list.slice(0, 40).forEach((item) => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0];
        if (!dailyData[date]) {
          dailyData[date] = { temps: [], precip: 0, description: '' };
        }
        dailyData[date].temps.push(item.main.temp);
        dailyData[date].precip += (item.rain?.['3h'] || item.snow?.['3h'] || 0) / 3;
        dailyData[date].description = item.weather[0].description;
      });

      Object.keys(dailyData)
        .slice(0, 5)
        .forEach((date) => {
          const data = dailyData[date];
          dailyForecast.push({
            date,
            maxTemp: Math.round(Math.max(...data.temps)),
            minTemp: Math.round(Math.min(...data.temps)),
            description: getWeatherDescription(weatherId, data.description),
            precipitation: Math.round(data.precip * 10) / 10,
          });
        });
    }

    return {
      temperature: Math.round(currentData.main.temp),
      humidity: currentData.main.humidity,
      description: getWeatherDescription(weatherId, currentData.weather[0].description),
      windSpeed: Math.round(currentData.wind.speed),
      precipitation,
      weatherCode,
      updatedAt: new Date().getTime(),
      forecast: {
        hourly: hourlyForecast,
        daily: dailyForecast,
      },
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Get weather icon based on weather code
export const getWeatherIcon = (weatherCode: number): string => {
  if (weatherCode === 0) return 'fa-sun'; // Clear
  if (weatherCode === 1 || weatherCode === 2) return 'fa-cloud-sun'; // Mainly clear, Partly cloudy
  if (weatherCode === 3) return 'fa-cloud'; // Overcast
  if (weatherCode >= 45 && weatherCode <= 48) return 'fa-smog'; // Fog
  if (weatherCode >= 51 && weatherCode <= 55) return 'fa-cloud-rain'; // Drizzle
  if (weatherCode >= 61 && weatherCode <= 65) return 'fa-cloud-showers-heavy'; // Rain
  if (weatherCode >= 71 && weatherCode <= 77) return 'fa-snowflake'; // Snow
  if (weatherCode >= 80 && weatherCode <= 82) return 'fa-cloud-showers-heavy'; // Showers
  if (weatherCode >= 85 && weatherCode <= 86) return 'fa-snowflake'; // Snow showers
  if (weatherCode >= 95 && weatherCode <= 99) return 'fa-bolt'; // Thunderstorm
  return 'fa-cloud'; // Default
};

// Convert weather code to agricultural warning
export const getAgricultureWarning = (weatherCode: number): string | null => {
  if (weatherCode >= 61 && weatherCode <= 65) {
    return 'Heavy rain detected. Ensure proper drainage in fields.';
  }
  if (weatherCode >= 71 && weatherCode <= 77) {
    return 'Snow expected. Protect sensitive crops and livestock.';
  }
  if (weatherCode >= 95 && weatherCode <= 99) {
    return 'Thunderstorm alert! Take precautions against lightning strikes.';
  }
  if (weatherCode >= 45 && weatherCode <= 48) {
    return 'Foggy conditions may affect pollination and increase frost risk.';
  }
  return null;
};
