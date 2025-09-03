import { useState, useEffect } from "react";
import Names from "./components/Names";
import nameService from "./service/name";
import "./index.css";

const Filter = ({ searchPerson, handleSearchPerson }) => (
  <div>
    filter shown with:{" "}
    <input value={searchPerson} onChange={handleSearchPerson} />
  </div>
);

const PersonForm = ({
  addName,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => (
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
);

const Persons = ({ filteredPerson, deleteName }) => (
  <div>
    {filteredPerson.map((person) => (
      <Names key={person.id} person={person} deleteName={deleteName} />
    ))}
  </div>
);

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchPerson, setSearchPerson] = useState("");
  const [filteredPerson, setFilteredPerson] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    nameService
      .getAll()
      .then((initialPerson) => {
        setPersons(initialPerson);
        setFilteredPerson(initialPerson);
      })
      .catch((error) => console.error("error fetching data:", error));
  }, []);

  const addName = (event) => {
    event.preventDefault();
    const nameExist = persons.find(
      (p) => p.name.toLowerCase() === newName.toLowerCase()
    );
    const nameObject = { name: newName, number: newNumber };

    if (nameExist) {
      if (
        !window.confirm(
          `${nameExist.name} is already added, replace the old number?`
        )
      )
        return;

      nameService
        .update(nameExist.id, nameObject)
        .then((updatedPerson) => {
          setPersons(
            persons.map((p) => (p.id === nameExist.id ? updatedPerson : p))
          );
          setFilteredPerson(
            filteredPerson.map((p) =>
              p.id === nameExist.id ? updatedPerson : p
            )
          );
        })
        .catch((error) => {
          if (error.response?.status === 404) {
            setErrorMessage(
              `Information of ${nameExist.name} has been removed`
            );
            setTimeout(() => setErrorMessage(""), 4000);
            setPersons(persons.filter((p) => p.id !== nameExist.id));
            setFilteredPerson(
              filteredPerson.filter((p) => p.id !== nameExist.id)
            );
          } else {
            setErrorMessage(
              error.response?.data?.error || "Error updating number"
            );
            setTimeout(() => setErrorMessage(""), 4000);
          }
        });
    } else {
      nameService
        .create(nameObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setFilteredPerson(filteredPerson.concat(returnedPerson));
          setSuccessMessage(`${returnedPerson.name} is successfully added`);
          setTimeout(() => setSuccessMessage(""), 3000);
        })
        .catch((error) => {
          setErrorMessage(
            error.response?.data?.error || "An unexpected error occurred"
          );
          setTimeout(() => setErrorMessage(""), 4000);
        });
    }

    setNewName("");
    setNewNumber("");
  };

  const deleteName = (id, name) => {
    if (!window.confirm(`Delete ${name} ?`)) return;

    nameService
      .remove(id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== id));
        setFilteredPerson(filteredPerson.filter((p) => p.id !== id));
      })
      .catch(() => {
        setErrorMessage("Error deleting person");
        setTimeout(() => setErrorMessage(""), 4000);
      });
  };

  const handleNameChange = (e) => setNewName(e.target.value);
  const handleNumberChange = (e) => setNewNumber(e.target.value);
  const handleSearchPerson = (e) => {
    setSearchPerson(e.target.value);
    setFilteredPerson(
      persons.filter((p) =>
        p.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <div>
      <h2>Phonebook</h2>
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
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
