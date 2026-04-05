import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNew } from "../services/anecdotes";
import { useNotification } from "../useNotification";

const AnecdoteForm = () => {
  const [, showNotification] = useNotification();
  const queryClient = useQueryClient();

  // Set up mutation for creating a new anecdote
  const newAnecdoteMutation = useMutation({
    mutationFn: createNew,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] }); // refetch list
    },
  });

  const addAnecdote = (event) => {
    event.preventDefault();

    const content = event.target.anecdote.value;

    if (content.length < 5) {
      alert("Anecdote must be at least 5 characters long");
      return;
    }

    event.target.anecdote.value = "";
    newAnecdoteMutation.mutate(content);

    // Show notification for 5 seconds
    showNotification(`New anecdote '${content}' added`, 5);
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
