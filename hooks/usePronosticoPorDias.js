import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { searchLocation, getDailyForecast } from '../utils/weatherHelpers';

export const usePronosticoPorDias = (city, days = 7) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      const locations = await searchLocation(city, 1);
      if (locations.length === 0) {
        Alert.alert('Error', 'Ciudad no encontrada');
        return;
      }
      const location = locations[0];
      setLocationInfo(location);
      const forecast = await getDailyForecast(
        location.latitud,
        location.longitud,
        days,
        location.timezone
      );
      if (forecast) {
        setWeatherData(forecast);
      } else {
        Alert.alert('Error', 'No se pudieron obtener los datos del clima');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Error al obtener los datos del clima');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeatherData();
    }
  }, [city]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeatherData();
  };

  return {
    weatherData,
    loading,
    refreshing,
    locationInfo,
    onRefresh,
  };
}
