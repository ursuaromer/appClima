
  import React from 'react';
  import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
  import { LinearGradient } from 'expo-linear-gradient';
  import { usePronosticoPorHoras } from '../hooks/usePronosticoPorHoras';
  import { getWeatherEmoji } from '../utils/weatherHelpersHoras';
  import { styles } from '../styles/pronosticoPorHoras';
  import { useLocalSearchParams } from "expo-router";
  import HomeButton from '../components/Botttoms/HomeButton';


  const formatTime = (date) => date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
  const formatDate = (date) => date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
  };

  const renderHourlyItem = ({ item, index }) => {
    const isNow = index === 0;
    const date = item.tiempo;
    return (
      <View style={[styles.hourlyCard, isNow && styles.currentHourCard]}>
        <View style={styles.timeContainer}>
          <Text style={[styles.timeText, isNow && styles.currentTimeText]}>
            {isNow ? 'Ahora' : formatTime(date)}
          </Text>
          <Text style={styles.dateText}>{formatDate(date)}</Text>
        </View>
        <View style={styles.weatherIconContainer}>
          <Text style={styles.weatherEmoji}>{getWeatherEmoji(item.codigoClima)}</Text>
          <Text style={styles.weatherDescription}>{item.descripcionClima}</Text>
        </View>
        <View style={styles.temperatureContainer}>
          <Text style={styles.temperature}>{Math.round(item.temperatura)}°C</Text>
          <Text style={styles.feelsLike}>🌡️ Sensación: {Math.round(item.sensacionTermica)}°C</Text>
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>💧 {item.humedad}%</Text>
            <Text style={styles.detailText}>☔ {item.probabilidadPrecipitacion || 0}%</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>💨 {Math.round(item.vientoVelocidad)} km/h</Text>
            <Text style={styles.detailText}>{getWindDirection(item.vientoDireccion)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>☀️ UV: {item.indiceUV || 0}</Text>
            <Text style={styles.detailText}>👁️ {(item.visibilidad / 1000).toFixed(1)}km</Text>
          </View>
          <View style={styles.centeredDetail}>
            <Text style={styles.detailText}>☁️ Nubes: {item.nubosidad}%</Text>
          </View>
        </View>
      </View>
    );
  };

  const PronosticoPorHoras = () => {
  // Usa city como prop
    const { city } = useLocalSearchParams();
    //Variable que va enrutar a homeapp
    const { weatherData, loading, error, refreshing, onRefresh } = usePronosticoPorHoras(city, 24);

    if (loading && !refreshing) {
      return (
        <LinearGradient colors={['#EBF4FF', '#C3DAFE', '#A5B4FC']} style={styles.container}>
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
        <LinearGradient colors={['#FEF2F2', '#FECACA', '#FCA5A5']} style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorEmoji}>⚠️</Text>
            <Text style={styles.errorTitle}>Error al cargar el clima</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <Text style={styles.errorCity}>Ciudad buscada: "{city}"</Text>
          </View>
        </LinearGradient>
      );
    }
    if (!weatherData) return null;
    return (
      <LinearGradient colors={['#1c416eff', '#C3DAFE', '#465bc2ff']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Por Horas</Text>
          <Text style={styles.location}>
            {weatherData.ubicacion.nombre}
            {weatherData.ubicacion.admin1 && `, ${weatherData.ubicacion.admin1}`}
            {weatherData.ubicacion.pais && `, ${weatherData.ubicacion.pais}`}
          </Text>
          <Text style={styles.subtitle}>Próximas 24 horas</Text>
        </View>
        <FlatList
          data={weatherData.pronosticoHorario}
          renderItem={renderHourlyItem}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#4F46E5"]} tintColor="#4F46E5" />}
        />
        {/* ***********Boton que redirecciona al view Inicial con Prop en la ruta  */}
        <HomeButton title={"Inicio"} route={"/TemperaturaActual"} ci={city} />

      </LinearGradient>
      
    );
  };

  export default PronosticoPorHoras;