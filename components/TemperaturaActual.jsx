import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Para íconos
import getWeatherData from "../climaCliente.js";
import PronosticoPorHoras from './PronosticoPorHoras';
import PronosticoPorDias from './PronosticoPorDias';

const { width, height } = Dimensions.get('window');

const Weather = () => {
  // Estados para manejar los datos del clima y controlar la carga
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('Pucallpa');
  const [country, setCountry] = useState('PE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estados para el autocompletado
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  
  // Ref para el input - En React Native se usa de forma diferente
  const inputRef = useRef(null);
  
  // Debounce timer
  const debounceTimer = useRef(null);

  // API Key - deberías moverla a una variable de entorno o archivo de configuración
  const API_KEY = '7be61e0c0f2aad060ff4fadd517bd683';

  // Función para buscar ciudades usando Geocoding API
  const searchCities = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setLoadingSuggestions(true);
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );
      
      if (response.ok) {
        const cities = await response.json();
        
        // Formatear los datos para mostrar ciudad, estado/región y país
        const formattedCities = cities.map(city => ({
          name: city.name,
          state: city.state || '',
          country: city.country,
          lat: city.lat,
          lon: city.lon,
          displayName: `${city.name}${city.state ? `, ${city.state}` : ''}, ${getCountryName(city.country)}`
        }));
        
        setSuggestions(formattedCities);
      }
    } catch (error) {
      console.error('Error buscando ciudades:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Función para obtener el nombre completo del país
  const getCountryName = (countryCode) => {
    const countries = {
      'PE': 'Perú',
      'AR': 'Argentina',
      'CL': 'Chile',
      'CO': 'Colombia',
      'EC': 'Ecuador',
      'BO': 'Bolivia',
      'BR': 'Brasil',
      'UY': 'Uruguay',
      'PY': 'Paraguay',
      'VE': 'Venezuela',
      'US': 'Estados Unidos',
      'MX': 'México',
      'ES': 'España',
      'FR': 'Francia',
      'IT': 'Italia',
      'DE': 'Alemania',
      'GB': 'Reino Unido',
      'CA': 'Canadá',
      'AU': 'Australia',
      'JP': 'Japón',
      'CN': 'China',
      'IN': 'India',
    };
    return countries[countryCode] || countryCode;
  };

  // useEffect para buscar ciudades con debounce
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (inputValue && showModal) {
        searchCities(inputValue);
      }
    }, 500); // 500ms de debounce

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [inputValue, showModal]);

  // useEffect principal para obtener datos del clima
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const cityQuery = country ? `${city},${country}` : city;
        const response = await getWeatherData(cityQuery);
        
        if (response && response.main) {
          setWeatherData(response);
          // Actualizar el país basado en la respuesta
          if (response.sys && response.sys.country) {
            setCountry(response.sys.country);
          }
        } else {
          setError('No se pudieron obtener los datos del clima');
        }
      } catch (err) {
        setError(`Error al obtener datos: ${err.message}`);
        console.error('Error fetching weather:', err);
      } finally {
        setLoading(false);
      }
    };

    if (city.trim()) {
      fetchWeatherData();
    }
  }, [city, country]);

  // Función para manejar el cambio en el input
  const handleInputChange = (value) => {
    setInputValue(value);
    
    if (value.length > 0 && !showModal) {
      setShowModal(true);
    } else if (value.length === 0) {
      setShowModal(false);
      setSuggestions([]);
    }
  };

  // Función para seleccionar una ciudad del modal
  const selectCity = (selectedCity) => {
    setCity(selectedCity.name);
    setCountry(selectedCity.country);
    setShowModal(false);
    setInputValue('');
    setSuggestions([]);
    // En React Native, limpiar el input se hace así:
    if (inputRef.current) {
      inputRef.current.clear();
    }
    Keyboard.dismiss(); // Cerrar el teclado
  };

  // Función para manejar Enter en el input (onSubmitEditing en React Native)
  const handleSubmit = () => {
    const newCity = inputValue.trim();
    if (newCity) {
      setCity(newCity);
      setShowModal(false);
      setInputValue('');
      setSuggestions([]);
      if (inputRef.current) {
        inputRef.current.clear();
      }
      Keyboard.dismiss();
    }
  };

  // Función para reintentar - Usar Alert en React Native
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Recargar los datos
    const cityQuery = country ? `${city},${country}` : city;
    getWeatherData(cityQuery)
      .then(response => {
        if (response && response.main) {
          setWeatherData(response);
          if (response.sys && response.sys.country) {
            setCountry(response.sys.country);
          }
        } else {
          setError('No se pudieron obtener los datos del clima');
        }
      })
      .catch(err => {
        setError(`Error al obtener datos: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setShowModal(false);
    setInputValue('');
    setSuggestions([]);
    Keyboard.dismiss();
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
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
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
        keyboardShouldPersistTaps="handled" // Para manejar el teclado correctamente
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

      {/* Modal de sugerencias - En React Native se usa Modal component */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.suggestionsModal}>
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
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

// Estilos para React Native - Reemplazan el CSS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff3b30',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
  },
  headerSection: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  countryBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  countryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e1e1e1',
  },
  citySearchInput: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    padding: 12,
  },
  weatherMain: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  temperatureSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTemp: {
    fontSize: 48,
    fontWeight: '300',
    color: '#007AFF',
  },
  feelsLike: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  weatherDescription: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  condition: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conditionText: {
    fontSize: 18,
    color: '#333',
    marginRight: 10,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    paddingTop: 120, // Ajustar según la posición del input
  },
  suggestionsModal: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    maxHeight: 300,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  suggestionsScrollView: {
    maxHeight: 300,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionMain: {
    flex: 1,
  },
  suggestionMainText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  suggestionCountry: {
    fontSize: 14,
    color: '#666',
  },
  suggestionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default Weather;