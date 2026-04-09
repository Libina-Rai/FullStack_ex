import { useEffect, useState } from "react";
import anecdoteService from "../services/anecdotes";

export const useAnecdotes = () => {
  const [anecdotes, setAnecdotes] = useState([]);

  useEffect(() => {
    anecdoteService.getAll().then((data) => {
      setAnecdotes(data);
    });
  }, []);

  return anecdotes;
};

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
