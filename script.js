const apiKey = 'ec89f4d077mshad1c51320694b52p1ddb81jsn972745f97d72';
const apiHost = 'weather-api138.p.rapidapi.com';

async function fetchWeather(city) {
    const url = `https://weather-api138.p.rapidapi.com/weather?city_name=${city}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': apiHost
        }
    };

    try {
        const response = await fetch(url, options);

        // Check if the response is valid
        if (!response.ok) {
            throw new Error('City not found');
        }

        const result = await response.json();

        // Check if the result contains weather data
        if (!result?.main || !result?.sys) {
            throw new Error('Invalid data received');
        }

        // Extracting weather data
        const kelvinTemp = result?.main?.temp;
        const minTemp = result?.main?.temp_min;
        const humidity = result?.main?.humidity;
        const visibility = result?.visibility;
        const sunrise = result?.sys?.sunrise;
        const sunset = result?.sys?.sunset;

        // Update city name and temperature
        document.getElementById('city_name').innerText = city;
        document.getElementById('max_temp').innerText = `${(kelvinTemp - 273.15).toFixed(2)} °C`;

        // Hide any previous error message
        document.getElementById('error-message').innerText = '';

        // Show or hide table with more details on button click
        document.getElementById('details_button').addEventListener('click', function () {
            const detailsTable = document.getElementById('details_table');
            if (detailsTable.classList.contains('d-none')) {
                // Show the hidden table
                detailsTable.classList.remove('d-none');

                // Update the table with weather data
                document.querySelectorAll('tbody:nth-of-type(1) tr:nth-of-type(1) td').forEach(td => td.innerText = humidity + '%');  // Humidity
                document.querySelectorAll('tbody:nth-of-type(1) tr:nth-of-type(2) td').forEach(td => td.innerText = (visibility / 1000).toFixed(2) + ' km');  // Visibility

                // Convert sunrise and sunset from UNIX timestamp to readable format
                const sunriseTime = new Date(sunrise * 1000).toLocaleTimeString();
                const sunsetTime = new Date(sunset * 1000).toLocaleTimeString();

                document.querySelectorAll('tbody:nth-of-type(2) tr:nth-of-type(1) td').forEach(td => td.innerText = sunriseTime);  // Sunrise
                document.querySelectorAll('tbody:nth-of-type(2) tr:nth-of-type(2) td').forEach(td => td.innerText = sunsetTime);  // Sunset
            } else {
                // Hide the table if it is already visible
                detailsTable.classList.add('d-none');
            }
        });
    } catch (error) {
        // Show error message for invalid search
        document.getElementById('error-message').innerText = `Error: ${error.message}`;
        document.getElementById('max_temp').innerText = ''; // Clear temperature if error
        document.getElementById('details_table').classList.add('d-none'); // Hide the details table on error
    }
}

// Handle city search
document.getElementById('city-search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const city = document.getElementById('city-input').value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        document.getElementById('error-message').innerText = 'Please enter a city name';
    }
});

// Fetch default city weather (Delhi) on page load
fetchWeather('Delhi');
