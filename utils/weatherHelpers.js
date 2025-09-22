// Helpers para pronóstico por días

export const searchLocation = async (name, count = 1, language = 'es') => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=${count}&language=${language}&format=json`
    );
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data = await response.json();
    if (!data.results || data.results.length === 0) return [];
    return data.results.map(location => ({
      id: location.id,
      nombre: location.name,
      latitud: location.latitude,
      longitud: location.longitude,
      elevacion: location.elevation,
      codigo_pais: location.country_code,
      pais: location.country,
      admin1: location.admin1,
      timezone: location.timezone,
      poblacion: location.population,
    }));
  } catch (error) {
    console.error('Error buscando ubicación:', error);
    return [];
  }
};

export const getDailyForecast = async (latitude, longitude, days = 7, timezone = 'auto') => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant&forecast_days=${days}&timezone=${timezone}`
    );
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data = await response.json();
    const dailyData = data.daily.time.map((time, index) => ({
      fecha: new Date(time),
      codigoClima: data.daily.weather_code[index],
      descripcionClima: getWeatherDescription(data.daily.weather_code[index]),
      temperaturaMaxima: data.daily.temperature_2m_max[index],
      temperaturaMinima: data.daily.temperature_2m_min[index],
      sensacionTermicaMax: data.daily.apparent_temperature_max[index],
      sensacionTermicaMin: data.daily.apparent_temperature_min[index],
      amanecer: new Date(data.daily.sunrise[index]),
      atardecer: new Date(data.daily.sunset[index]),
      duracionLuzDia: Math.round(data.daily.daylight_duration[index] / 3600),
      duracionSol: Math.round(data.daily.sunshine_duration[index] / 3600),
      indiceUVMaximo: data.daily.uv_index_max[index],
      precipitacionTotal: data.daily.precipitation_sum[index],
      lluviaTotal: data.daily.rain_sum[index],
      nieveTotal: data.daily.snowfall_sum[index],
      horasPrecipitacion: data.daily.precipitation_hours[index],
      probabilidadPrecipitacionMax: data.daily.precipitation_probability_max[index],
      vientoVelocidadMax: data.daily.wind_speed_10m_max[index],
      vientoRachasMax: data.daily.wind_gusts_10m_max[index],
      vientoDireccionDominante: data.daily.wind_direction_10m_dominant[index],
    }));
    return {
      ubicacion: {
        latitud: data.latitude,
        longitud: data.longitude,
        elevacion: data.elevation,
        timezone: data.timezone,
        utc_offset: data.utc_offset_seconds
      },
      pronosticoDiario: dailyData,
      unidades: data.daily_units,
      tiempoGeneracion: data.generationtime_ms
    };
  } catch (error) {
    console.error('Error obteniendo pronóstico diario:', error);
    return null;
  }
};

export const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Cielo despejado',
    1: 'Principalmente despejado',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Niebla',
    48: 'Niebla con escarcha',
    51: 'Llovizna ligera',
    53: 'Llovizna moderada',
    55: 'Llovizna intensa',
    56: 'Llovizna helada ligera',
    57: 'Llovizna helada intensa',
    61: 'Lluvia ligera',
    63: 'Lluvia moderada',
    65: 'Lluvia intensa',
    66: 'Lluvia helada ligera',
    67: 'Lluvia helada intensa',
    71: 'Nieve ligera',
    73: 'Nieve moderada',
    75: 'Nieve intensa',
    77: 'Granizo',
    80: 'Chubascos ligeros',
    81: 'Chubascos moderados',
    82: 'Chubascos intensos',
    85: 'Chubascos de nieve ligeros',
    86: 'Chubascos de nieve intensos',
    95: 'Tormenta',
    96: 'Tormenta con granizo ligero',
    99: 'Tormenta con granizo intenso'
  };
  return descriptions[code] || `Código: ${code}`;
};

export const getWeatherEmoji = (code) => {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2 || code === 3) return '⛅';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 57) return '🌦️';
  if (code >= 61 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '🌨️';
  if (code >= 80 && code <= 86) return '⛈️';
  if (code >= 95 && code <= 99) return '⚡';
  return '🌤️';
};

export const getWeatherGradient = (code) => {
  if (code === 0 || code === 1) return ['#FFD700', '#FFA500'];
  if (code === 2 || code === 3) return ['#87CEEB', '#4682B4'];
  if (code === 45 || code === 48) return ['#708090', '#2F4F4F'];
  if (code >= 51 && code <= 67) return ['#4682B4', '#191970'];
  if (code >= 71 && code <= 77) return ['#B0C4DE', '#4169E1'];
  if (code >= 80 && code <= 99) return ['#2F4F4F', '#000000'];
  return ['#87CEEB', '#4682B4'];
};
