const apiKey = "581e814cda1481c5fd762284001e0516";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";

// Function to fetch and display weather data
async function fetchWeather(city, elementId) {
  const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
  if (response.ok) {
    const data = await response.json();
    const weatherInfo = `Temp: ${Math.round(data.main.temp)}°C, Humidity: ${
      data.main.humidity
    }%`;
    document.getElementById(elementId).innerText = weatherInfo;
  } else {
    document.getElementById(elementId).innerText = "Weather data not available";
  }
}

// Fetch weather for each city
fetchWeather("Denton", "denton-weather");
fetchWeather("Dallas", "dallas-weather");
fetchWeather("Austin", "austin-weather");
fetchWeather("San Antonio", "sanantonio-weather");
