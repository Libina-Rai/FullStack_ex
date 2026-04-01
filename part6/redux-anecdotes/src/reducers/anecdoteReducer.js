import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAll, createNew } from "../services/anecdotes";

// Async thunk to fetch anecdotes from backend and initialize state
export const initializeAnecdotes = createAsyncThunk(
  "anecdotes/fetchAll",
  async () => {
    const anecdotes = await getAll();
    return anecdotes; // this payload will go to extraReducers
  },
);

// Thunk to create a new anecdote
export const createAnecdote = createAsyncThunk(
  "anecdotes/createNew",
  async (content) => {
    const newAnecdote = await createNew(content);
    return newAnecdote;
  },
);

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    vote(state, action) {
      const id = action.payload;
      const anecdote = state.find((a) => a.id === id);
      if (anecdote) {
        anecdote.votes += 1;
      }
    },
  },

  //handle the thunk results in extraReducers
  extraReducers: (builder) => {
    builder
      .addCase(createAnecdote.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(initializeAnecdotes.fulfilled, (state, action) => {
        return action.payload;
      });
  },
});

export const { vote } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
