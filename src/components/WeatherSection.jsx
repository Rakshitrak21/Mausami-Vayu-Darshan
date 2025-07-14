import React, { useState, useEffect, useRef } from 'react';
import { Thermometer, Droplets, Wind, Sun, Cloud, CloudRain } from 'lucide-react';
import WeatherChart from './WeatherChart';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const WeatherSection = ({ location, networkInfo }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef(null);
  const chartRef = useRef(null);
  
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });
  const chartVisible = useIntersectionObserver(chartRef, { threshold: 0.3 });

  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      // Simulate API call - in real app, you'd call OpenWeatherMap or similar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        current: {
          temp: 22,
          humidity: 65,
          windSpeed: 12,
          condition: 'Partly Cloudy',
          icon: 'partly-cloudy'
        },
        forecast: [
          { day: 'Today', temp: 22, condition: 'Partly Cloudy', icon: 'partly-cloudy' },
          { day: 'Tomorrow', temp: 25, condition: 'Sunny', icon: 'sunny' },
          { day: 'Thursday', temp: 19, condition: 'Rainy', icon: 'rainy' },
          { day: 'Friday', temp: 21, condition: 'Cloudy', icon: 'cloudy' },
          { day: 'Saturday', temp: 24, condition: 'Sunny', icon: 'sunny' },
        ]
      };
      
      setWeatherData(mockData);
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="h-8 w-8 text-yellow-400" />;
      case 'cloudy':
        return <Cloud className="h-8 w-8 text-gray-300" />;
      case 'rainy':
        return <CloudRain className="h-8 w-8 text-blue-400" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 text-center">
          <Wind className="h-8 w-8 text-white mx-auto mb-4 animate-spin" />
          <p className="text-white">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={sectionRef}
      className={`transition-all duration-1000 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Weather */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Current Weather of {location?.city || 'your area'}
          </h2>



          
          {weatherData && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-5xl font-bold text-white">{weatherData.current.temp}°C</p>
                  <p className="text-white/80">{weatherData.current.condition}</p>
                </div>
                {getWeatherIcon(weatherData.current.condition)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Droplets className="h-5 w-5 text-blue-300" />
                    <span className="text-white/80">Humidity</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{weatherData.current.humidity}%</p>
                </div>
                
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wind className="h-5 w-5 text-green-300" />
                    <span className="text-white/80">Wind Speed</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{weatherData.current.windSpeed} km/h</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5-Day Forecast */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">5-Day Forecast</h2>
          
          {weatherData && (
            <div className="space-y-3">
              {weatherData.forecast.map((day, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    {getWeatherIcon(day.condition)}
                    <div>
                      <p className="text-white font-medium">{day.day}</p>
                      <p className="text-white/70 text-sm">{day.condition}</p>
                    </div>
                  </div>
                  <p className="text-white text-xl font-bold">{day.temp}°C</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weather Chart */}
      <div 
        ref={chartRef}
        className={`mt-8 transition-all duration-1000 transform ${
          chartVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Temperature Trend</h2>
          <WeatherChart data={weatherData?.forecast || []} />
        </div>
      </div>
    </div>
  );
};

export default WeatherSection;