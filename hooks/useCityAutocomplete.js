import { useState, useRef, useEffect } from 'react';
import { Keyboard } from 'react-native';

const API_KEY = '7be61e0c0f2aad060ff4fadd517bd683';

export default function useCityAutocomplete(showModal, inputValue) {
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      if (inputValue && showModal) {
        searchCities(inputValue);
      }
    }, 500);
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [inputValue, showModal]);

  const searchCities = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      setLoadingSuggestions(true);
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );
      if (response.ok) {
        const cities = await response.json();
        const formattedCities = cities.map(city => ({
          name: city.name,
          state: city.state || '',
          country: city.country,
          lat: city.lat,
          lon: city.lon,
          displayName: `${city.name}${city.state ? `, ${city.state}` : ''}, ${city.country}`
        }));
        setSuggestions(formattedCities);
      }
    } catch (error) {
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const closeModal = () => {
    setSuggestions([]);
    Keyboard.dismiss();
  };

  return { suggestions, loadingSuggestions, closeModal };
}
