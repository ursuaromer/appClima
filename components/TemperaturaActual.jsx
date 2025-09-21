
import React, { useState, useRef } from 'react';
import styles from '../styles/temperaturaActual.js';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PronosticoPorHoras from './PronosticoPorHoras';
import PronosticoPorDias from './PronosticoPorDias';
import useWeather from '../hooks/useWeather';
import useCityAutocomplete from '../hooks/useCityAutocomplete';

const Weather = () => {
  const [city, setCity] = useState('Pucallpa');
  const [country, setCountry] = useState('PE');
  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef(null);

  // Weather hook
  const { weatherData, loading, error, retry, getCountryName } = useWeather(city, country);
  // Autocomplete hook
  const { suggestions, loadingSuggestions, closeModal } = useCityAutocomplete(showModal, inputValue);

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
                <Icon name="search" size={20} color="#666" />
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

        {/* Componentes adicionales */}
        <PronosticoPorDias city={city}/>
        <PronosticoPorHoras city={city}/>
      </ScrollView>

      {/* Eliminado Modal, ahora dropdown debajo del input */}
    </SafeAreaView>
  );
}

export default Weather;