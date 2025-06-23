import { useState } from "react";
const Header = () => {
  return <h2>Give feedback</h2>;
};

const Content = () => {
  return <h2>Statistics</h2>;
};

const Statistics = (props) => {
  return (
    <div>
      <p>good: {props.good}</p>
      <p>neutral: {props.neutral}</p>
      <p>bad: {props.bad}</p>
      <p>All: {props.good + props.neutral + props.bad}</p>
      <p>
        average:{" "}
        {(props.good - props.bad) / (props.good + props.neutral + props.bad)}
      </p>
      <p>
        positive:{" "}
        {(props.good * 100) / (props.good + props.neutral + props.bad)} %
      </p>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <Header />
      <button onClick={() => setGood(good + 1)}>Good</button>
      <button onClick={() => setNeutral(neutral + 1)}>Neutral</button>
      <button onClick={() => setBad(bad + 1)}>Bad</button>
      <Content />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

export default App;
