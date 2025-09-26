
import React from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePronosticoPorDias } from '../hooks/usePronosticoPorDias';
import { getWeatherGradient, getWeatherEmoji } from '../utils/weatherHelpers';
import { styles } from '../styles/pronosticoPorDias';
import { useLocalSearchParams } from "expo-router";

const formatDate = (date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return 'Hoy';
  if (date.toDateString() === tomorrow.toDateString()) return 'Mañana';
  return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });
};

const formatTime = (date) => {
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const renderDayItem = ({ item }) => {
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
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>{formatDate(item.fecha)}</Text>
          <Text style={styles.weatherEmoji}>{weatherEmoji}</Text>
        </View>
        <View style={styles.temperatureContainer}>
          <View style={styles.temperatureItem}>
            <Text style={styles.temperatureLabel}>Máx</Text>
            <Text style={styles.temperatureValue}>{Math.round(item.temperaturaMaxima)}°C</Text>
          </View>
          <View style={styles.temperatureItem}>
            <Text style={styles.temperatureLabel}>Mín</Text>
            <Text style={styles.temperatureValue}>{Math.round(item.temperaturaMinima)}°C</Text>
          </View>
        </View>
        <Text style={styles.weatherDescription}>{item.descripcionClima}</Text>
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

const PronosticoPorDias = ({ days = 7 }) => {
    const { city } = useLocalSearchParams();
  
  const { weatherData, loading, refreshing, locationInfo, onRefresh } = usePronosticoPorDias(city, days);

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
      <View style={styles.header}>
        <Text style={styles.cityName}>
          {locationInfo ? `${locationInfo.nombre}, ${locationInfo.pais}` : city}
        </Text>
        <Text style={styles.forecastTitle}>Pronóstico por días</Text>
      </View>
      <FlatList
        data={weatherData.pronosticoDiario}
        renderItem={renderDayItem}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default PronosticoPorDias;