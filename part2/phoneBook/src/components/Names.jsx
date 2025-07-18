const Names = ({ person, deleteName }) => {
  return (
    <div>
      {person.name} {person.number}{" "}
      <button onClick={() => deleteName(person.id, person.name)}>Delete</button>
    </div>
  );
};
export default Names;
