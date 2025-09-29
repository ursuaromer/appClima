import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
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
    color: '#f9f9f9ff',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#ffffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#ffffffff',
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
