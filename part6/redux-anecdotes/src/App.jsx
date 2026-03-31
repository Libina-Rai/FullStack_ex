import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from "./components/Filter";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { create } from "./reducers/anecdoteReducer"; // use the existing create reducer
import { getAll } from "./services/anecdotes";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAnecdotes = async () => {
      const anecdotes = await getAll();
      anecdotes.forEach((a) => dispatch(create(a.content)));
    };
    fetchAnecdotes();
  }, [dispatch]);
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm />
      <Filter />
    </div>
  );
};

export default App;
