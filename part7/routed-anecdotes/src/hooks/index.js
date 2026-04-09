import { useEffect, useState } from "react";
import anecdoteService from "../services/anecdotes";

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);

  useEffect(() => {
    anecdoteService.getAll().then((data) => {
      setAnecdotes(data);
    });
  }, []);

  // Add a new anecdote to the server and update the local state
  const addAnecdote = async (anecdote) => {
    const created = await anecdoteService.createNew(anecdote);
    setAnecdotes(anecdotes.concat(created));
  };

  return { anecdotes, addAnecdote };
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
