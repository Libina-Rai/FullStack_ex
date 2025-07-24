const CountryDetails = ({ country, weather, apiError }) => {
  const renderLanguage = (languages) => {
    if (Array.isArray(languages)) return languages.join(", ");
    if (typeof languages === "object") return Object.values(languages).join(", ");
    return "Unknown";
  };

  return (
    <div>
      <h3>{country.name.common}</h3>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <p>Language(s): {country.languages && renderLanguage(country.languages)}</p>
      <p>Flag:</p>
      <img src={country.flags.png} alt={`${country.name.common}'s flag`} />

      <p>Weather Map Data</p>
      {weather ? (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Humidity: {weather.main.humidity}</p>
          <p>Wind Speed: {weather.wind.speed}</p>
          <p>Weather Description: {weather.weather[0].description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt="Weather Icon"
          />
        </div>
      ) : apiError ? (
        <p>{apiError}</p>
      ) : null}
    </div>
  );
};

export default CountryDetails;
