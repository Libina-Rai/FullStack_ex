import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    if (searchItem.trim() === "") {
      setCountries([]);
      return;
    }
    const fetchCountry = async () => {
      try {
        const url = `https://restcountries.com/v3.1/name/${searchItem}`;
        const response = await axios.get(url);
        setCountries(response.data);
        setSelectedCountry(null);
        setWeather(null);

        if (response.data.length === 1) {
          const capital =
            response.data[0].capital && response.data[0].capital[0];
          fetchWeatherData(capital);
        }
      } catch (error) {
        console.error("Error fetching data:", error.data);
      }
    };
    fetchCountry();
  }, [searchItem]);

  const fetchWeatherData = async (capital) => {
    try {
      const apiKey = import.meta.env.VITE_SOME_KEY;
      const v2_5 = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`;
      const weatherResponse = await axios.get(v2_5);
      setWeather(weatherResponse.data);
      setApiError(null);
    } catch (error) {
      console.error("Error fetching weather data:", error.data);
      setWeather(null);
      setApiError("failed to fetch weather data");
    }
  };

  const renderLanguage = (languages) => {
    if (Array.isArray(languages)) {
      return languages.join(",");
    } else if (typeof languages === "object") {
      return Object.values(languages).join(",");
    } else {
      return "Unknown ";
    }
  };

  const handleCountryButton = (country) => {
    setSelectedCountry(country);
    const capital = country.capital;
    fetchWeatherData(capital);
  };
  return (
    <div>
      <h1>Country Information App</h1>
      <label>
        Search for a Country:
        <input
          type="text"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        ></input>
      </label>

      {countries.length > 10 && (
        <p>Too many countries, please make your entry more specific.</p>
      )}

      {countries.length <= 10 && countries.length > 1 && (
        <div>
          <h3>Matching Countries:</h3>
          <ul>
            {countries.map((country) => (
              <li key={country.name.common}>
                {country.name.common}{" "}
                <button onClick={() => handleCountryButton(country)}>
                  Show
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedCountry && (
        <div>
          <h3>{selectedCountry.name.common}</h3>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Area: {selectedCountry.area}</p>
          <p>
            Language(s):{" "}
            {selectedCountry.languages &&
              renderLanguage(selectedCountry.languages)}
          </p>
          <p>Flag:</p>
          {
            <img
              src={selectedCountry.flags.png}
              alt={`${selectedCountry.name.common}'s flag`}
            ></img>
          }
          <p>Weather Map Data</p>
          {weather && (
            <div>
              <h3>weather in {selectedCountry.capital[0]}</h3>
              <p>Temperature: {weather.main.temp}°C</p>
              <p>Humidity: {weather.main.humidity}</p>
              <p>Wind Speed: {weather.wind.speed} </p>
              <p>Weather Description: {weather.weather[0].description}</p>
              <p>Weather Icon: </p>
              {weather.weather[0].icon && (
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="Weather Icon"
                ></img>
              )}
            </div>
          )}

          {apiError && <p>{apiError}</p>}
        </div>
      )}

      {countries.length === 1 && (
        <div>
          <h3>{countries[0].name.common}</h3>
          <p>Capital: {countries[0].capital}</p>
          <p>Area: {countries[0].area}</p>
          <p>
            Language(s):{" "}
            {countries[0].languages && renderLanguage(countries[0].languages)}
          </p>
          <p>Flag:</p>
          {
            <img
              src={countries[0].flags.png}
              alt={`${countries[0].name.common}'s flag`}
            ></img>
          }
          <p>Weather Map Data</p>
          {weather && (
            <div>
              <h3>weather in {countries[0].capital[0]}</h3>
              <p>Temperature: {weather.main.temp}°C</p>
              <p>Humidity: {weather.main.humidity}</p>
              <p>Wind Speed: {weather.wind.speed} </p>
              <p>Weather Description: {weather.weather[0].description}</p>
              <p>Weather Icon: </p>
              {weather.weather[0].icon && (
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="Weather Icon"
                ></img>
              )}
            </div>
          )}

          {apiError && <p>{apiError}</p>}
        </div>
      )}
    </div>
  );
};

export default App;
