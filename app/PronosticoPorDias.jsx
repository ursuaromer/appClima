import React from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { usePronosticoPorDias } from '../hooks/usePronosticoPorDias';
import { getWeatherGradient, getWeatherEmoji } from '../utils/weatherHelpers';
import { useLocalSearchParams } from "expo-router";
import HomeButton from '../components/Botttoms/HomeButton';
import  {styles}  from '../styles/pronosticoPorDias'; // Moveré los estilos al final del archivo
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

// Función para obtener gradientes más suaves
const getSoftGradient = (codigoClima) => {
  // Si tienes tu función getWeatherGradient, puedes usarla como base
  // y aplicar estos gradientes más suaves como alternativa
  const softGradients = {
    sunny: ['#FFE8CC', '#FFD4A3', '#FFBE7D'],
    cloudy: ['#E8F1F5', '#D1E7F0', '#B8DCE8'],
    rainy: ['#E1F0F5', '#C7E4EA', '#AED7DF'],
    stormy: ['#E5E7EB', '#D1D5DB', '#9CA3AF'],
    snowy: ['#F8FAFC', '#F1F5F9', '#E2E8F0'],
    default: ['#F7FAFC', '#EDF2F7', '#E2E8F0']
  };
  
  // Aquí puedes mapear tu codigoClima a estos gradientes suaves
  return softGradients.default;
};

const renderDayItem = ({ item }) => {
  const gradientColors = getSoftGradient(item.codigoClima);
  const weatherEmoji = getWeatherEmoji(item.codigoClima);
  
  return (
    <View style={styles.dayContainer}>
      <LinearGradient
        colors={gradientColors}
        style={styles.dayCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Overlay sutil para más suavidad */}
        <View style={styles.cardOverlay}>
          <View style={styles.dayHeader}>
            <View>
              <Text style={styles.dayTitle}>{formatDate(item.fecha)}</Text>
              <Text style={styles.weatherDescription}>{item.descripcionClima}</Text>
            </View>
            <View style={styles.weatherEmojiContainer}>
              <Text style={styles.weatherEmoji}>{weatherEmoji}</Text>
            </View>
          </View>
          
          <View style={styles.temperatureContainer}>
            <View style={styles.temperatureCard}>
              <Text style={styles.temperatureLabel}>Máxima</Text>
              <Text style={styles.temperatureMax}>{Math.round(item.temperaturaMaxima)}°</Text>
            </View>
            <View style={styles.temperatureDivider} />
            <View style={styles.temperatureCard}>
              <Text style={styles.temperatureLabel}>Mínima</Text>
              <Text style={styles.temperatureMin}>{Math.round(item.temperaturaMinima)}°</Text>
            </View>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <InfoItem icon="💧" label="Precipitación" value={`${item.probabilidadPrecipitacionMax}%`} />
              <InfoItem icon="💨" label="Viento" value={`${Math.round(item.vientoVelocidadMax)} km/h`} />
            </View>
            <View style={styles.detailRow}>
              <InfoItem icon="🌅" label="Amanecer" value={formatTime(item.amanecer)} />
              <InfoItem icon="🌇" label="Atardecer" value={formatTime(item.atardecer)} />
            </View>
            <View style={styles.detailRow}>
              <InfoItem icon="☀️" label="Índice UV" value={Math.round(item.indiceUVMaximo)} />
              <InfoItem icon="🌞" label="Horas de sol" value={`${item.duracionSol}h`} />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

// Componente reutilizable para información adicional
const InfoItem = ({ icon, label, value }) => (
  <View style={styles.infoItem}>
    <View style={styles.infoHeader}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const PronosticoPorDias = ({ days = 7 }) => {
  const { city } = useLocalSearchParams();
  const { weatherData, loading, refreshing, locationInfo, onRefresh } = usePronosticoPorDias(city, days);

  if (loading) {
    return (
      <LinearGradient
        colors={['#F7FAFC', '#EDF2F7']}
        style={styles.loadingContainer}
      >
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#667EEA" />
          <Text style={styles.loadingText}>Cargando pronóstico...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!weatherData || !weatherData.pronosticoDiario) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <Text style={styles.errorEmoji}>🌫️</Text>
          <Text style={styles.errorText}>No se pudieron cargar los datos del clima</Text>
          <Text style={styles.errorSubtext}>Desliza hacia abajo para intentar nuevamente</Text>
        </View>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#1f60a0ff', '#F4F6F8', '#7b99b7ff']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.cityName}>
          {locationInfo ? `${locationInfo.nombre},${locationInfo.admin1}, ${locationInfo.pais}` : city}
        </Text>
        <Text style={styles.forecastTitle}>Pronóstico extendido</Text>
      </View>
      
      <FlatList
        data={weatherData.pronosticoDiario}
        renderItem={renderDayItem}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={['#667EEA']}
            tintColor="#667EEA"
          />
        }
        contentContainerStyle={styles.listContainer}
      />


        {/* ***********Boton que redirecciona al view Inicial con Prop en la ruta  */}
      <HomeButton title={"Inicio"} route={"/TemperaturaActual"} ci={city} />

    </LinearGradient>
  );
};



export default PronosticoPorDias;