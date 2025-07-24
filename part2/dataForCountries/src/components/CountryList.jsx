const CountryList = ({ countries, onSelect }) => {
  return (
    <div>
      <h3>Matching Countries:</h3>
      <ul>
        {countries.map((country) => (
          <li key={country.name.common}>
            {country.name.common}{" "}
            <button onClick={() => onSelect(country)}>Show</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountryList;
