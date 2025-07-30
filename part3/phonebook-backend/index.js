const express = require("express");

const app = express();
app.use(express.json());

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

// Getting all persons
app.get("/api/persons", (req, res) =>{
  res.send(persons);
});

// Getting persons information
app.get("/info", (req, res) => {
  res.send(`Phonebook has info for ${persons.length} people.<br><br> ${Date()}`);
})

// Getting a person by id
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id) 
  const person = persons.find(person=>person.id === id);
  if(!person){
    res.status(404).send(`Person with id:${id} is not found`);
  }
  res.send(person);
});

const generatedId = () => {
  const maxId = persons.length > 0 ? Math.floor(Math.random() * (200 - 5 + 1) + 5) : 0;
  return maxId + 1;
}

app.post("/api/persons", (req, res) => {
  const body = req.body;
  body.id = generatedId();
  persons = persons.concat(body);
  res.status(201).send(persons);
})

//Deleting a single person 
app.delete("/api/persons/:id",(req, res)=>{
  const id = Number(req.params.id);
  let deletedPerson = persons.filter((person) => person.id !== id);
  res.send(deletedPerson);
})

app.listen(3001, () =>{
  console.log("Server running on port 3001");
})