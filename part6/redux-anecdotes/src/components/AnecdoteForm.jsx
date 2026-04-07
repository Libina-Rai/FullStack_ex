import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNew } from "../services/anecdotes";
import { useNotification } from "../useNotification";

const AnecdoteForm = () => {
  const [, showNotification] = useNotification();
  const queryClient = useQueryClient();

  // Set up mutation for creating a new anecdote
  const newAnecdoteMutation = useMutation({
    mutationFn: createNew,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] }); // refetch list
      showNotification(`New anecdote '${data.content}' added`, 5);
    },
    onError: (error) => {
      showNotification(`Failed to add anecdote: ${error.message}`, 5);
    },
  });

  const addAnecdote = (event) => {
    event.preventDefault();

    const content = event.target.anecdote.value.trim();
    // Client-side validation
    if (content.length < 5) {
      showNotification("Anecdote must be at least 5 characters long", 5);
      return; // stop the mutation
    }
    event.target.anecdote.value = "";

    // trigger the mutation to create a new anecdote
    newAnecdoteMutation.mutate(content);
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
