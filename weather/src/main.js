import { handleGeoSearch, handleWeatherSearch } from './api.js';
import { renderWeatherData, renderDailyForecast, renderHourlyForecast, findHourlyForecastIndex, renderSearchOptions, createhourlyForecastDayCards, renderHourlyDaySelection } from './ui.js';



const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');



searchButton.addEventListener('click', async (event) => {
    const query = searchInput.value.trim();
    const result = await handleGeoSearch(query);
    const weatherData = await handleWeatherSearch(result.results[0].latitude, result.results[0].longitude);
    renderWeatherData(weatherData, result);
    renderDailyForecast(weatherData);
    renderHourlyForecast(weatherData);

    renderHourlyDaySelection(weatherData);
});

document.addEventListener('keydown', async function(e) {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    const result = await handleGeoSearch(query);
    const weatherData = await handleWeatherSearch(result.results[0].latitude, result.results[0].longitude);
    renderWeatherData(weatherData, result);
    renderDailyForecast(weatherData);
    renderHourlyForecast(weatherData);

    renderHourlyDaySelection(weatherData);

  }
});

searchInput.addEventListener('input', function() {
    const query = searchInput.value.trim();
    if (query.length >= 3) {
        handleGeoSearch(query).then(result => {
            renderSearchOptions(result.results); 
        });
    } else {
        renderSearchOptions([]);
    }
});

const hourlyForecastDayButton = document.getElementById('hourly_forecast_day');
const optionsContainer = document.getElementById('hourly_forecast_day_options');
const hourlyDayTitle = document.getElementById('hourly_day_title');
const hourlyForecastDayIcon = document.getElementById('hourly_forecast_day_icon');
hourlyForecastDayButton.addEventListener('click', () => {
    optionsContainer.style.opacity = optionsContainer.style.opacity === '1' ? '0' : '1';
    optionsContainer.style.pointerEvents = optionsContainer.style.pointerEvents === 'all' ? 'none' : 'all';
    hourlyForecastDayIcon.classList.toggle('rotate-180');
})


const unitsButton = document.getElementById('units_button');
const unitsContainer = document.getElementById('units_container');
const unitsDropdown = document.getElementById('units_dropdown');
unitsButton.addEventListener('click', () => {
    unitsContainer.style.opacity = unitsContainer.style.opacity === '1' ? '0' : '1';
    unitsContainer.style.pointerEvents = unitsContainer.style.pointerEvents === 'all' ? 'none' : 'all';
    unitsDropdown.classList.toggle('rotate-180');
})
