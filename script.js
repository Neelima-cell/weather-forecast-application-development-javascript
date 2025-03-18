// Weather Forecast Application

// Global variables
const API_KEY = '27b48cedc881661369e685d26e15bc89'; // Replace with actual API key
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const MAX_RECENT_SEARCHES = 5;

// DOM elements
const cityInput = document.getElementById('cityInput');
const searchButton = document.getElementById('searchButton');
const useLocationButton = document.getElementById('useLocation');
const recentCitiesSelect = document.getElementById('recentCities');
const weatherDisplay = document.getElementById('weatherDisplay');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const errorMessage = document.getElementById('errorMessage');
const searchError = document.getElementById('searchError');

// Weather icons mapping
const weatherIcons = {
    'clear sky': '<i class="fas fa-sun text-yellow-400"></i>',
    'few clouds': '<i class="fas fa-cloud-sun text-gray-300"></i>',
    'scattered clouds': '<i class="fas fa-cloud text-gray-400"></i>',
    'broken clouds': '<i class="fas fa-cloud text-gray-500"></i>',
    'shower rain': '<i class="fas fa-cloud-showers-heavy text-blue-400"></i>',
    'rain': '<i class="fas fa-cloud-rain text-blue-500"></i>',
    'thunderstorm': '<i class="fas fa-bolt text-yellow-500"></i>',
    'snow': '<i class="fas fa-snowflake text-blue-200"></i>',
    'mist': '<i class="fas fa-smog text-gray-400"></i>',
    'default': '<i class="fas fa-cloud text-gray-400"></i>'
};

/**
 * Initialize application
 * Set up event listeners and load recent searches
 */
function init() {
    // Load recent searches from local storage
    loadRecentSearches();
    
    // Event listeners
    searchButton.addEventListener('click', handleSearch);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    useLocationButton.addEventListener('click', handleGeolocation);
    recentCitiesSelect.addEventListener('change', handleRecentCitySelection);

    // Validate initial input
    cityInput.addEventListener('input', validateInput);
}

/**
 * Validate user input
 * @returns {boolean} - True if input is valid, false otherwise
 */
function validateInput() {
    const inputValue = cityInput.value.trim();
    if (inputValue === '') {
        searchError.textContent = 'Please enter a city name';
        searchError.classList.remove('hidden');
        return false;
    } else if (!/^[a-zA-Z\s-]+$/.test(inputValue)) {
        searchError.textContent = 'Please enter a valid city name';
        searchError.classList.remove('hidden');
        return false;
    } else {
        searchError.classList.add('hidden');
        return true;
    }
}

/**
 * Handle search button click
 * Validates input and fetches weather data
 */
function handleSearch() {
    if (!validateInput()) return;
    
    const city = cityInput.value.trim();
    if (city) {
        showLoading();
        fetchWeatherByCity(city);
    }
}

/**
 * Handle geolocation button click
 * Gets user's current location and fetches weather data
 */
function handleGeolocation() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByCoords(lat, lon);
            },
            (error) => {
                hideLoading();
                showError("Unable to retrieve your location. Please try searching by city name.");
            }
        );
    } else {
        showError("Geolocation is not supported by your browser. Please try searching by city name.");
    }
}

/**
 * Handle recent city selection
 * Fetches weather data for the selected city
 */
function handleRecentCitySelection() {
    const selectedCity = recentCitiesSelect.value;
    if (selectedCity) {
        showLoading();
        fetchWeatherByCity(selectedCity);
    }
}

/**
 * Fetch weather data by city name
 * @param {string} city - The city name to fetch weather data for
 */
async function fetchWeatherByCity(city) {
    try {
        // Fetch current weather
        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Hyderabad&units=metric&appid=27b48cedc881661369e685d26e15bc89`);
        
        if (!currentResponse.ok) {
            throw new Error('City not found. Please try another location.');
        }
        
        const currentData = await currentResponse.json();
        
        // Fetch 5-day forecast
        const forecastResponse = await fetch(`${WEATHER_API_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`);
        const forecastData = await forecastResponse.json();
        
        // Process and display the data
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        
        // Add to recent searches
        addToRecentSearches(city);
        
        hideLoading();
        showWeatherDisplay();
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

/**
 * Fetch weather data by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 */
async function fetchWeatherByCoords(lat, lon) {
    try {
        // Fetch current weather
        const currentResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=17.3850&lon=78.4867&units=metric&appid=27b48cedc881661369e685d26e15bc89`);

        const currentData = await currentResponse.json();
        
        // Fetch 5-day forecast
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=17.3850&lon=78.4867&units=metric&appid=27b48cedc881661369e685d26e15bc89`);

        const forecastData = await forecastResponse.json();
        
        // Process and display the data
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        
        // Add to recent searches
        addToRecentSearches(currentData.name);
        
        hideLoading();
        showWeatherDisplay();
    } catch (error) {
        hideLoading();
        showError("Failed to fetch weather data. Please try again later.");
    }
}

/**
 * Display current weather
 * @param {Object} data - Current weather data
 */
function displayCurrentWeather(data) {
    const cityNameElement = document.getElementById('cityName');
    const currentDateElement = document.getElementById('currentDate');
    const currentTempElement = document.getElementById('currentTemp');
    const currentDescriptionElement = document.getElementById('currentDescription');
    const currentHumidityElement = document.getElementById('currentHumidity');
    const currentWindElement = document.getElementById('currentWind');
    const currentIconElement = document.getElementById('currentIcon');
    
    // Format date
    const currentDate = new Date();
    const dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    
    // Update DOM elements
    cityNameElement.textContent = data.name;
    currentDateElement.textContent = currentDate.toLocaleDateString('en-US', dateOptions);
    currentTempElement.textContent = `${Math.round(data.main.temp)}°C`;
    currentDescriptionElement.textContent = data.weather[0].description;
    currentHumidityElement.textContent = `Humidity: ${data.main.humidity}%`;
    currentWindElement.textContent = `Wind: ${Math.round(data.wind.speed)} m/s`;
    
    // Set weather icon
    const weatherDescription = data.weather[0].description.toLowerCase();
    currentIconElement.innerHTML = getWeatherIcon(weatherDescription);
}

/**
 * Display 5-day forecast
 * @param {Object} data - Forecast data
 */
function displayForecast(data) {
    const forecastElement = document.getElementById('forecast');
    forecastElement.innerHTML = '';
    
    // Get one forecast per day (noon)
    const dailyForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    
    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateFormatted = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        
        const forecastCard = document.createElement('div');
        forecastCard.className = 'weather-card bg-gray-700 text-white p-4 rounded-lg shadow-lg';
        
        forecastCard.innerHTML = `
            <div class="text-center">
                <h3 class="font-semibold">${dateFormatted}</h3>
                <div class="text-3xl my-2">${getWeatherIcon(forecast.weather[0].description.toLowerCase())}</div>
                <p class="text-xl font-bold">${Math.round(forecast.main.temp)}°C</p>
                <p class="text-sm">Wind: ${Math.round(forecast.wind.speed)} m/s</p>
                <p class="text-sm">Humidity: ${forecast.main.humidity}%</p>
            </div>
        `;
        
        forecastElement.appendChild(forecastCard);
    });
}

/**
 * Get weather icon based on description
 * @param {string} description - Weather description
 * @returns {string} - HTML for the appropriate weather icon
 */
function getWeatherIcon(description) {
    for (const [key, value] of Object.entries(weatherIcons)) {
        if (description.includes(key)) {
            return value;
        }
    }
    return weatherIcons.default;
}

/**
 * Add a city to recent searches
 * @param {string} city - City name to add
 */
function addToRecentSearches(city) {
    // Load existing recent searches
    let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    // Remove if already exists
    recentSearches = recentSearches.filter(item => item.toLowerCase() !== city.toLowerCase());
    
    // Add to the beginning
    recentSearches.unshift(city);
    
    // Keep only the latest MAX_RECENT_SEARCHES
    if (recentSearches.length > MAX_RECENT_SEARCHES) {
        recentSearches = recentSearches.slice(0, MAX_RECENT_SEARCHES);
    }
    
    // Save back to local storage
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    
    // Update the dropdown
    loadRecentSearches();
}

/**
 * Load recent searches from local storage
 */
function loadRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    
    // Clear existing options (except first one)
    while (recentCitiesSelect.options.length > 1) {
        recentCitiesSelect.remove(1);
    }
    
    // Add recent searches to dropdown
    recentSearches.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        recentCitiesSelect.appendChild(option);
    });
}

/**
 * Show loading state
 */
function showLoading() {
    weatherDisplay.classList.add('hidden');
    errorState.classList.add('hidden');
    loadingState.classList.remove('hidden');
}

/**
 * Hide loading state
 */
function hideLoading() {
    loadingState.classList.add('hidden');
}

/**
 * Show weather display
 */
function showWeatherDisplay() {
    weatherDisplay.classList.remove('hidden');
    errorState.classList.add('hidden');
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    errorMessage.textContent = message;
    errorState.classList.remove('hidden');
    weatherDisplay.classList.add('hidden');
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);