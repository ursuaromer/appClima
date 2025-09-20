import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Si usas Expo
// import LinearGradient from 'react-native-linear-gradient'; // Si no usas Expo

const { width } = Dimensions.get('window');

// Función para buscar ubicación
const searchLocation = async (name, count = 1, language = 'es') => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=${count}&language=${language}&format=json`
    );
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return [];
    }
    
    return data.results.map(location => ({
      id: location.id,
      nombre: location.name,
      latitud: location.latitude,
      longitud: location.longitude,
      elevacion: location.elevation,
      codigo_pais: location.country_code,
      pais: location.country,
      admin1: location.admin1,
      timezone: location.timezone,
      poblacion: location.population,
    }));
  } catch (error) {
    console.error('Error buscando ubicación:', error);
    return [];
  }
};

// Función para obtener pronóstico diario
const getDailyForecast = async (latitude, longitude, days = 7, timezone = 'auto') => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&forecast_days=${days}&timezone=${timezone}`
    );
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    const dailyData = data.daily.time.map((time, index) => ({
      fecha: new Date(time),
      codigoClima: data.daily.weather_code[index],
      descripcionClima: getWeatherDescription(data.daily.weather_code[index]),
      temperaturaMaxima: data.daily.temperature_2m_max[index],
      temperaturaMinima: data.daily.temperature_2m_min[index],
      sensacionTermicaMax: data.daily.apparent_temperature_max[index],
      sensacionTermicaMin: data.daily.apparent_temperature_min[index],
      amanecer: new Date(data.daily.sunrise[index]),
      atardecer: new Date(data.daily.sunset[index]),
      duracionLuzDia: Math.round(data.daily.daylight_duration[index] / 3600),
      duracionSol: Math.round(data.daily.sunshine_duration[index] / 3600),
      indiceUVMaximo: data.daily.uv_index_max[index],
      precipitacionTotal: data.daily.precipitation_sum[index],
      lluviaTotal: data.daily.rain_sum[index],
      nieveTotal: data.daily.snowfall_sum[index],
      horasPrecipitacion: data.daily.precipitation_hours[index],
      probabilidadPrecipitacionMax: data.daily.precipitation_probability_max[index],
      vientoVelocidadMax: data.daily.wind_speed_10m_max[index],
      vientoRachasMax: data.daily.wind_gusts_10m_max[index],
      vientoDireccionDominante: data.daily.wind_direction_10m_dominant[index],
    }));
    
    return {
      ubicacion: {
        latitud: data.latitude,
        longitud: data.longitude,
        elevacion: data.elevation,
        timezone: data.timezone,
        utc_offset: data.utc_offset_seconds
      },
      pronosticoDiario: dailyData,
      unidades: data.daily_units,
      tiempoGeneracion: data.generationtime_ms
    };
  } catch (error) {
    console.error('Error obteniendo pronóstico diario:', error);
    return null;
  }
};

// Función para convertir códigos de clima a descripciones
const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Cielo despejado',
    1: 'Principalmente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Niebla con escarcha',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna intensa',
    56: 'Llovizna helada ligera',
    57: 'Llovizna helada intensa',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia intensa',
    66: 'Lluvia helada ligera',
    67: 'Lluvia helada intensa',
    71: 'Nieve ligera',
    73: 'Nieve moderada',
    75: 'Nieve intensa',
    77: 'Granizo',
    80: 'Chubascos ligeros',
    81: 'Chubascos moderados',
    82: 'Chubascos intensos',
    85: 'Chubascos de nieve ligeros',
    86: 'Chubascos de nieve intensos',
    95: 'Tormenta',
    96: 'Tormenta con granizo ligero',
    99: 'Tormenta con granizo intenso'
  };
  
  return descriptions[code] || `Código: ${code}`;
};

// Función para obtener el emoji del clima
const getWeatherEmoji = (code) => {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2 || code === 3) return '⛅';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 57) return '🌦️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '🌨️';
  if (code >= 80 && code <= 86) return '⛈️';
  if (code >= 95 && code <= 99) return '⚡';
  return '🌤️';
};

// Función para obtener colores del gradiente según el clima
const getWeatherGradient = (code) => {
  if (code === 0 || code === 1) return ['#FFD700', '#FFA500']; // Soleado
  if (code === 2 || code === 3) return ['#87CEEB', '#4682B4']; // Nublado
  if (code === 45 || code === 48) return ['#708090', '#2F4F4F']; // Niebla
  if (code >= 51 && code <= 67) return ['#4682B4', '#191970']; // Lluvia
  if (code >= 71 && code <= 77) return ['#B0C4DE', '#4169E1']; // Nieve
  if (code >= 80 && code <= 99) return ['#2F4F4F', '#000000']; // Tormentas
  return ['#87CEEB', '#4682B4']; // Default
};

// Componente principal
const PronosticoPorDias  = ({ city, days = 7 }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      
      // Buscar la ubicación
      const locations = await searchLocation(city, 1);
      if (locations.length === 0) {
        Alert.alert('Error', 'Ciudad no encontrada');
        return;
      }

      const location = locations[0];
      setLocationInfo(location);

      // Obtener datos del clima
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

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const renderDayItem = ({ item, index }) => {
    const gradientColors = getWeatherGradient(item.codigoClima);
    const weatherEmoji = getWeatherEmoji(item.codigoClima);

    return (
      <View style={styles.dayContainer}>
        <LinearGradient
          colors={gradientColors}
          style={styles.dayCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Encabezado del día */}
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>{formatDate(item.fecha)}</Text>
            <Text style={styles.weatherEmoji}>{weatherEmoji}</Text>
          </View>

          {/* Temperaturas */}
          <View style={styles.temperatureContainer}>
            <View style={styles.temperatureItem}>
              <Text style={styles.temperatureLabel}>Máx</Text>
              <Text style={styles.temperatureValue}>
                {Math.round(item.temperaturaMaxima)}°C
              </Text>
            </View>
            <View style={styles.temperatureItem}>
              <Text style={styles.temperatureLabel}>Mín</Text>
              <Text style={styles.temperatureValue}>
                {Math.round(item.temperaturaMinima)}°C
              </Text>
            </View>
          </View>

          {/* Descripción del clima */}
          <Text style={styles.weatherDescription}>{item.descripcionClima}</Text>

          {/* Información adicional */}
          <View style={styles.additionalInfo}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>💧 Precipitación</Text>
                <Text style={styles.infoValue}>{item.probabilidadPrecipitacionMax}%</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>💨 Viento</Text>
                <Text style={styles.infoValue}>{Math.round(item.vientoVelocidadMax)} km/h</Text>
              </View>
            </View>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>🌅 Amanecer</Text>
                <Text style={styles.infoValue}>{formatTime(item.amanecer)}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>🌇 Atardecer</Text>
                <Text style={styles.infoValue}>{formatTime(item.atardecer)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>☀️ Índice UV</Text>
                <Text style={styles.infoValue}>{Math.round(item.indiceUVMaximo)}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>🌞 Sol</Text>
                <Text style={styles.infoValue}>{item.duracionSol}h</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4682B4" />
        <Text style={styles.loadingText}>Cargando pronóstico...</Text>
      </View>
    );
  }

  if (!weatherData || !weatherData.pronosticoDiario) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se pudieron cargar los datos del clima</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Text style={styles.cityName}>
          {locationInfo ? `${locationInfo.nombre}, ${locationInfo.pais}` : city}
        </Text>
        <Text style={styles.forecastTitle}>Pronóstico por días</Text>
      </View>

      {/* Lista de días */}
      <FlatList
        data={weatherData.pronosticoDiario}
        renderItem={renderDayItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  header: {
    padding: 20,
    backgroundColor: '#4682B4',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  forecastTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  dayContainer: {
    marginBottom: 15,
  },
  dayCard: {
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'capitalize',
  },
  weatherEmoji: {
    fontSize: 30,
  },
  temperatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  temperatureItem: {
    alignItems: 'center',
  },
  temperatureLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  temperatureValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  weatherDescription: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  additionalInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#4682B4',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default PronosticoPorDias 