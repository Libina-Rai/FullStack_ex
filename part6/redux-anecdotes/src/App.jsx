import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from "./components/Filter";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAnecdotes } from "./reducers/anecdoteReducer";
import { getAll } from "./services/anecdotes";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    getAll().then((anecdotes) => {
      dispatch(setAnecdotes(anecdotes)); // replace state with backend data
    });
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
