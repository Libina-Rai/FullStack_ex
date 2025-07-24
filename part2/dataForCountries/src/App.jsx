import { useState, useEffect } from "react";
import axios from "axios";
import CountryList from "./components/CountryList";
import CountryDetails from "./components/CountryDetails";

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
          const capital = response.data[0].capital?.[0];
          if (capital) fetchWeatherData(capital);
        }
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    fetchCountry();
  }, [searchItem]);

  const fetchWeatherData = async (capital) => {
    try {
      const apiKey = import.meta.env.VITE_SOME_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`;
      const response = await axios.get(url);
      setWeather(response.data);
      setApiError(null);
    } catch (error) {
      console.error("Error fetching weather:", error);
      setWeather(null);
      setApiError("Failed to fetch weather data");
    }
  };

  const handleCountryButton = (country) => {
    setSelectedCountry(country);
    const capital = country.capital?.[0];
    if (capital) fetchWeatherData(capital);
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
        />
      </label>

      {countries.length > 10 && <p>Too many matches, be more specific.</p>}

      {countries.length > 1 && countries.length <= 10 && (
        <CountryList countries={countries} onSelect={handleCountryButton} />
      )}

      {selectedCountry && (
        <CountryDetails
          country={selectedCountry}
          weather={weather}
          apiError={apiError}
        />
      )}

      {countries.length === 1 && (
        <CountryDetails
          country={countries[0]}
          weather={weather}
          apiError={apiError}
        />
      )}
    </div>
  );
};

export default App;
