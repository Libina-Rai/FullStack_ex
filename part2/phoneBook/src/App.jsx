import { useState, useEffect } from "react";
import Names from "./components/Names";
import name from "./service/name";

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
    name
      .getAll()
      .then((initialPerson) => {
        console.log("promise fulfilled");
        setPersons(initialPerson);
        setFilteredPerson(initialPerson);
      })
      .catch((error) => {
        console.error("error fetching data:", error);
      });
  };
  useEffect(hook, []);

  const addName = (event) => {
    event.preventDefault();
    const nameExist = persons.some((person) => person.name === newName);
    if (nameExist) {
      alert(`${newName} is already added to phonebook`);
      setNewName("");
      return;
    }

    const nameObject = {
      name: newName,
      number: newNumber,
    };

    name.create(nameObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setFilteredPerson(filteredPerson.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
    });
  };
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleSearchPerson = (event) => {
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
