import { formatDate, getWeatherIcon } from './helpers.js';
import { handleGeoSearch, handleWeatherSearch } from './api.js';

const cityNameElement = document.getElementById('city-name');
const dateElement = document.getElementById('date');
const temperatureElement = document.getElementById('temperature');

const feelsLikeElement = document.getElementById('feels-like');
const humidityElement = document.getElementById('humidity');
const precipitationElement = document.getElementById('precipitation');
const windSpeedElement = document.getElementById('wind-speed');
const weatherIconElement = document.getElementById('weather-icon');

const mainElement = document.getElementById('main');
const mainTitleElement = document.getElementById('main-title');


export async function renderWeatherData(weatherData, result) {
    if (!result?.results?.length) {
        console.error('Geo search returned no results', result);
        return;
    }

    cityNameElement.textContent = `${result.results[0].name}, ${result.results[0].country}`;
    dateElement.textContent = formatDate(weatherData.current.time, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    
    temperatureElement.textContent = `${weatherData.current.temperature_2m.toFixed(0)}°`;
    feelsLikeElement.textContent = `${weatherData.current.apparent_temperature.toFixed(0)}°`;
    humidityElement.textContent = `${weatherData.current.relative_humidity_2m}%`;
    precipitationElement.textContent = `${weatherData.current.precipitation} in`;
    windSpeedElement.textContent = `${weatherData.current.wind_speed_10m.toFixed(0)} mph`;
    weatherIconElement.src = getWeatherIcon(weatherData.current.weather_code);

    mainElement.style.display = 'flex';
    mainTitleElement.style.marginTop = '0px';

}

// Daily Forecast
const dailyForecastContaner = document.getElementById('daily_forecast_container');
let cards = '';
export function createDailyForecastCard(weatherData, index) {
    return `<div class="flex flex-col gap-3 items-center p-4 bg-neutral-0-01 rounded-lg h-41.25">
        <span class="text-lg text-neutral-0">${formatDate(weatherData.daily.time[index], { weekday: 'short' })}</span>
        <img src="${getWeatherIcon(weatherData.daily.weather_code[index])}" alt="Weather icon" class="w-15 h-15" loading="lazy">
        <div class="flex flex-row justify-between w-full">
            <span class="text-md text-neutral-0">${weatherData.daily.temperature_2m_max[index].toFixed(0)}°</span>
            <span class="text-md text-neutral-0">${weatherData.daily.temperature_2m_min[index].toFixed(0)}°</span>
        </div>
    </div>`;
}

export function renderDailyForecast(weatherData) {
    cards = '';
    dailyForecastContaner.innerHTML = '';
    for (let index = 0; index < 7; index++) {
        cards += createDailyForecastCard(weatherData, index);
    }
    dailyForecastContaner.innerHTML = cards;
}


// Hourly forecast
const hourlyForecastContainer = document.getElementById('hourly_forecast_container'); 
let hourlyCards = '';
export function createHourlyForecastCard(weatherData, i, startIndex = 0, dayIndex = 0) {
    return `<div class="flex flex-row justify-between items-center py-1 pl-2 pr-4 bg-neutral-700 border-neutral-600 border rounded-xl h-15 w-full">
        <div class="flex flex-row gap-3 justify-center items-center">
            <img src="${getWeatherIcon(weatherData.hourly.weather_code[i])}" alt="Weather icon" class="w-10 h-10" loading="lazy">
            <span class="text-md text-neutral-0">${i === startIndex && dayIndex === 0 ? 'Now' : formatDate(weatherData.hourly.time[i], { hour: 'numeric' })}</span>
        </div>
            <span class="text-sm text-neutral-0">${weatherData.hourly.temperature_2m[i].toFixed(0)}°</span>
        
    </div>`;
}

export function renderHourlyForecast(weatherData, dayIndex = 0) {
    hourlyCards = '';
    hourlyForecastContainer.innerHTML = '';
    const hourlyDayTitle = document.getElementById('hourly_day_title');
    hourlyDayTitle.textContent =  formatDate(weatherData.daily.time[0], { weekday: 'long' })
          
    

    const hourlyLength = weatherData.hourly.time.length;
    let startIndex = dayIndex === 0
        ? Math.max(findHourlyForecastIndex(weatherData) - 1, 0)
        : dayIndex * 24;
    if (startIndex < 0 || startIndex >= hourlyLength) startIndex = 0;
    const endIndex = Math.min(startIndex + 24, hourlyLength);

    

    for (let i = startIndex; i < endIndex; i++) {
        hourlyCards += createHourlyForecastCard(weatherData, i, startIndex, dayIndex);
    }
    hourlyForecastContainer.innerHTML = hourlyCards;
}

export function findHourlyForecastIndex(weatherData) {
    const currentTime = Math.floor(Date.now() / 1000) + weatherData.utc_offset_seconds;
    for (let i = 0; i < weatherData.hourly.time.length; i++) {
        const forecastTime = Math.floor(new Date(weatherData.hourly.time[i] + "Z").getTime() / 1000);
        if (forecastTime > currentTime) {
            return i;
        }
    }
    return 0;
}



// Search input handling

export function renderSearchOptions(options) {
    const searchOptionsContainer = document.getElementById('search_options_container');
    if (!options?.length) {
        searchOptionsContainer.style.opacity = '0';
        searchOptionsContainer.style.pointerEvents = 'none';
        return;
    }
    let optionsHTML = '';
    options.forEach(option => {
        optionsHTML += `<div class="m-2 px-4 py-2 rounded-lg cursor-pointer text-neutral-0 hover:bg-neutral-700" data-name="${option.name}" data-country="${option.country}"  data-lat="${option.latitude}" data-lon="${option.longitude}">${option.name}, ${option.country}</div>`;
    });
    searchOptionsContainer.innerHTML = optionsHTML;
    searchOptionsContainer.style.pointerEvents = 'all';
    searchOptionsContainer.style.opacity = '1';
    const optionElements = searchOptionsContainer.querySelectorAll('div');
    optionElements.forEach(element => {
        element.addEventListener('click', () => {
            const latitude = element.getAttribute('data-lat');
            const longitude = element.getAttribute('data-lon');
            const name = element.getAttribute('data-name');
            const country = element.getAttribute('data-country');
            searchOptionsContainer.style.opacity = '0';
            searchOptionsContainer.style.pointerEvents = 'none';
            handleWeatherSearch(latitude, longitude).then(weatherData => {
                renderWeatherData(weatherData, { results: [{ name, country }] });
                renderDailyForecast(weatherData);
                renderHourlyForecast(weatherData);
                renderHourlyDaySelection(weatherData);
            });
        });
    });
}

// Hourly forecast day selection handling
const hourlyForecastDayOptions = document.getElementById('hourly_forecast_day_options');
export function renderHourlyDaySelection(weatherData){
    let days = '';
    hourlyForecastDayOptions.innerHTML = '';
    for (let i = 0; i < 7; i++) {
        days += createhourlyForecastDayCards(weatherData, i);
    }
    hourlyForecastDayOptions.innerHTML = days;

    const buttons = hourlyForecastDayOptions.querySelectorAll('button')
    buttons.forEach(button => {
        button.addEventListener('click', () =>{
            const dayIndex = parseInt(button.getAttribute('data-day-index'))
            renderHourlyForecast(weatherData, dayIndex);
            button.parentElement.style.opacity = '0';
            button.parentElement.style.pointerEvents = 'none';
            button.classList.add('bg-neutral-600');
            button.classList.remove('hover:bg-neutral-800')
            const hourlyDayTitle = document.getElementById('hourly_day_title');
            hourlyDayTitle.textContent = dayIndex === 0 ? 'Today' : formatDate(weatherData.daily.time[dayIndex], { weekday: 'long' });
            buttons.forEach(otherButton => {
                if (otherButton !== button) {
                    otherButton.classList.remove('bg-neutral-600');
                    otherButton.classList.add('hover:bg-neutral-800');
                }
            });
        })
    })
}

export function createhourlyForecastDayCards(weatherData, i){
    const label = i === 0 
        ? `Today (${formatDate(weatherData.daily.time[i], { weekday: 'long' })})` 
        : formatDate(weatherData.daily.time[i], { weekday: 'long' });
    return `<button data-day-index="${i}" class="text-left px-2 py-1.5 rounded-lg text-neutral-0 text-sm hover:bg-neutral-800">${label}</button>`;
}


