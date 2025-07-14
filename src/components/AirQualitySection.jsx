import React, { useState, useEffect, useRef } from 'react';
import { Wind, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import AirQualityChart from './AirQualityChart';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const AirQualitySection = ({ location, networkInfo }) => {
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef(null);
  const chartRef = useRef(null);
  
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });
  const chartVisible = useIntersectionObserver(chartRef, { threshold: 0.3 });

  useEffect(() => {
    if (location) {
      fetchAirQualityData();
    }
  }, [location]);

  const fetchAirQualityData = async () => {
    setLoading(true);
    try {
      // Simulate API call - in real app, you'd call AirVisual or similar
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        current: {
          aqi: 65,
          level: 'Moderate',
          pm25: 25,
          pm10: 45,
          o3: 80,
          no2: 35,
          so2: 15,
          co: 0.8
        },
        forecast: [
          { day: 'Today', aqi: 65, level: 'Moderate' },
          { day: 'Tomorrow', aqi: 45, level: 'Good' },
          { day: 'Thursday', aqi: 85, level: 'Unhealthy for Sensitive Groups' },
          { day: 'Friday', aqi: 55, level: 'Moderate' },
          { day: 'Saturday', aqi: 35, level: 'Good' },
        ]
      };
      
      setAirQualityData(mockData);
    } catch (error) {
      console.error('Failed to fetch air quality data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 200) return 'text-red-400';
    if (aqi <= 300) return 'text-purple-400';
    return 'text-red-600';
  };

  const getAQIIcon = (level) => {
    switch (level.toLowerCase()) {
      case 'good':
        return <CheckCircle className="h-6 w-6 text-green-400" />;
      case 'moderate':
        return <AlertTriangle className="h-6 w-6 text-yellow-400" />;
      default:
        return <XCircle className="h-6 w-6 text-red-400" />;
    }
  };

  const getHealthRecommendation = (aqi) => {
    if (aqi <= 50) return 'Air quality is excellent. Perfect for outdoor activities!';
    if (aqi <= 100) return 'Air quality is acceptable. Outdoor activities are generally fine.';
    if (aqi <= 150) return 'Sensitive individuals should consider reducing outdoor activities.';
    if (aqi <= 200) return 'Everyone should limit outdoor activities.';
    return 'Air quality is hazardous. Avoid outdoor activities.';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 text-center">
          <Wind className="h-8 w-8 text-white mx-auto mb-4 animate-spin" />
          <p className="text-white">Loading air quality data...</p>
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
        {/* Current Air Quality */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Current Air Quality</h2>
          
          {airQualityData && (
            <div className="space-y-6">
              <div className="text-center">
                <p className={`text-6xl font-bold ${getAQIColor(airQualityData.current.aqi)}`}>
                  {airQualityData.current.aqi}
                </p>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  {getAQIIcon(airQualityData.current.level)}
                  <p className="text-white text-lg">{airQualityData.current.level}</p>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-white/80 text-sm mb-2">Health Recommendation</p>
                <p className="text-white">
                  {getHealthRecommendation(airQualityData.current.aqi)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pollutant Details */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Pollutant Levels</h2>
          
          {airQualityData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-white/80 text-sm">PM2.5</p>
                  <p className="text-white text-2xl font-bold">{airQualityData.current.pm25} μg/m³</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-white/80 text-sm">PM10</p>
                  <p className="text-white text-2xl font-bold">{airQualityData.current.pm10} μg/m³</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-white/80 text-sm">O₃</p>
                  <p className="text-white text-2xl font-bold">{airQualityData.current.o3} μg/m³</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-white/80 text-sm">NO₂</p>
                  <p className="text-white text-2xl font-bold">{airQualityData.current.no2} μg/m³</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Air Quality Forecast */}
      <div className="mt-8 bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">5-Day Air Quality Forecast</h2>
        
        {airQualityData && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {airQualityData.forecast.map((day, index) => (
              <div 
                key={index}
                className="bg-white/10 rounded-lg p-4 text-center hover:bg-white/20 transition-colors duration-200"
              >
                <p className="text-white font-medium mb-2">{day.day}</p>
                <p className={`text-3xl font-bold ${getAQIColor(day.aqi)} mb-2`}>
                  {day.aqi}
                </p>
                <div className="flex items-center justify-center space-x-1">
                  {getAQIIcon(day.level)}
                  <p className="text-white/80 text-sm">{day.level}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Air Quality Chart */}
      <div 
        ref={chartRef}
        className={`mt-8 transition-all duration-1000 transform ${
          chartVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">AQI Trend</h2>
          <AirQualityChart data={airQualityData?.forecast || []} />
        </div>
      </div>
    </div>
  );
};

export default AirQualitySection;