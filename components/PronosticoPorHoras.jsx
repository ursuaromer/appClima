import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Función para obtener el emoji del clima
const getWeatherEmoji = (code) => {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2 || code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 86) return '❄️';
  if (code >= 95 && code <= 99) return '⛈️';
  return '☁️';
};

// API functions (adaptadas para React Native)
async function searchLocation(name, count = 1, language = 'es') {
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
      feature_code: location.feature_code,
      codigo_pais: location.country_code,
      pais: location.country,
      admin1: location.admin1,
      timezone: location.timezone,
      poblacion: location.population
    }));
  } catch (error) {
    console.error('Error buscando ubicación:', error);
    return [];
  }
}

function getWeatherDescription(code) {
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
  
  return descriptions[code] || `Código de clima: ${code}`;
}

async function getHourlyWeatherByCity(cityName, hours = 24) {
  try {
    // Buscar la ciudad
    const locations = await searchLocation(cityName, 1);
    if (locations.length === 0) {
      throw new Error('Ciudad no encontrada');
    }
    
    const location = locations[0];
    
    // Obtener datos del clima por horas
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitud}&longitude=${location.longitud}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,weather_code,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&forecast_days=3&timezone=${location.timezone}`
    );
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Procesar pronóstico por horas (limitado a las horas solicitadas)
    const pronosticoHorario = data.hourly.time.slice(0, hours).map((time, index) => ({
      tiempo: new Date(time),
      temperatura: data.hourly.temperature_2m[index],
      humedad: data.hourly.relative_humidity_2m[index],
      sensacionTermica: data.hourly.apparent_temperature[index],
      probabilidadPrecipitacion: data.hourly.precipitation_probability[index],
      precipitacion: data.hourly.precipitation[index],
      lluvia: data.hourly.rain[index],
      codigoClima: data.hourly.weather_code[index],
      descripcionClima: getWeatherDescription(data.hourly.weather_code[index]),
      nubosidad: data.hourly.cloud_cover[index],
      visibilidad: data.hourly.visibility[index],
      vientoVelocidad: data.hourly.wind_speed_10m[index],
      vientoDireccion: data.hourly.wind_direction_10m[index],
      vientoRachas: data.hourly.wind_gusts_10m[index],
      indiceUV: data.hourly.uv_index[index]
    }));
    
    return {
      ubicacion: {
        nombre: location.nombre,
        pais: location.pais,
        admin1: location.admin1,
        latitud: location.latitud,
        longitud: location.longitud,
        timezone: data.timezone
      },
      pronosticoHorario,
      unidades: data.hourly_units
    };
  } catch (error) {
    console.error('Error obteniendo clima por horas:', error);
    throw error;
  }
}

// Componente principal para React Native
const PronosticoPorHoras = ({ city }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const data = await getHourlyWeatherByCity(city, 24);
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

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
  };

  const renderHourlyItem = ({ item, index }) => {
    const isNow = index === 0;
    const date = item.tiempo;
    
    return (
      <View style={[styles.hourlyCard, isNow && styles.currentHourCard]}>
        {/* Time and Date */}
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, isNow && styles.currentTimeText]}>
            {isNow ? 'Ahora' : formatTime(date)}
          </Text>
          <Text style={styles.dateText}>
            {formatDate(date)}
          </Text>
        </View>

        {/* Weather Icon and Description */}
        <View style={styles.weatherIconContainer}>
          <Text style={styles.weatherEmoji}>
            {getWeatherEmoji(item.codigoClima)}
          </Text>
          <Text style={styles.weatherDescription}>
            {item.descripcionClima}
          </Text>
        </View>

        {/* Temperature */}
        <View style={styles.temperatureContainer}>
          <Text style={styles.temperature}>
            {Math.round(item.temperatura)}°C
          </Text>
          <Text style={styles.feelsLike}>
            🌡️ Sensación: {Math.round(item.sensacionTermica)}°C
          </Text>
        </View>

        {/* Additional Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>💧 {item.humedad}%</Text>
            <Text style={styles.detailText}>☔ {item.probabilidadPrecipitacion || 0}%</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>
              💨 {Math.round(item.vientoVelocidad)} km/h
            </Text>
            <Text style={styles.detailText}>
              {getWindDirection(item.vientoDireccion)}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailText}>☀️ UV: {item.indiceUV || 0}</Text>
            <Text style={styles.detailText}>
              👁️ {(item.visibilidad / 1000).toFixed(1)}km
            </Text>
          </View>

          <View style={styles.centeredDetail}>
            <Text style={styles.detailText}>☁️ Nubes: {item.nubosidad}%</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <LinearGradient
        colors={['#EBF4FF', '#C3DAFE', '#A5B4FC']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Cargando pronóstico...</Text>
          <Text style={styles.cityText}>Ciudad: {city}</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient
        colors={['#FEF2F2', '#FECACA', '#FCA5A5']}
        style={styles.container}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={styles.errorTitle}>Error al cargar el clima</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Text style={styles.errorCity}>Ciudad buscada: "{city}"</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!weatherData) {
    return null;
  }

  return (
    <LinearGradient
      colors={['#EBF4FF', '#C3DAFE', '#A5B4FC']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pronóstico por Horas</Text>
        <Text style={styles.location}>
          📍 {weatherData.ubicacion.nombre}
          {weatherData.ubicacion.admin1 && `, ${weatherData.ubicacion.admin1}`}
          {weatherData.ubicacion.pais && `, ${weatherData.ubicacion.pais}`}
        </Text>
        <Text style={styles.subtitle}>Próximas 24 horas</Text>
      </View>

      {/* Hourly forecast */}
      <FlatList
        data={weatherData.pronosticoHorario}
        renderItem={renderHourlyItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4F46E5']}
            tintColor="#4F46E5"
          />
        }
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Datos proporcionados por Open-Meteo API • Actualizado en tiempo real
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center',
  },
  cityText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#DC2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorCity: {
    fontSize: 14,
    color: '#F87171',
    textAlign: 'center',
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  hourlyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 16,
    margin: 4,
    flex: 1,
    maxWidth: (width - 40) / 2,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.5)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currentHourCard: {
    backgroundColor: 'rgba(219, 234, 254, 0.8)',
    borderColor: '#60A5FA',
    borderWidth: 2,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  currentTimeText: {
    color: '#1D4ED8',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  weatherIconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  weatherEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  weatherDescription: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 16,
  },
  temperatureContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  feelsLike: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  detailsContainer: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  centeredDetail: {
    alignItems: 'center',
    marginTop: 4,
  },
  detailText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.5)',
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default PronosticoPorHoras;