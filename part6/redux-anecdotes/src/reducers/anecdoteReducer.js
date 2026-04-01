import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAll } from "../services/anecdotes";

// Async thunk to fetch anecdotes from backend and initialize state
export const initializeAnecdotes = createAsyncThunk(
  "anecdotes/fetchAll",
  async () => {
    const anecdotes = await getAll();
    return anecdotes; // this payload will go to extraReducers
  },
);

// Start with empty state; we fetch from backend
const initialState = [];

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
      state.push(action.payload);
    },
  },
  
  //handle the thunk results in extraReducers
  extraReducers: (builder) => {
    builder.addCase(initializeAnecdotes.fulfilled, (state, action) => {
      return action.payload; // replace state with backend data
    });
  },
});

export const { vote, create } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
