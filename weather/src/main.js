import { handleGeoSearch, handleWeatherSearch } from './api.js';
import { renderWeatherData, renderDailyForecast, renderHourlyForecast, findHourlyForecastIndex, renderSearchOptions, createhourlyForecastDayCards, renderHourlyDaySelection } from './ui.js';



const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

// Units selection handling
let units = {
    temperature: "celsius",
    windSpeed: "kmh",
    precipitation: "mm",
};

let result = [];



searchButton.addEventListener('click', async (event) => {

    const query = searchInput.value.trim();
    result = await handleGeoSearch(query);
    const weatherData = await handleWeatherSearch(result.results[0].latitude, result.results[0].longitude, units);
    renderWeatherData(weatherData, result, units);
    renderDailyForecast(weatherData);
    renderHourlyForecast(weatherData);

    renderHourlyDaySelection(weatherData);
});

document.addEventListener('keydown', async function(e) {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    result = await handleGeoSearch(query);
    const weatherData = await handleWeatherSearch(result.results[0].latitude, result.results[0].longitude, units);
    renderWeatherData(weatherData, result, units);
    renderDailyForecast(weatherData);
    renderHourlyForecast(weatherData);

    renderHourlyDaySelection(weatherData);

  }
});

const searchOptionsContainer = document.getElementById('search_options_container');
searchInput.addEventListener('input', function() {
    const query = searchInput.value.trim();
    if (query.length >= 3) {
        closeOtherDropdowns([searchOptionsContainer]);
        handleGeoSearch(query).then(result => {
            renderSearchOptions(result.results, units); 
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
    closeOtherDropdowns([optionsContainer]);

    optionsContainer.style.opacity = optionsContainer.style.opacity === '1' ? '0' : '1';
    optionsContainer.style.pointerEvents = optionsContainer.style.pointerEvents === 'all' ? 'none' : 'all';
    hourlyForecastDayIcon.classList.toggle('rotate-180');
})








// fahrenheitButton.addEventListener("mouseenter", () => {
//   celsiusButton.classList.add("bg-neutral-800");
// });

// fahrenheitButton.addEventListener("mouseleave", () => {
//   celsiusButton.classList.remove("bg-neutral-800");
// });

// fahrenheitButton.addEventListener('click', async () => {
//     units.temperature = "fahrenheit";
//     fahrenheitButton.classList.add("bg-neutral-700");
//     celsiusButton.classList.remove("bg-neutral-700");
//     celsiusButton.classList.add("hover:bg-neutral-600");
//     fahrenheitButton.classList.remove("hover:bg-neutral-600");

//     const query = searchInput.value.trim();
//     const result = await handleGeoSearch(query);
//     const weatherData = await handleWeatherSearch(result.results[0].latitude, result.results[0].longitude, units);
//     renderWeatherData(weatherData, result);
//     renderDailyForecast(weatherData);
//     renderHourlyForecast(weatherData);
    
// })

// celsiusButton.addEventListener('click', () => {
//     units.temperature = "celsius";
//     celsiusButton.classList.add("bg-neutral-700");
//     fahrenheitButton.classList.remove("bg-neutral-700");
//     fahrenheitButton.classList.add("hover:bg-neutral-600");
//     celsiusButton.classList.remove("hover:bg-neutral-600");
//     const query = searchInput.value.trim();
    
// })




// const query = searchInput.value.trim();
//     const result = await handleGeoSearch(query);
//     const weatherData = await handleWeatherSearch(result.results[0].latitude, result.results[0].longitude, units);
//     renderWeatherData(weatherData, result);
//     renderDailyForecast(weatherData);
//     renderHourlyForecast(weatherData);

//     renderHourlyDaySelection(weatherData);

// Dropdown handling

// switch

const unitsButtonIcon = document.getElementById('units_button_icon');
const unitsContainer = document.getElementById('units_container');
const unitsDropdown = document.getElementById('units_dropdown');
const unitsButton = document.querySelectorAll('.units_button');
unitsButton.forEach(button => {
    setupUnitsButton(button, units);
})

unitsButtonIcon.addEventListener('click', () => {
    closeOtherDropdowns([unitsContainer]);
    unitsContainer.style.opacity = unitsContainer.style.opacity === '1' ? '0' : '1';
    unitsContainer.style.pointerEvents = unitsContainer.style.pointerEvents === 'all' ? 'none' : 'all';
    unitsDropdown.classList.toggle('rotate-180');
})

const switchButton = document.getElementById('switch_button');
const celsiusButton = document.getElementById('celsius_button');
const fahrenheitButton = document.getElementById('fahrenheit_button');
const kmhButton = document.getElementById('kmh_button');
const mphButton = document.getElementById('mph_button');
const mmButton = document.getElementById('mm_button');
const inchButton = document.getElementById('inch_button');

const switchButtonElement = document.getElementById('switch_button');
switchButtonElement.addEventListener('click', async () => {

    if(switchButtonElement.textContent === "Switch to Metric"){
        switchButtonElement.textContent = "Switch to Imperial"
        units.temperature = "fahrenheit";
        units.windSpeed = "mph";
        units.precipitation = "inch";

        unitsButton.forEach(button => {
            button.classList.remove("bg-neutral-700");
        })
        fahrenheitButton.classList.add("bg-neutral-700");
        mphButton.classList.add("bg-neutral-700");
        inchButton.classList.add("bg-neutral-700");
    } else {
        switchButtonElement.textContent = "Switch to Metric"
        units.temperature = "celsius";
        units.windSpeed = "kmh";
        units.precipitation = "mm";

        unitsButton.forEach(button => {
            button.classList.remove("bg-neutral-700");
            button.children[1].classList.add("opacity-0");
        })
        celsiusButton.classList.add("bg-neutral-700");
        kmhButton.classList.add("bg-neutral-700");
        mmButton.classList.add("bg-neutral-700");
        
    }
    unitsButton.forEach(button => {
            if(button.classList.contains("bg-neutral-700")){
                button.children[1].classList.remove("opacity-0");
                button.children[1].classList.add("opacity-100");
                button.classList.remove("hover:bg-neutral-600");
            } else {
                button.children[1].classList.remove("opacity-100");
                button.children[1].classList.add("opacity-0");
                button.classList.add("hover:bg-neutral-600");
            }
        })




    
            const query = searchInput.value.trim();
            const geoResult = await handleGeoSearch(query);
            const weatherData = await handleWeatherSearch(geoResult.results[0].latitude, geoResult.results[0].longitude, units);
            renderWeatherData(weatherData, geoResult, units);
            renderDailyForecast(weatherData);
            renderHourlyForecast(weatherData);
            console.log(units)
        

})


// units
function isDropdownOpen(element) {
    return element.style.opacity === '1' || element.classList.contains('opacity-100');
}

function closeDropdown(element, iconElement) {
    if (!isDropdownOpen(element)) return;
    element.style.opacity = '0';
    element.style.pointerEvents = 'none';
    if (iconElement) iconElement.classList.remove('rotate-180');
}

function closeOtherDropdowns(except = []) {
    const dropdowns = [
        { element: optionsContainer, icon: hourlyForecastDayIcon },
        { element: searchOptionsContainer, icon: null },
        { element: unitsContainer, icon: unitsDropdown },
    ];
    dropdowns.forEach(({ element, icon }) => {
        if (!except.includes(element)) {
            closeDropdown(element, icon);
        }
    });
}

function setupUnitsButton(button, units) {
    button.addEventListener('click', async () => {
        const typeName = button.getAttribute('data-type');
        const unitName = button.getAttribute('data-units');
        units[typeName] = unitName;

        const sameTypeButtons = document.querySelectorAll(`.units_button[data-type="${typeName}"]`);
        sameTypeButtons.forEach(btn => {
            btn.classList.remove('bg-neutral-700');
            btn.children[1].classList.remove("opacity-100");
            btn.children[1].classList.add("opacity-0");
            btn.classList.add("hover:bg-neutral-600");
        });

        button.classList.add('bg-neutral-700');
        button.classList.remove("hover:bg-neutral-600");
        button.children[1].classList.remove("opacity-0");
        button.children[1].classList.add("opacity-100");

        if (units.temperature === "fahrenheit" && units.windSpeed === "mph" && units.precipitation === "inch") {
            switchButtonElement.textContent = "Switch to Imperial";
        } else {
            switchButtonElement.textContent = "Switch to Metric";
        }

        const query = searchInput.value.trim();
        const geoResult = await handleGeoSearch(query);
        const weatherData = await handleWeatherSearch(geoResult.results[0].latitude, geoResult.results[0].longitude, units);
        renderWeatherData(weatherData, geoResult, units);
        renderDailyForecast(weatherData);
        renderHourlyForecast(weatherData);
    });
}