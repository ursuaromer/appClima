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


export default getWeatherData;