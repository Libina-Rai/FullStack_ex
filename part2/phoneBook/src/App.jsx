import { useState, useEffect } from "react";
import axios from "axios";
import Names from "./components/Names";

const Filter = ({ searchPerson, handleSearchPerson }) => {
  return (
    <div>
      filter shown with:{" "}
      <input value={searchPerson} onChange={handleSearchPerson} />
    </div>
  );
};

const PersonForm = ({
  addName,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <div>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  );
};

const Persons = ({ filteredPerson }) => {
  return (
    <div>
      {filteredPerson.map((person) => {
        return <Names key={person.id} person={person} />;
      })}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchPerson, setSearchPerson] = useState("");
  const [filteredPerson, setFilteredPerson] = useState([]);

  const hook = () => {
    console.log("effect");
    axios
      .get("http://localhost:3001/persons")
      .then((response) => {
        console.log("promise fulfilled");
        setPersons(response.data);
        setFilteredPerson(response.data);
      })
      .catch((error) => {
        console.error("error fetching data:", error);
      });
  };
  useEffect(hook, []);

  const addName = (event) => {
    event.preventDefault();
    console.log(event.target);

    const nameExist = persons.some((person) => person.name === newName);
    if (nameExist) {
      alert(`${newName} is already added to phonebook`);
      setNewName("");
      return;
    }

    const nameObject = {
      id: persons.length + 1,
      name: newName,
      number: newNumber,
    };
    setPersons(persons.concat(nameObject));
    setFilteredPerson(filteredPerson.concat(nameObject));
    setNewName("");
    setNewNumber("");
  };
  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value);
  };
  const handleSearchPerson = (event) => {
    console.log(event.target.value);
    setSearchPerson(event.target.value);
    const filterItems = persons.filter((person) =>
      person.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredPerson(filterItems);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter
        searchPerson={searchPerson}
        handleSearchPerson={handleSearchPerson}
      />
      <h3>Add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons filteredPerson={filteredPerson} />
    </div>
  );
};

export default App;
