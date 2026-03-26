import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {

const anecdotes = useSelector((state) => state); //accessing the state from the store
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes);
  const dispatch = useDispatch(); //dispatching actions to the store

  //handling the voting of an anecdote
  const vote = (id) => {
    dispatch(voteAnecdote(id));
  };

  return (
    <div>
      <h2>Anecdotes</h2>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AnecdoteList
