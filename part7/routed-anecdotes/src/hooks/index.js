import { useEffect, useState } from "react";
import anecdoteService from "../services/anecdotes";

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    anecdoteService
      .getAll()
      .then((data) => setAnecdotes(data))
      .catch((err) => setError(err));
  }, []);

  // Add a new anecdote to the server and update the local state
  const addAnecdote = async (anecdote) => {
    try {
      const createdAnecdote = await anecdoteService.createNew(anecdote);
      setAnecdotes((prevAnecdotes) => prevAnecdotes.concat(createdAnecdote));
      return createdAnecdote;
    } catch (err) {
      setError(err);
      throw err; // Re-throw the error so that the calling component can handle it as well
    }
  };

  const deleteAnecdote = async (id) => {
    try {
      await anecdoteService.remove(id);
      setAnecdotes((prevAnecdotes) =>
        prevAnecdotes.filter((anecdote) => anecdote.id !== id),
      );
    } catch (err) {
      setError(err);
      throw err; // Re-throw the error so that the calling component can handle it as well
    }
  };

  return { anecdotes, addAnecdote, error, deleteAnecdote };
};

// Custom hook for managing form fields
export const useField = (type = "text") => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue("");
  };

  return {
    inputProps: { type, value, onChange },
    reset,
  };
};
