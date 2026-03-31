import ReactDOM from "react-dom/client";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import App from "./App";
import filterReducer from "./reducers/filterReducer";
import anecdoteReducer from "./reducers/anecdoteReducer";

// combine the reducers into a single reducer function
const reducer = combineReducers({
  anecdotes: anecdoteReducer,
  filter: filterReducer,
});

const store = createStore(reducer); // create the Redux store with the combined reducer

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
