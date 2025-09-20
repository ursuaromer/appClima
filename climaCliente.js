const API_KEY = '7be61e0c0f2aad060ff4fadd517bd683';

// Método existente (clima actual)
async function getWeatherData(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
        );
        const datos = await response.json();
        return datos;
    } catch (error) {
        console.error('Error obteniendo clima actual:', error);
        return null;
    }
}

// 1. PRONÓSTICO POR HORAS (4 días, cada hora)
async function getHourlyForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast/hourly?q=${city}&appid=${API_KEY}&units=metric&lang=es`
        );
        const datos = await response.json();
        
        // Procesar datos para mostrar pronóstico por horas
        const hourlyData = datos.list.map(item => ({
            fecha: new Date(item.dt * 1000),
            temperatura: item.main.temp,
            descripcion: item.weather[0].description,
            humedad: item.main.humidity,
            viento: item.wind.speed,
            probabilidadLluvia: item.pop * 100 // Probability of precipitation
        }));
        
        return {
            ciudad: datos.city.name,
            pais: datos.city.country,
            pronosticoHorario: hourlyData
        };
    } catch (error) {
        console.error('Error obteniendo pronóstico por horas:', error);
        return null;
    }
}

// 2. PRONÓSTICO DE 5 DÍAS (cada 3 horas)
async function get5DayForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=es`
        );
        const datos = await response.json();
        
        // Procesar datos para agrupar por días
        const dailyData = {};
        datos.list.forEach(item => {
            const fecha = new Date(item.dt * 1000).toDateString();
            if (!dailyData[fecha]) {
                dailyData[fecha] = [];
            }
            dailyData[fecha].push({
                hora: new Date(item.dt * 1000).getHours(),
                temperatura: item.main.temp,
                descripcion: item.weather[0].description,
                humedad: item.main.humidity,
                viento: item.wind.speed,
                probabilidadLluvia: item.pop * 100
            });
        });
        
        return {
            ciudad: datos.city.name,
            pais: datos.city.country,
            pronosticoPorDias: dailyData
        };
    } catch (error) {
        console.error('Error obteniendo pronóstico de 5 días:', error);
        return null;
    }
}

// 3. PRONÓSTICO DIARIO DE 16 DÍAS
async function get16DayForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=16&appid=${API_KEY}&units=metric&lang=es`
        );
        const datos = await response.json();
        
        const dailyForecast = datos.list.map(item => ({
            fecha: new Date(item.dt * 1000),
            temperaturaMax: item.temp.max,
            temperaturaMin: item.temp.min,
            temperaturaDia: item.temp.day,
            temperaturaNoche: item.temp.night,
            descripcion: item.weather[0].description,
            humedad: item.humidity,
            viento: item.speed,
            probabilidadLluvia: item.pop ? item.pop * 100 : 0,
            presion: item.pressure
        }));
        
        return {
            ciudad: datos.city.name,
            pais: datos.city.country,
            pronostico16Dias: dailyForecast
        };
    } catch (error) {
        console.error('Error obteniendo pronóstico de 16 días:', error);
        return null;
    }
}

// 4. ONE CALL API (MÁS COMPLETA - RECOMENDADA)
async function getCompleteWeatherData(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
        );
        const datos = await response.json();
        
        return {
            actual: {
                temperatura: datos.current.temp,
                sensacionTermica: datos.current.feels_like,
                descripcion: datos.current.weather[0].description,
                humedad: datos.current.humidity,
                viento: datos.current.wind_speed,
                presion: datos.current.pressure,
                visibilidad: datos.current.visibility
            },
            pronosticoHorario: datos.hourly?.slice(0, 48).map(item => ({
                hora: new Date(item.dt * 1000),
                temperatura: item.temp,
                probabilidadLluvia: item.pop * 100,
                descripcion: item.weather[0].description
            })),
            pronosticoDiario: datos.daily?.slice(0, 8).map(item => ({
                fecha: new Date(item.dt * 1000),
                tempMax: item.temp.max,
                tempMin: item.temp.min,
                descripcion: item.weather[0].description,
                probabilidadLluvia: item.pop * 100,
                resumen: item.summary // Solo disponible en One Call API 3.0
            })),
            alertas: datos.alerts || []
        };
    } catch (error) {
        console.error('Error con One Call API:', error);
        return null;
    }
}

// 5. FUNCIÓN AUXILIAR: Obtener coordenadas de una ciudad
async function getCoordinates(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
        );
        const datos = await response.json();
        
        if (datos.length > 0) {
            return {
                lat: datos[0].lat,
                lon: datos[0].lon,
                nombre: datos[0].name,
                pais: datos[0].country
            };
        }
        return null;
    } catch (error) {
        console.error('Error obteniendo coordenadas:', error);
        return null;
    }
}

// 6. FUNCIÓN COMBINADA: Clima completo por nombre de ciudad
async function getCompleteWeatherByCity(city) {
    try {
        // Primero obtener coordenadas
        const coordinates = await getCoordinates(city);
        if (!coordinates) {
            throw new Error('Ciudad no encontrada');
        }
        
        // Luego obtener datos completos del clima
        const weatherData = await getCompleteWeatherData(coordinates.lat, coordinates.lon);
        
        return {
            ubicacion: coordinates,
            clima: weatherData
        };
    } catch (error) {
        console.error('Error obteniendo clima completo:', error);
        return null;
    }
}

// Exportar todas las funciones
// export {
//     getWeatherData,           // Clima actual (tu función existente)
//     getHourlyForecast,        // Pronóstico por horas (4 días)
//     get5DayForecast,          // Pronóstico 5 días cada 3 horas
//     get16DayForecast,         // Pronóstico diario 16 días
//     getCompleteWeatherData,   // One Call API (más completa)
//     getCoordinates,           // Obtener coordenadas
//     getCompleteWeatherByCity  // Función combinada recomendada
// };



    getCompleteWeatherByCity("Pucallpa")  // Función combinada recomendada

export default getWeatherData;