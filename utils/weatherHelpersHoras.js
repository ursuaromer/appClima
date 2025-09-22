export const getWeatherEmoji = (code) => {
  if (code === 0 || code === 1) return '☀️';
  if (code === 2 || code === 3) return '☁️';
  if (code >= 45 && code <= 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 86) return '❄️';
  if (code >= 95 && code <= 99) return '⛈️';
  return '☁️';
};

export function getWeatherDescription(code) {
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
  return descriptions[code] || `Código de clima: ${code}`;
}

export async function searchLocation(name, count = 1, language = 'es') {
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
      feature_code: location.feature_code,
      codigo_pais: location.country_code,
      pais: location.country,
      admin1: location.admin1,
      timezone: location.timezone,
      poblacion: location.population
    }));
  } catch (error) {
    console.error('Error buscando ubicación:', error);
    return [];
  }
}

export async function getHourlyWeatherByCity(cityName, hours = 24) {
  try {
    const locations = await searchLocation(cityName, 1);
    if (locations.length === 0) throw new Error('Ciudad no encontrada');
    const location = locations[0];
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitud}&longitude=${location.longitud}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,weather_code,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&forecast_days=3&timezone=${location.timezone}`
    );
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const data = await response.json();
    const pronosticoHorario = data.hourly.time.slice(0, hours).map((time, index) => ({
      tiempo: new Date(time),
      temperatura: data.hourly.temperature_2m[index],
      humedad: data.hourly.relative_humidity_2m[index],
      sensacionTermica: data.hourly.apparent_temperature[index],
      probabilidadPrecipitacion: data.hourly.precipitation_probability[index],
      precipitacion: data.hourly.precipitation[index],
      lluvia: data.hourly.rain[index],
      codigoClima: data.hourly.weather_code[index],
      descripcionClima: getWeatherDescription(data.hourly.weather_code[index]),
      nubosidad: data.hourly.cloud_cover[index],
      visibilidad: data.hourly.visibility[index],
      vientoVelocidad: data.hourly.wind_speed_10m[index],
      vientoDireccion: data.hourly.wind_direction_10m[index],
      vientoRachas: data.hourly.wind_gusts_10m[index],
      indiceUV: data.hourly.uv_index[index]
    }));
    return {
      ubicacion: {
        nombre: location.nombre,
        pais: location.pais,
        admin1: location.admin1,
        latitud: location.latitud,
        longitud: location.longitud,
        timezone: data.timezone
      },
      pronosticoHorario,
      unidades: data.hourly_units
    };
  } catch (error) {
    console.error('Error obteniendo clima por horas:', error);
    throw error;
  }
}
