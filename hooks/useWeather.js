import { useState, useEffect } from 'react';
import getWeatherData from '../climaCliente.js';
const getCountryName = (countryCode) => {
  const countries = {
    'PE': 'Perú', 'AR': 'Argentina', 'CL': 'Chile', 'CO': 'Colombia',
    'EC': 'Ecuador', 'BO': 'Bolivia', 'BR': 'Brasil', 'UY': 'Uruguay',
    'PY': 'Paraguay', 'VE': 'Venezuela', 'US': 'Estados Unidos',
    'MX': 'México', 'ES': 'España', 'FR': 'Francia', 'IT': 'Italia',
    'DE': 'Alemania', 'GB': 'Reino Unido', 'CA': 'Canadá', 'AU': 'Australia',
    'JP': 'Japón', 'CN': 'China', 'IN': 'India',
    'AF': 'Afganistán', 'AL': 'Albania', 'DZ': 'Argelia', 'AO': 'Angola',
    'AT': 'Austria', 'BD': 'Bangladés', 'BE': 'Bélgica', 'BG': 'Bulgaria',
    'KH': 'Camboya', 'CM': 'Camerún', 'CZ': 'República Checa', 'DK': 'Dinamarca',
    'EG': 'Egipto', 'FI': 'Finlandia', 'GH': 'Ghana', 'GR': 'Grecia',
    'HU': 'Hungría', 'ID': 'Indonesia', 'IE': 'Irlanda', 'IL': 'Israel',
    'KE': 'Kenia', 'KR': 'Corea del Sur', 'MA': 'Marruecos', 'NL': 'Países Bajos',
    'NG': 'Nigeria', 'NO': 'Noruega', 'NZ': 'Nueva Zelanda', 'PK': 'Pakistán',
    'PH': 'Filipinas', 'PL': 'Polonia', 'PT': 'Portugal', 'RO': 'Rumania',
    'RU': 'Rusia', 'SA': 'Arabia Saudita', 'SE': 'Suecia', 'SG': 'Singapur',
    'ZA': 'Sudáfrica', 'TH': 'Tailandia', 'TR': 'Turquía', 'UA': 'Ucrania',
    'VN': 'Vietnam', 'AM': 'Armenia', 'AZ': 'Azerbaiyán', 'BH': 'Baréin',
    'BY': 'Bielorrusia', 'BN': 'Brunéi', 'CR': 'Costa Rica', 'HR': 'Croacia',
    'CU': 'Cuba', 'CY': 'Chipre', 'DO': 'República Dominicana', 'SV': 'El Salvador',
    'EE': 'Estonia', 'ET': 'Etiopía', 'GE': 'Georgia', 'GT': 'Guatemala',
    'HN': 'Honduras', 'IS': 'Islandia', 'IQ': 'Irak', 'IR': 'Irán',
    'JM': 'Jamaica', 'JO': 'Jordania', 'KZ': 'Kazajistán', 'KW': 'Kuwait',
    'KG': 'Kirguistán', 'LA': 'Laos', 'LV': 'Letonia', 'LB': 'Líbano',
    'LT': 'Lituania', 'LU': 'Luxemburgo', 'MY': 'Malasia', 'MT': 'Malta',
    'MD': 'Moldavia', 'MN': 'Mongolia', 'ME': 'Montenegro', 'MA': 'Marruecos',
    'NP': 'Nepal', 'NI': 'Nicaragua', 'OM': 'Omán', 'PA': 'Panamá',
    'QA': 'Catar', 'RS': 'Serbia', 'SK': 'Eslovaquia', 'SI': 'Eslovenia',
    'LK': 'Sri Lanka', 'CH': 'Suiza', 'SY': 'Siria', 'TJ': 'Tayikistán',
    'TT': 'Trinidad y Tobago', 'TN': 'Túnez', 'TM': 'Turkmenistán', 'AE': 'Emiratos Árabes Unidos',
    'UZ': 'Uzbekistán', 'YE': 'Yemen'
  };
  return countries[countryCode] || countryCode;
};
export default function useWeather(city, country) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        const cityQuery = country ? `${city},${country}` : city;
        const response = await getWeatherData(cityQuery);
        if (response && response.main) {
          setWeatherData(response);
        } else {
          setError('No se pudieron obtener los datos del clima');
        }
      } catch (err) {
        setError(`Error al obtener datos: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    if (city.trim()) {
      fetchWeatherData();
    }
  }, [city, country]);

  const retry = async () => {
    setError(null);
    setLoading(true);
    const cityQuery = country ? `${city},${country}` : city;
    try {
      const response = await getWeatherData(cityQuery);
      if (response && response.main) {
        setWeatherData(response);
      } else {
        setError('No se pudieron obtener los datos del clima');
      }
    } catch (err) {
      setError(`Error al obtener datos: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return { weatherData, loading, error, retry, getCountryName };
}
