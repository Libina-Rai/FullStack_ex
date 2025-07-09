import { useState } from "react";
import Names from "./components/Names";
const App = (props) => {
  const [persons, setPersons] = useState(props.persons);
  const [newName, setNewName] = useState("");

  const addName = (event) => {
    event.preventDefault();
    console.log(event.target);
    const nameObject = {
      id: persons.length + 1,
      name: newName,
    };
    setPersons(persons.concat(nameObject));
    setNewName("");
  };
  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value);
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => {
        return <Names key={person.id} person={person} />;
      })}
    </div>
  );
};

export default App;
