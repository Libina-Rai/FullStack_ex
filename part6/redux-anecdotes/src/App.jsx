import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from "./components/Filter";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAnecdotes } from "./reducers/anecdoteReducer";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
     dispatch(initializeAnecdotes())
      .catch((error) => {
        console.error("Failed to fetch anecdotes:", error);
      });
  }, [dispatch]);

  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm />
      <Filter />
      <Notification />
    </div>
  );
};

export default App;
