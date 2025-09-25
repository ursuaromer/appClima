// import { StyleSheet } from 'react-native';


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#666',
//   },
//   errorTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#ff3b30',
//     marginBottom: 10,
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#ff3b30',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   retryButton: {
//     backgroundColor: '#007AFF',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   noDataText: {
//     fontSize: 16,
//     color: '#666',
//   },
//   headerSection: {
//     padding: 20,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e1e1e1',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 10,
//   },
//   countryBadge: {
//     backgroundColor: '#007AFF',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//     marginBottom: 15,
//   },
//   countryText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   searchContainer: {
//     marginTop: 10,
//     position: 'relative', // Para que el dropdown se posicione respecto a este contenedor
//     zIndex: 100, // Asegura que el dropdown esté por encima
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f8f8f8',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#e1e1e1',
//   },
//   citySearchInput: {
//     flex: 1,
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#333',
//   },
//   searchButton: {
//     padding: 12,
//   },
//   weatherMain: {
//     backgroundColor: 'white',
//     margin: 15,
//     padding: 20,
//     borderRadius: 15,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     zIndex: -1, // Propiedad zIndex añadida con un valor bajo
//   },
//   temperatureSection: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   mainTemp: {
//     fontSize: 48,
//     fontWeight: '300',
//     color: '#007AFF',
//   },
//   feelsLike: {
//     fontSize: 16,
//     color: '#666',
//     marginTop: 5,
//   },
//   weatherDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   detailItem: {
//     alignItems: 'center',
//   },
//   label: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 5,
//   },
//   value: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   weatherDescription: {
//     backgroundColor: 'white',
//     marginHorizontal: 15,
//     marginBottom: 15,
//     padding: 20,
//     borderRadius: 15,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   condition: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   conditionText: {
//     fontSize: 18,
//     color: '#333',
//     marginRight: 10,
//   },
//   weatherIcon: {
//     width: 50,
//     height: 50,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-start',
//     paddingTop: 120, // Ajustar según la posición del input
//   },
//   suggestionsModal: {
//     backgroundColor: 'white',
//     marginHorizontal: 20,
//     maxHeight: 300,
//     borderRadius: 10,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//   },
//   suggestionsScrollView: {
//     maxHeight: 300,
//   },
//   suggestionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   suggestionMain: {
//     flex: 1,
//   },
//   suggestionMainText: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
//   suggestionCountry: {
//     fontSize: 14,
//     color: '#666',
//   },
//   suggestionText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//   },
//   noResultsText: {
//     fontSize: 16,
//     color: '#999',
//     textAlign: 'center',
//   },
// });

// export default styles;



// ------------------------------------



// import { StyleSheet } from 'react-native';

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)', // Fondo degradado cielo
//   },
//   scrollView: {
//     flex: 1,
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 18,
//     fontWeight: '500',
//     color: '#fff',
//   },
//   errorTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#ff4d4f',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   errorText: {
//     fontSize: 16,
//     color: '#fff',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   retryButton: {
//     backgroundColor: '#ff9800',
//     paddingHorizontal: 25,
//     paddingVertical: 12,
//     borderRadius: 25,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 6,
//   },
//   retryButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   noDataText: {
//     fontSize: 16,
//     color: '#f1f1f1',
//   },
//   headerSection: {
//     padding: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     borderBottomWidth: 0,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   countryBadge: {
//     backgroundColor: '#2196F3',
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 20,
//     alignSelf: 'center',
//     marginBottom: 15,
//   },
//   countryText: {
//     color: 'white',
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   searchContainer: {
//     marginTop: 10,
//     position: 'relative',
//     zIndex: 100,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     borderRadius: 15,
//     borderWidth: 0,
//     paddingHorizontal: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 5,
//   },
//   citySearchInput: {
//     flex: 1,
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#333',
//   },
//   searchButton: {
//     padding: 12,
//   },
//   weatherMain: {
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     margin: 15,
//     padding: 25,
//     borderRadius: 20,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.15,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//   },
//   temperatureSection: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   mainTemp: {
//     fontSize: 64,
//     fontWeight: 'bold',
//     color: '#ff9800',
//     textShadowColor: 'rgba(0,0,0,0.3)',
//     textShadowOffset: { width: 2, height: 2 },
//     textShadowRadius: 4,
//   },
//   feelsLike: {
//     fontSize: 16,
//     color: '#555',
//     marginTop: 5,
//   },
//   weatherDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//   },
//   detailItem: {
//     alignItems: 'center',
//   },
//   label: {
//     fontSize: 14,
//     color: '#777',
//     marginBottom: 5,
//   },
//   value: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#333',
//   },
//   weatherDescription: {
//     backgroundColor: 'rgba(255,255,255,0.95)',
//     marginHorizontal: 15,
//     marginBottom: 15,
//     padding: 20,
//     borderRadius: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//   },
//   condition: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   conditionText: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333',
//     marginRight: 10,
//   },
//   weatherIcon: {
//     width: 60,
//     height: 60,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'flex-start',
//     paddingTop: 120,
//   },
//   suggestionsModal: {
//     backgroundColor: 'white',
//     marginHorizontal: 20,
//     maxHeight: 300,
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOpacity: 0.25,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//   },
//   suggestionsScrollView: {
//     maxHeight: 300,
//   },
//   suggestionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   suggestionMain: {
//     flex: 1,
//   },
//   suggestionMainText: {
//     fontSize: 16,
//     color: '#333',
//     fontWeight: '500',
//   },
//   suggestionCountry: {
//     fontSize: 14,
//     color: '#666',
//   },
//   suggestionText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//   },
//   noResultsText: {
//     fontSize: 16,
//     color: '#bbb',
//     textAlign: 'center',
//   },
// });

// export default styles;


// ------------------------------





import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'linear-gradient(180deg, #87CEEB 0%, #fefefe 100%)', // azul cielo a blanco nube
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    padding: 25,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderBottomWidth: 0,
    borderRadius: 25,
    margin: 15,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  countryBadge: {
    backgroundColor: '#ffdd59', // amarillo sol
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10,
  },
  countryText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
  },
  weatherMain: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    margin: 15,
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    alignItems: 'center',
  },
  temperatureSection: {
    alignItems: 'center',
    marginBottom: 15,
  },
  mainTemp: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#ff8c42', // naranja cálido como el sol
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  feelsLike: {
    fontSize: 18,
    color: '#555',
    marginTop: 6,
  },
  condition: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  conditionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginRight: 12,
  },
  weatherIcon: {
    width: 70,
    height: 70,
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  detailItem: {
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#777',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
  },
  weatherDescription: {
    backgroundColor: '#f0f9ff',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  suggestionItem: {
    backgroundColor: '#dff6ff', // celeste nube
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    marginVertical: 5,
  },
  suggestionMainText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  suggestionCountry: {
    fontSize: 14,
    color: '#555',
  },
  retryButton: {
    backgroundColor: '#4fc3f7', // azul cielo
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  noResultsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 15,
  },
  // Estilos para botones de navegación
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    minWidth: 140,
    justifyContent: 'center',
  },
  navigationButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default styles;
