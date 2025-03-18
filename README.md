
Weather Forecast Application
A responsive weather application built with HTML, JavaScript, and Tailwind CSS that allows users to search for weather forecasts by city name or by using their current location.
Features

Current Weather Display: Shows temperature, humidity, wind speed, and weather conditions
5-Day Forecast: Displays weather predictions for the next 5 days
Location Search: Search weather by city name
Geolocation Support: Get weather for your current location
Recent Searches: Quick access to previously searched locations
Responsive Design: Works on desktop, tablet, and mobile devices
Error Handling: Graceful handling of API errors and invalid inputs

Demo
Show Image
Setup Instructions
Prerequisites

A modern web browser (Chrome, Firefox, Safari, Edge)
An API key from OpenWeatherMap

Installation

Clone the repository
bashCopygit clone https://github.com/yourusername/weather-forecast-app.git
cd weather-forecast-app

API Key Setup

Sign up for a free API key at OpenWeatherMap
Open the index.html file in a text editor
Replace YOUR_API_KEY_HERE in the JavaScript section with your actual API key:
javascriptCopyconst API_KEY = 'your_actual_api_key_here';



Open in Browser

Double-click on index.html or open it with your preferred web browser



Usage
Search by City Name

Enter a city name in the search input
Click the "Search" button or press Enter
View the current weather and 5-day forecast for the selected city

Use Current Location

Click the "Use Current Location" button
Allow location access when prompted by your browser
View weather data for your current location

View Recent Searches

Use the dropdown menu to select from your recently searched cities
The weather data will update automatically based on your selection

Code Structure

HTML: Main structure of the application
CSS (Tailwind): Styling and responsiveness
JavaScript:

init(): Initializes the application
validateInput(): Validates user input
fetchWeatherByCity(): Retrieves weather data for a specific city
fetchWeatherByCoords(): Retrieves weather data based on coordinates
displayCurrentWeather(): Shows current weather conditions
displayForecast(): Shows 5-day forecast
Error handling and UI state management functions



Technologies Used

HTML5: Application structure
Tailwind CSS: Styling and responsive design
JavaScript: Core functionality and API integration
OpenWeatherMap API: Weather data source
Font Awesome: Weather icons

Future Improvements

Add unit conversion (Celsius/Fahrenheit)
Implement dark mode
Add weather alerts and notifications
Include hourly forecast
Add weather maps

License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

Weather data provided by OpenWeatherMap
Icons from Font Awesome
CSS framework by Tailwind CSS

