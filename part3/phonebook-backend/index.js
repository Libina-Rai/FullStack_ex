const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


//Defining a custom token for morgan to log the request body for POST request
morgan.token("req-body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

// MiddleWare for logging with custom format
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// Getting all persons
app.get("/api/persons", (req, res) => {
  res.send(persons);
});

// Getting persons information
app.get("/info", (req, res) => {
  res.send(
    `Phonebook has info for ${persons.length} people.<br><br> ${Date()}`
  );
});

// Getting a person by id
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (!person) {
    res.status(404).send(`Person with id:${id} is not found`);
  }
  res.send(person);
});

//function to generate a random valur for each new entry
const generatedId = () => {
  const maxId =
    persons.length > 0 ? Math.floor(Math.random() * (200 - 5 + 1) + 5) : 0;
  return maxId + 1;
};

//creating a new entry from the user
app.post("/api/persons", (req, res) => {
  const body = req.body;
  body.id = generatedId();
  if (!body.name || !body.number) {
    res.status(404).json({ error: "name or number is missing" });
  }

  const existingName = persons.find((person) => person.name === body.name);
  if (existingName) {
    res.status(400).json({ error: "name must be unique" });
  }

  persons = persons.concat(body);
  res.status(201).send(persons);
});

//Deleting a single person
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  let deletedPerson = persons.filter((person) => person.id !== id);
  res.send(deletedPerson);
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
