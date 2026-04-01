import { useSelector, useDispatch } from "react-redux";
import { vote } from "../reducers/anecdoteReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state.anecdotes); // get the anecdotes from the store
  const filter = useSelector((state) => state.filter); // get the filter value from the store
  const dispatch = useDispatch();

  // filter anecdotes first
  const filteredAnecdotes = anecdotes.filter(
    (anecdote) =>
      typeof anecdote.content === "string" &&
      anecdote.content.toLowerCase().includes(filter.toLowerCase()),
  );

  // then sort the filtered anecdotes by votes in descending order
  const sortedAnecdotes = [...filteredAnecdotes].sort(
    (a, b) => b.votes - a.votes,
  );

  // function to handle voting for an anecdote
  const handleVote = (id) => {
    dispatch(vote(id));
  };

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
