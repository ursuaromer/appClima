import { useState, useEffect } from 'react';
import { getHourlyWeatherByCity } from '../utils/weatherHelpersHoras';

export const usePronosticoPorHoras = (city, hours = 24) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await getHourlyWeatherByCity(city, hours);
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!city) {
      setError('No se proporcionó una ciudad');
      setLoading(false);
      return;
    }
    fetchWeather();
  }, [city]);

  const onRefresh = () => {
    fetchWeather(true);
  };

  return {
    weatherData,
    loading,
    error,
    refreshing,
    onRefresh,
  };
};
