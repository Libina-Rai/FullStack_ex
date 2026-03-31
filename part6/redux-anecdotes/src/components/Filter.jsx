import { useDispatch } from "react-redux";
import { setFilter } from "../reducers/filterReducer";

// Filter component to set the filter value in the Redux store
const Filter = () => {
  const dispatch = useDispatch();

  const handleChange = (event) => {
    dispatch(setFilter(event.target.value));
  };

  return (
    <div style={{ marginBottom: 10 }}>
      <label htmlFor="anecdote-filter">filter </label>
      <input id="anecdote-filter" onChange={handleChange} />
    </div>
  );
};

export default Filter;
