export async function handleGeoSearch(query) {
    if (query.length < 3) {
        console.warn('Search query must be at least 3 characters');
        return null;
    }

    try {
        const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}`);
        const geoData = await geoResponse.json();
        console.log(geoData);
        return geoData;
        
    } catch (error) {
        console.error('Geo search failed', error);
        return null;
    }
}

export async function handleWeatherSearch(latitude, longitude) {
    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m,weather_code&current=temperature_2m,weather_code,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto&latitude=${latitude}&longitude=${longitude}`);
    const weatherData = await weatherResponse.json();
    console.log(weatherData);
    return weatherData;
}









