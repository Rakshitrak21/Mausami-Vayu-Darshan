import React, { useState, useEffect } from 'react';
import { Cloud, Wind, Eye, Activity } from 'lucide-react';
import WeatherSection from './components/WeatherSection';
import AirQualitySection from './components/AirQualitySection';
import NetworkStatus from './components/NetworkStatus';
import { useGeolocation } from './hooks/useGeolocation';
import { useNetworkInfo } from './hooks/useNetworkInfo';
import { useBackgroundTasks } from './hooks/useBackgroundTasks';




function App() {
  const [activeSection, setActiveSection] = useState('weather');
  const { location, loading: locationLoading, error: locationError } = useGeolocation();
  const { networkInfo, isOnline } = useNetworkInfo();
  const { scheduleTask } = useBackgroundTasks();

  useEffect(() => {
    // Schedule background data refresh
    scheduleTask(() => {
      console.log('Background data refresh scheduled');
    }, 300000); // Refresh every 5 minutes
  }, [scheduleTask]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Cloud className="h-8 w-8 text-white" />
              <h1 className="text-xl font-bold text-white">Mausami Vayu Darshan</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex bg-white/20 rounded-lg p-1">
                <button
                  onClick={() => setActiveSection('weather')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeSection === 'weather'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {activeSection === 'weather' ? (
                    <Eye className="h-4 w-4 inline mr-2" />
                  ) : (
                    <Cloud className="h-4 w-4 inline mr-2" />
                  )}
                  Weather
                </button>
                <button
                  onClick={() => setActiveSection('airquality')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeSection === 'airquality'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  {activeSection === 'airquality' ? (
                    <Eye className="h-4 w-4 inline mr-2" />
                  ) : (
                    <Wind className="h-4 w-4 inline mr-2" />
                  )}
                  Air Quality
                </button>
              </div>

              <NetworkStatus networkInfo={networkInfo} isOnline={isOnline} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {locationLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 text-center">
              <Activity className="h-8 w-8 text-white mx-auto mb-4 animate-spin" />
              <p className="text-white">Getting your location...</p>
            </div>
          </div>
        )}

        {locationError && (
          <div className="bg-red-500/20 backdrop-blur-md rounded-lg p-6 mb-8 text-center">
            <p className="text-white">
              Unable to get your location. Please enable location services or enter a city manually.
            </p>
          </div>
        )}

        {!locationLoading && (
          <>
            {activeSection === 'weather' && (
              <WeatherSection location={location} networkInfo={networkInfo} />
            )}
            {activeSection === 'airquality' && (
              <AirQualitySection location={location} networkInfo={networkInfo} />
            )}
          </>
        )}
        
      </main>
    </div>
    
  );
}

export default App;
