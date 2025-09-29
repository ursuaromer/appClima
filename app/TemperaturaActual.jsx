import React, { useState, useRef } from "react";
import styles from "../styles/temperaturaActual.js";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/MaterialIcons";
import useWeather from "../hooks/useWeather";
import useCityAutocomplete from "../hooks/useCityAutocomplete";
import styl from "../styles/buttons/buttonsLayout.js";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";


const Weather = () => {
  const { ci } = useLocalSearchParams();// Prop en la ruta 
  const [city, setCity] = useState(ci||"Pucallpa"); //Si hay una String de ciudad en la ruta, se usa, sino Pucallpa
  const [country, setCountry] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();



  // Weather hook
  const { weatherData, loading, error, retry, getCountryName } = useWeather(
    city,
    country
  );
  // Autocomplete hook
  const { suggestions, loadingSuggestions, closeModal } = useCityAutocomplete(
    showModal,
    inputValue
  );

  // Función para convertir grados a punto cardinal
  const getWindDirection = (degrees) => {
    if (!degrees) return "N/A";
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  // Función para formatear hora
  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Función para calcular duración del día
  const getDayDuration = (sunrise, sunset) => {
    if (!sunrise || !sunset) return "N/A";
    const duration = sunset - sunrise;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Función para obtener descripción de visibilidad
  const getVisibilityDescription = (visibility) => {
    if (!visibility) return "N/A";
    const km = visibility / 1000;
    if (km >= 10) return `${km.toFixed(1)} km (Excelente)`;
    if (km >= 5) return `${km.toFixed(1)} km (Buena)`;
    if (km >= 2) return `${km.toFixed(1)} km (Moderada)`;
    return `${km.toFixed(1)} km (Pobre)`;
  };

  // Handlers (mantener los existentes)
  const handleInputChange = (value) => {
    setInputValue(value);
    if (value.length > 0 && !showModal) {
      setShowModal(true);
    } else if (value.length === 0) {
      setShowModal(false);
    }
  };

  const selectCity = (selectedCity) => {
    setCity(selectedCity.name);
    setCountry(selectedCity.country);
    setShowModal(false);
    setInputValue("");
    if (inputRef.current) inputRef.current.clear();
  };

  const handleSubmit = () => {
    const newCity = inputValue.trim();
    if (newCity) {
      setCity(newCity);
      setShowModal(false);
      setInputValue("");
      if (inputRef.current) inputRef.current.clear();
    }
  };

  // Renderizado condicional para carga
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando datos del clima...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Renderizado condicional para error
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Renderizado condicional para datos no disponibles
  if (!weatherData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.noDataText}>No hay datos disponibles</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Sección del encabezado - mantener igual */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{weatherData.name}</Text>
          {weatherData.sys?.country && (
            <View style={styles.countryBadge}>
              <Text style={styles.countryText}>
                {getCountryName(weatherData.sys.country)}
              </Text>
            </View>
          )}
          
          {/* Coordenadas */}
          {weatherData.coord && (
            <Text style={styles.coordinates}>
              Lat: {weatherData.coord.lat.toFixed(4)}, Lon: {weatherData.coord.lon.toFixed(4)}
            </Text>
          )}

          {/* Input de búsqueda - mantener igual */}
          <View style={styles.searchContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                ref={inputRef}
                style={styles.citySearchInput}
                placeholder="Buscar ciudad..."
                placeholderTextColor="#999"
                value={inputValue}
                onChangeText={handleInputChange}
                onSubmitEditing={handleSubmit}
                onFocus={() => inputValue.length > 0 && setShowModal(true)}
                returnKeyType="search"
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => inputRef.current?.focus()}
              >
                <Icon name="search" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            
            {/* Modal de sugerencias - mantener igual */}
            {showModal && inputValue.length > 0 && (
              <View
                style={[
                  styles.suggestionsModal,
                  {
                    position: "absolute",
                    top: 55,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                  },
                ]}
              >
                <ScrollView
                  style={styles.suggestionsScrollView}
                  keyboardShouldPersistTaps="handled"
                >
                  {loadingSuggestions ? (
                    <View style={styles.suggestionItem}>
                      <ActivityIndicator size="small" color="#007AFF" />
                      <Text style={styles.suggestionText}>
                        Buscando ciudades...
                      </Text>
                    </View>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => selectCity(suggestion)}
                      >
                        <View style={styles.suggestionMain}>
                          <Text style={styles.suggestionMainText}>
                            {suggestion.name}
                            {suggestion.state && (
                              <Text>, {suggestion.state}</Text>
                            )}
                          </Text>
                        </View>
                        <Text style={styles.suggestionCountry}>
                          {getCountryName(suggestion.country)}
                        </Text>
                      </TouchableOpacity>
                    ))
                  ) : inputValue.length > 1 ? (
                    <View style={styles.suggestionItem}>
                      <Text style={styles.noResultsText}>
                        No se encontraron ciudades
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.suggestionItem}>
                      <Text style={styles.suggestionText}>
                        Escribe al menos 2 caracteres...
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
          </View>
        </View>

        {/* Información principal del clima - MEJORADA */}
        <View style={styles.weatherMain}>
          <View style={styles.temperatureSection}>
            <Text style={styles.mainTemp}>
              {Math.round(weatherData.main.temp)}°C
            </Text>
            <Text style={styles.feelsLike}>
              Sensación: {Math.round(weatherData.main.feels_like)}°C
            </Text>
            
            {/* Temperaturas min/max */}
            <View style={styles.tempRange}>
              <Text style={styles.tempRangeText}>
                Min: {Math.round(weatherData.main.temp_min)}°C
              </Text>
              <Text style={styles.tempRangeText}>
                Max: {Math.round(weatherData.main.temp_max)}°C
              </Text>
            </View>
          </View>
        </View>

        {/* Grid de detalles mejorado */}
        <View style={styles.detailsGrid}>
          {/* Fila 1 */}
          <View style={styles.detailsRow}>
            <View style={styles.detailCard}>
              <Icon name="opacity" size={24} color="#4A90E2" />
              <Text style={styles.detailLabel}>Humedad</Text>
              <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
            </View>
            <View style={styles.detailCard}>
              <Icon name="speed" size={24} color="#4A90E2" />
              <Text style={styles.detailLabel}>Presión</Text>
              <Text style={styles.detailValue}>{weatherData.main.pressure}</Text>
              <Text style={styles.detailUnit}>hPa</Text>
            </View>
          </View>

          {/* Fila 2 - Viento */}
          <View style={styles.detailsRow}>
            <View style={styles.detailCard}>
              <Icon name="air" size={24} color="#4A90E2" />
              <Text style={styles.detailLabel}>Viento</Text>
              <Text style={styles.detailValue}>
                {weatherData.wind?.speed || 0} m/s
              </Text>
              <Text style={styles.detailDirection}>
                {getWindDirection(weatherData.wind?.deg)}
              </Text>
            </View>
            {weatherData.wind?.gust && (
              <View style={styles.detailCard}>
                <Icon name="toys" size={24} color="#4A90E2" />
                <Text style={styles.detailLabel}>Ráfagas</Text>
                <Text style={styles.detailValue}>{weatherData.wind.gust} m/s</Text>
              </View>
            )}
          </View>

          {/* Fila 3 - Visibilidad y Nubosidad */}
          <View style={styles.detailsRow}>
            {weatherData.visibility && (
              <View style={styles.detailCard}>
                <Icon name="visibility" size={24} color="#4A90E2" />
                <Text style={styles.detailLabel}>Visibilidad</Text>
                <Text style={styles.detailValue}>
                  {getVisibilityDescription(weatherData.visibility)}
                </Text>
              </View>
            )}
            {weatherData.clouds && (
              <View style={styles.detailCard}>
                <Icon name="cloud" size={24} color="#4A90E2" />
                <Text style={styles.detailLabel}>Nubosidad</Text>
                <Text style={styles.detailValue}>{weatherData.clouds.all}%</Text>
              </View>
            )}
          </View>

          {/* Fila 4 - Amanecer y Atardecer */}
          {weatherData.sys && (
            <View style={styles.sunSection}>
              <Text style={styles.sunSectionTitle}>Información Solar</Text>
              <View style={styles.detailsRow}>
                <View style={styles.detailCard}>
                  <Icon name="wb-sunny" size={24} color="#FFA500" />
                  <Text style={styles.detailLabel}>Amanecer</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(weatherData.sys.sunrise)}
                  </Text>
                </View>
                <View style={styles.detailCard}>
                  <Icon name="brightness-2" size={24} color="#FF6B6B" />
                  <Text style={styles.detailLabel}>Atardecer</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(weatherData.sys.sunset)}
                  </Text>
                </View>
              </View>

               <View style={styles.dayDurationCard}>
                <Text style={styles.dayDurationLabel}>Duración del día:</Text>
                <Text style={styles.dayDurationValue}>
                  {getDayDuration(weatherData.sys.sunrise, weatherData.sys.sunset)}
                </Text>
              </View>
           
            </View>
          )}
        </View>
          
      </ScrollView>
      

      {/* Botones de Redireccionamiento - mantener igual */}
      <View>
        <View style={styl.bottomBar}>
          <TouchableOpacity
            style={styl.button}
            onPress={() => router.push({ pathname: "/PronosticoPorHoras", params: { city } })}
          >
            <Text style={styl.buttonText}>Pronóstico por Horas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styl.button}
            onPress={() => router.push({ pathname: "/PronosticoPorDias", params: { city } })}
          >
            <Text style={styl.buttonText}>Pronóstico por Días</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Weather;