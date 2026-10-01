function UserCard({ name, age, email, onRemove }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
      <button className="btn-remove" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}

export default UserCard;
