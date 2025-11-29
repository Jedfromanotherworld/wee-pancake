// Project 3 Specific JavaScript - Weather Dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Weather Dashboard Project Page Loaded');
    
    // Initialize the dashboard
    initializeDashboard();
    
    // Load saved preferences
    loadSavedPreferences();
    
    // Initialize temperature chart
    initializeTemperatureChart();
});

let temperatureChart;
let isCelsius = true;
let currentWeatherData = null;

function initializeDashboard() {
    // Add event listeners
    document.getElementById('cityInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchWeather();
        }
    });
    
    // Check if geolocation is available
    if (navigator.geolocation) {
        console.log('Geolocation is supported');
    } else {
        document.querySelector('.location-btn').style.display = 'none';
    }
}

function loadSavedPreferences() {
    // Load unit preference
    const savedUnit = localStorage.getItem('temperatureUnit');
    if (savedUnit === 'fahrenheit') {
        document.getElementById('unitToggle').checked = true;
        isCelsius = false;
    }
    
    // Load last searched city
    const lastCity = localStorage.getItem('lastSearchedCity');
    if (lastCity) {
        document.getElementById('cityInput').value = lastCity;
        // searchWeather(); // Uncomment to auto-load last city
    }
}

function initializeTemperatureChart() {
    const ctx = document.getElementById('temperatureChart').getContext('2d');
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Temperature',
                data: [20, 22, 19, 23, 25, 24, 22],
                borderColor: '#64ffda',
                backgroundColor: 'rgba(100, 255, 218, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ccd6f6'
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#233554'
                    },
                    ticks: {
                        color: '#8892b0'
                    }
                },
                y: {
                    grid: {
                        color: '#233554'
                    },
                    ticks: {
                        color: '#8892b0'
                    }
                }
            }
        }
    });
}

function searchWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        showNotification('Please enter a city name', 'error');
        return;
    }
    
    showLoading();
    simulateWeatherAPI(city);
}

function getLocationWeather() {
    if (!navigator.geolocation) {
        showNotification('Geolocation is not supported by your browser', 'error');
        return;
    }
    
    showLoading();
    
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            simulateLocationWeather(latitude, longitude);
        },
        error => {
            console.error('Geolocation error:', error);
            showNotification('Unable to retrieve your location', 'error');
            hideLoading();
        }
    );
}

function simulateWeatherAPI(city) {
    // Simulate API delay
    setTimeout(() => {
        // Simulate weather data
        const weatherData = generateMockWeatherData(city);
        currentWeatherData = weatherData;
        
        updateWeatherDisplay(weatherData);
        updateForecastDisplay(weatherData.forecast);
        updateTemperatureChart(weatherData.forecast);
        
        // Save to local storage
        localStorage.setItem('lastSearchedCity', city);
        
        hideLoading();
        showNotification(`Weather data loaded for ${city}`, 'success');
    }, 1000);
}

function simulateLocationWeather(lat, lon) {
    // Simulate API delay
    setTimeout(() => {
        const city = "Your Location";
        const weatherData = generateMockWeatherData(city);
        currentWeatherData = weatherData;
        
        updateWeatherDisplay(weatherData);
        updateForecastDisplay(weatherData.forecast);
        updateTemperatureChart(weatherData.forecast);
        
        hideLoading();
        showNotification(`Weather data loaded for your location`, 'success');
    }, 1000);
}

function generateMockWeatherData(city) {
    const conditions = ['Sunny', 'Cloudy', 'Rainy', 'Snowy', 'Partly Cloudy'];
    const icons = ['☀️', '⛅', '🌧️', '❄️', '🌤️'];
    const conditionIndex = Math.floor(Math.random() * conditions.length);
    
    const baseTemp = Math.floor(Math.random() * 25) + 10;
    
    // Generate forecast
    const forecast = [];
    for (let i = 0; i < 5; i++) {
        const dayTemp = baseTemp + Math.floor(Math.random() * 8) - 4;
        const nightTemp = dayTemp - Math.floor(Math.random() * 8) - 2;
        const dayConditionIndex = Math.floor(Math.random() * conditions.length);
        
        forecast.push({
            date: new Date(Date.now() + (i * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { weekday: 'short' }),
            high: dayTemp,
            low: nightTemp,
            condition: conditions[dayConditionIndex],
            icon: icons[dayConditionIndex]
        });
    }
    
    return {
        city: city,
        temperature: baseTemp,
        condition: conditions[conditionIndex],
        icon: icons[conditionIndex],
        humidity: Math.floor(Math.random() * 50) + 30,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        pressure: Math.floor(Math.random() * 100) + 1000,
        visibility: (Math.floor(Math.random() * 20) + 5).toFixed(1),
        forecast: forecast
    };
}

function updateWeatherDisplay(data) {
    const currentWeatherDiv = document.getElementById('currentWeather');
    const temp = isCelsius ? data.temperature : celsiusToFahrenheit(data.temperature);
    const unit = isCelsius ? '°C' : '°F';
    
    currentWeatherDiv.innerHTML = `
        <div class="weather-card">
            <div class="weather-location">${data.city}</div>
            <div class="weather-icon">${data.icon}</div>
            <div class="weather-temp">${temp}${unit}</div>
            <div class="weather-condition">${data.condition}</div>
            <div class="weather-date">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
    `;
    
    // Update details
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    document.getElementById('windSpeed').textContent = `${data.windSpeed} km/h`;
    document.getElementById('pressure').textContent = `${data.pressure} hPa`;
    document.getElementById('visibility').textContent = `${data.visibility} km`;
}

function updateForecastDisplay(forecast) {
    const forecastContainer = document.getElementById('forecastContainer');
    
    let forecastHTML = '';
    forecast.forEach(day => {
        const highTemp = isCelsius ? day.high : celsiusToFahrenheit(day.high);
        const lowTemp = isCelsius ? day.low : celsiusToFahrenheit(day.low);
        const unit = isCelsius ? '°C' : '°F';
        
        forecastHTML += `
            <div class="forecast-day">
                <div class="forecast-date">${day.date}</div>
                <div class="forecast-icon">${day.icon}</div>
                <div class="forecast-temp">${highTemp}${unit}</div>
                <div class="forecast-low">${lowTemp}${unit}</div>
                <div class="forecast-condition">${day.condition}</div>
            </div>
        `;
    });
    
    forecastContainer.innerHTML = forecastHTML;
}

function updateTemperatureChart(forecast) {
    const labels = forecast.map(day => day.date);
    const temperatures = forecast.map(day => isCelsius ? day.high : celsiusToFahrenheit(day.high));
    
    temperatureChart.data.labels = labels;
    temperatureChart.data.datasets[0].data = temperatures;
    temperatureChart.update();
}

function toggleTemperatureUnit() {
    isCelsius = !document.getElementById('unitToggle').checked;
    
    // Save preference
    localStorage.setItem('temperatureUnit', isCelsius ? 'celsius' : 'fahrenheit');
    
    // Update display if we have data
    if (currentWeatherData) {
        updateWeatherDisplay(currentWeatherData);
        updateForecastDisplay(currentWeatherData.forecast);
        updateTemperatureChart(currentWeatherData.forecast);
    }
}

function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9/5) + 32);
}

function showLoading() {
    const currentWeather = document.getElementById('currentWeather');
    currentWeather.innerHTML = `
        <div class="weather-placeholder">
            <div class="loading"></div>
            <p>Loading weather data...</p>
        </div>
    `;
    
    document.querySelector('.search-btn').disabled = true;
    document.querySelector('.location-btn').disabled = true;
}

function hideLoading() {
    document.querySelector('.search-btn').disabled = false;
    document.querySelector('.location-btn').disabled = false;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `weather-notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff6b6b' : '#64ffda'};
        color: #0a192f;
        padding: 1rem 2rem;
        border-radius: 10px;
        font-weight: bold;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add parallax effect to project header
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.project-header h1');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Add hover effects to tech items
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});