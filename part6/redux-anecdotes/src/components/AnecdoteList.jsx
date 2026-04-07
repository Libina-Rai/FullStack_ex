import { useQuery } from "@tanstack/react-query";
import { getAll } from "../services/anecdotes";
import { useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAnecdote } from "../services/anecdotes";
import { useNotification } from "../useNotification";

const AnecdoteList = () => {
  const [, showNotification] = useNotification();
  const queryClient = useQueryClient();

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (_data, votedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] }); // refetch updated data
      showNotification(`You voted '${votedAnecdote.content}'`, 5);
    },
    onError: (error) => {
      showNotification(`Failed to vote: ${error.message}`, 5);
    },
  });

  // Handle voting for an anecdote
  const handleVote = (anecdote) => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };

    voteMutation.mutate(updatedAnecdote);
  };
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
          <div>
            has {anecdote.votes} votes
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
