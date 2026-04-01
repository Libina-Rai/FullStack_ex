import { useSelector, useDispatch } from 'react-redux'
import { vote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes) // get the anecdotes from the store
  const filter = useSelector(state => state.filter) // get the filter value from the store
  const dispatch = useDispatch()

  // filter anecdotes first
  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  )

  // then sort the filtered anecdotes by votes in descending order
  const sortedAnecdotes = [...filteredAnecdotes].sort(
    (a, b) => b.votes - a.votes
  )

  // function to handle voting for an anecdote
  const handleVote = (anecdote) => {
    dispatch(vote(anecdote.id))

    // set a notification for the voted anecdote
    dispatch(setNotification(`You voted '${anecdote.content}'`))

    setTimeout(() => {
      dispatch(clearNotification()) // clear the notification after 5 seconds
    }, 5000)
  }

  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
