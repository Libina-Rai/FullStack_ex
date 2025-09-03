require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const Person = require("./models/person");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());

morgan.token("req-body", (req) =>
  req.method === "POST" ? JSON.stringify(req.body) : ""
);
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

// GET all persons
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((err) => next(err));
});

// GET phonebook info
app.get("/info", (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      res.send(
        `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`
      );
    })
    .catch((err) => next(err));
});

// GET person by ID
app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => (person ? res.json(person) : res.status(404).end()))
    .catch((err) => next(err));
});

// POST new person
app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: "name or number is missing" });
  }

  const person = new Person({ name, number });
  person
    .save()
    .then((savedPerson) => res.status(201).json(savedPerson))
    .catch((err) => next(err));
});

// DELETE person
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) =>
      result
        ? res.status(204).end()
        : res.status(404).json({ error: "Person not found" })
    )
    .catch((err) => next(err));
});

// UPDATE person's number
app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: "name or number is missing" });
  }

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) =>
      updatedPerson
        ? res.json(updatedPerson)
        : res.status(404).json({ error: "Person not found" })
    )
    .catch((err) => next(err));
});

// Serve frontend
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Unknown endpoint handler
app.use((req, res) => {
  res.status(404).json({ error: "Unknown endpoint" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).json({ error: "Malformatted id" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
