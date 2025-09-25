
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useCityAutocomplete from '../hooks/useCityAutocomplete';
import useWeather from '../hooks/useWeather';
import styles from '../styles/temperaturaActual.js';
import PronosticoPorDias from './PronosticoPorDias';
import PronosticoPorHoras from './PronosticoPorHoras';

const Weather = () => {
  const [city, setCity] = useState('Pucallpa');
  const [country, setCountry] = useState('PE');
  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  // Weather hook
  const { weatherData, loading, error, retry, getCountryName } = useWeather(city, country);
  // Autocomplete hook
  const { suggestions, loadingSuggestions } = useCityAutocomplete(showModal, inputValue);

  // Handlers
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
    setInputValue('');
    if (inputRef.current) inputRef.current.clear();
  };

  const handleSubmit = () => {
    const newCity = inputValue.trim();
    if (newCity) {
      setCity(newCity);
      setShowModal(false);
      setInputValue('');
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
        {/* Sección del encabezado */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>
            Clima en {weatherData.name}
          </Text>
          {weatherData.sys?.country && (
            <View style={styles.countryBadge}>
              <Text style={styles.countryText}>
                {getCountryName(weatherData.sys.country)}
              </Text>
            </View>
          )}
          {/* Input de búsqueda */}
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
                <MaterialIcons name="search" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            {/* Sugerencias tipo dropdown debajo del input */}
            {showModal && inputValue.length > 0 && (
              <View style={[styles.suggestionsModal, { position: 'absolute', top: 55, left: 0, right: 0, zIndex: 100 }]}> 
                <ScrollView 
                  style={styles.suggestionsScrollView}
                  keyboardShouldPersistTaps="handled"
                >
                  {loadingSuggestions ? (
                    <View style={styles.suggestionItem}>
                      <ActivityIndicator size="small" color="#007AFF" />
                      <Text style={styles.suggestionText}>Buscando ciudades...</Text>
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
                            {suggestion.state && <Text>, {suggestion.state}</Text>}
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

        {/* Información principal del clima */}
        <View style={styles.weatherMain}>
          <View style={styles.temperatureSection}>
            <Text style={styles.mainTemp}>
              {Math.round(weatherData.main.temp)}°C
            </Text>
            <Text style={styles.feelsLike}>
              Sensación: {Math.round(weatherData.main.feels_like)}°C
            </Text>
          </View>
          <View style={styles.weatherDetails}>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Humedad:</Text>
              <Text style={styles.value}>{weatherData.main.humidity}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Presión:</Text>
              <Text style={styles.value}>{weatherData.main.pressure} hPa</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.label}>Viento:</Text>
              <Text style={styles.value}>{weatherData.wind?.speed || 0} m/s</Text>
            </View>
          </View>
        </View>

        {/* Descripción del clima */}
        {weatherData.weather && weatherData.weather[0] && (
          <View style={styles.weatherDescription}>
            <View style={styles.condition}>
              <Text style={styles.conditionText}>
                {weatherData.weather[0].description.charAt(0).toUpperCase() + 
                weatherData.weather[0].description.slice(1)}
              </Text>
              <Image 
                source={{
                  uri: `https://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`
                }}
                style={styles.weatherIcon}
                resizeMode="contain"
              />
            </View>
          </View>
        )}

        {/* Botones de navegación */}
        <View style={styles.navigationButtonsContainer}>
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => router.push('/pronostico-dias')}
          >
            <MaterialIcons name="calendar-today" size={24} color="#007AFF" />
            <Text style={styles.navigationButtonText}>Pronóstico por Días</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navigationButton}
            onPress={() => router.push('/pronostico-horas')}
          >
            <MaterialIcons name="schedule" size={24} color="#007AFF" />
            <Text style={styles.navigationButtonText}>Pronóstico por Horas</Text>
          </TouchableOpacity>
        </View>

        {/* Componentes de Dias por Horas */}
        <PronosticoPorDias city={city}/>
        <PronosticoPorHoras city={city}/>
      </ScrollView>

      {/* Eliminado Modal, ahora dropdown debajo del input */}
    </SafeAreaView>
  );
}

export default Weather;