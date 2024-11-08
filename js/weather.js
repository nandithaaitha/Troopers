const apiKey = "581e814cda1481c5fd762284001e0516";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?&units=metric&q=";

async function fetchWeather(city, elementId) {
    try {
        // Fetch current weather
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        const data = await response.json();
        const currentWeather = `
            <strong>Current:</strong> ${data.weather[0].description}, 
            <strong>Temp:</strong> ${Math.round(data.main.temp)}°C, 
            <strong>Humidity:</strong> ${data.main.humidity}%
        `;

        // Fetch estimated weather (6 hours later)
        const forecastResponse = await fetch(forecastUrl + city + `&appid=${apiKey}`);
        const forecastData = await forecastResponse.json();
        const estimatedWeather = `
            <strong>Estimated:</strong> ${forecastData.list[1].weather[0].description}, 
            <strong>Temp:</strong> ${Math.round(forecastData.list[1].main.temp)}°C
        `;

        // Display the data in the specified element
        document.getElementById(elementId).innerHTML = `
            <p class="weather-status">${currentWeather}</p>
            <p class="weather-status">${estimatedWeather}</p>
        `;
    } catch (error) {
        document.getElementById(elementId).innerText = "Weather data not available";
    }
}

// Fetch weather for each city
fetchWeather("Denton", "denton-weather");
fetchWeather("Dallas", "dallas-weather");
fetchWeather("Austin", "austin-weather");
fetchWeather("San Antonio", "sanantonio-weather");
