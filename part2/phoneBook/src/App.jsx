import { useState, useEffect } from "react";
import Names from "./components/Names";
import nameService from "./service/name";
import Notification from "./components/Notification";
import "./index.css";

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

const Persons = ({ filteredPerson, deleteName }) => {
  return (
    <div>
      {filteredPerson.map((person) => {
        return (
          <Names key={person.id} person={person} deleteName={deleteName} />
        );
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
  const [successMessage, setSuccessMessage] = useState("");

  const hook = () => {
    console.log("effect");
    nameService
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
    const nameExist = persons.find(
      (person) => person.name.toLowerCase() === newName.toLowerCase()
    );

    const nameObject = {
      name: newName,
      number: newNumber,
    };

    if (nameExist) {
      const confirmed = window.confirm(
        `${nameExist.name} is already added to phonebook`
      );
      if (!confirmed) {
        // if user doesn't confirm the entry to be true, do nothing
        return;
      }
      //update logic
      nameService
        .update(nameExist.id, nameObject)
        .then((updatedPerson) => {
          setPersons((prevPerson) => {
            prevPerson.id === nameExist.id ? updatedPerson : persons;
          });
          setFilteredPerson((prevFilteredPerson) => {
            prevFilteredPerson.id === nameExist.id ? updatedPerson : persons;
          });
        })
        .catch((error) => {
          console.error("Error updating the number:", error.message);
          alert("Error updating the number");
        });
    } else {
      nameService
        .create(nameObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setFilteredPerson(filteredPerson.concat(returnedPerson));
          setSuccessMessage(`${returnedPerson.name} is successfully added`);
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        })
        .catch((error) => {
          console.error("Error updating the number:", error.message);
          alert("Error updating the number");
        });
    }
    setNewName("");
    setNewNumber("");
  };

  const deleteName = (id, name) => {
    const confirmDelete = window.confirm(`Delete ${name} ?`);
    if (!confirmDelete) {
      return;
    }
    nameService
      .remove(id)
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        setFilteredPerson(filteredPerson.filter((person) => person.id !== id));
      })
      .catch((error) => {
        console.log("error deleting person:", error.message);
        alert("Error deleting person");
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
      <Notification successMessage={successMessage} />
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
      <Persons filteredPerson={filteredPerson} deleteName={deleteName} />
    </div>
  );
};

export default App;
