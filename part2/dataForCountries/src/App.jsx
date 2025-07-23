import { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [searchItem, setSearchItem] = useState("");

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
      } catch (error) {
        console.error("Error fetching data:", error.data);
      }
    };
    fetchCountry();
  }, [searchItem]);

  const renderLanguage = (languages) => {
    if (Array.isArray(languages)) {
      return languages.join(",");
    } else if (typeof languages === "object") {
      return Object.values(languages).join(",");
    } else {
      return "Unknown ";
    }
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
              <li key={country.name.common}>{country.name.common}</li>
            ))}
          </ul>
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
        </div>
      )}
    </div>
  );
};

export default App;
