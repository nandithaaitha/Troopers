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

    // Fetch weather forecast
    const forecastResponse = await fetch(forecastUrl + city + `&appid=${apiKey}`);
    const forecastData = await forecastResponse.json();

    // Interpolate hourly data from 3-hour intervals
    const now = new Date();
    const hourlyForecasts = [];
    let simulatedHour = new Date(now.getTime() + 60 * 60 * 1000);

    // Process next 6 hours
    for (let i = 0; i < 6; i++) {
      const startIndex = Math.floor(i / 3); // Find which 3-hour block to use
      const forecastStart = forecastData.list[startIndex];
      const forecastEnd = forecastData.list[startIndex + 1];

      // Interpolate between two 3-hour forecasts
      const startTime = new Date(forecastStart.dt * 1000);
      const endTime = new Date(forecastEnd.dt * 1000);
      const progress = (simulatedHour - startTime) / (endTime - startTime); // Progress between intervals

      // Calculate interpolated values
      const interpolatedTemp =
        Math.round(forecastStart.main.temp + (forecastEnd.main.temp - forecastStart.main.temp) * progress);
      const description = forecastStart.weather[0].description;

      hourlyForecasts.push(`
        <div class="forecast-card">
          <p><strong>${simulatedHour.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}</strong></p>
          <p>${interpolatedTemp}°C</p>
          <p>${description}</p>
        </div>
      `);

      // Increment simulated time by 1 hour
      simulatedHour = new Date(simulatedHour.getTime() + 60 * 60 * 1000);
    }

    // Estimated Weather (6 hours later)
    const estimatedWeather = `
      <strong>Estimated:</strong> ${forecastData.list[2].weather[0].description}, 
      <strong>Temp:</strong> ${Math.round(forecastData.list[2].main.temp)}°C
    `;

    // Display the data in the specified element
    document.getElementById(elementId).innerHTML = `
      <p class="weather-status">${currentWeather}</p>
      <div class="forecast-container" tabindex="0" onkeydown="scrollContent(event, this)">
        ${hourlyForecasts.join('')}
      </div>
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

function scrollContent(e, element) {
  switch (e.keyCode) {
    case 38: // Up arrow
      element.scrollTop -= 50;
      break;
    case 40: // Down arrow
      element.scrollTop += 50;
      break;
  }
}