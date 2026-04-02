import { useQuery } from "@tanstack/react-query";
import { getAll } from "../services/anecdotes";
import { useSelector } from "react-redux";

const AnecdoteList = () => {
  // Get filter value from Redux
  const filter = useSelector((state) => state.filter);

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAll,
    retry: false, // do not retry on error, show message immediately
  });

  // Handle loading and error states
  if (result.isLoading) return <div>Loading anecdotes...</div>;
  if (result.isError)
    return <div>Anecdote service not available due to server problems</div>;

  // Get anecdotes data from query result
  const anecdotes = result.data;

  const filteredAnecdotes = anecdotes.filter(
    (a) => a.content && a.content.toLowerCase().includes(filter.toLowerCase()),
  );

  const sortedAnecdotes = [...filteredAnecdotes].sort(
    (a, b) => b.votes - a.votes,
  );

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>has {anecdote.votes} votes</div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
