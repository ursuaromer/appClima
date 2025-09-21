import { StyleSheet } from 'react-native';


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
    position: 'relative', // Para que el dropdown se posicione respecto a este contenedor
    zIndex: 100, // Asegura que el dropdown esté por encima
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
    zIndex: -1, // Propiedad zIndex añadida con un valor bajo
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

export default styles;