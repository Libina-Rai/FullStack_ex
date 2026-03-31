import { createSlice } from "@reduxjs/toolkit";

// Start with empty state; we fetch from backend
const initialState = [];

// Helper to generate unique id (used for new anecdotes)
const getId = () => (100000 * Math.random()).toFixed(0);

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState,
  reducers: {
    vote(state, action) {
      const id = action.payload;
      const anecdote = state.find((a) => a.id === id);
      if (anecdote) {
        anecdote.votes += 1;
      }
    },
    create(state, action) {
      const newAnecdote = {
        content: action.payload,
        id: getId(),
        votes: 0,
      };
      state.push(newAnecdote);
    },
    setAnecdotes(state, action) {
      return action.payload; // replace state with fetched anecdotes
    },
  },
});

export const { vote, create, setAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
