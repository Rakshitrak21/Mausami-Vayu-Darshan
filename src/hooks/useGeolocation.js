import { useState, useEffect } from 'react';

export const useGeolocation = () => {
  const [state, setState] = useState({
    location: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        loading: false,
        error: 'Geolocation is not supported by this browser.',
      });
      return;
    }

    const successCallback = async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        // Reverse geocoding using OpenStreetMap
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await response.json();

        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.state ||
          'your area';

        setState({
          location: {
            lat,
            lon,
            city, // now added
          },
          loading: false,
          error: null,
        });
      } catch (err) {
        setState({
          location: {
            lat,
            lon,
            city: 'your area',
          },
          loading: false,
          error: 'Failed to fetch location name',
        });
      }
    };

    const errorCallback = (error) => {
      setState({
        location: null,
        loading: false,
        error: error.message,
      });
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  }, []);

  return state;
};
