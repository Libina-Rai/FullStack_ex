require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
const Person = require("./models/person"); // Mongoose model

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(cors());

// Morgan logging with request body for POST
morgan.token("req-body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body"
  )
);

// ===== GET all persons from MongoDB =====
app.get("/api/persons", (req, res) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((err) => {
      console.error("Error fetching persons:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});

// ===== GET phonebook info =====
app.get("/info", (req, res) => {
  Person.countDocuments({})
    .then((count) => {
      res.send(`Phonebook has info for ${count} people.<br><br>${Date()}`);
    })
    .catch((err) => {
      console.error("Error counting persons:", err.message);
      res.status(500).json({ error: "Database error" });
    });
});

// ===== Serve frontend =====
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ===== Unknown endpoint handler =====
app.use((req, res) => {
  res.status(404).send({ error: "Unknown endpoint" });
});

// ===== Error handling middleware =====
app.use((err, req, res, next) => {
  console.error(err.message);
  if (err.name === "CastError") {
    return res.status(400).send({ error: "Malformatted id" });
  }
  res.status(500).send({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
