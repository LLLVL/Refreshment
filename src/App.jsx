import { useState, useEffect } from "react";
import UserCard from "./UserCard";
import initialUsers from "./users";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupAge, setSignupAge] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  function login() {
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          alert("Logged in!");
        } else {
          alert(data.message);
        }
      });
  }

  function removeUser(id) {
    fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      if (response.ok) {
        setUsers(users.filter((user) => user._id !== id));
      } else {
        alert("You must be logged in to delete users");
      }
    });
  }

  function resetUsers() {
    setUsers(initialUsers);
  }

  function addUser() {
    if (name === "" || age === "" || email === "") {
      alert("Please fill in all fields");
      return;
    }

    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, age, email }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          alert("You must be logged in to add users");
          return null;
        }
      })
      .then((newUser) => {
        if (newUser) {
          setUsers([...users, newUser]);
          setName("");
          setAge("");
          setEmail("");
        }
      });
  }

  function signup() {
    fetch("http://localhost:3000/signup", {
      // 👈 changed
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: signupName,
        age: signupAge,
        email: signupEmail,
        password: signupPassword,
      }),
    })
      .then((response) => response.json())
      .then((newUser) => {
        setUsers([...users, newUser]);
        setSignupName("");
        setSignupAge("");
        setSignupEmail("");
        setSignupPassword("");
        alert("Account created! You can now log in.");
      });
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("token");
  }

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h3>Sign Up</h3>
        <input
          value={signupName}
          onChange={(e) => setSignupName(e.target.value)}
          placeholder="Name"
        />
        <input
          value={signupAge}
          onChange={(e) => setSignupAge(e.target.value)}
          placeholder="Age"
        />
        <input
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
          placeholder="Password"
          type="password"
        />
        <button onClick={signup}>Sign Up</button>
      </div>
      <div style={{ marginBottom: "24px" }}>
        <input
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          placeholder="Login Email"
        />
        <input
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          placeholder="Login Password"
          type="password"
        />
        <button onClick={login}>Login</button>
        {token ? (
          <span>
            {" "}
            ✅ Logged in <button onClick={logout}>Logout</button>
          </span>
        ) : (
          <span>Not logged in</span>
        )}
      </div>
      <h1>User List</h1>

      <div style={{ marginBottom: "24px" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button className="btn-add" onClick={addUser}>
          Add User
        </button>
        <button className="btn-reset" onClick={resetUsers}>
          Reset
        </button>
      </div>

      <div className="cards-container">
        {users.map((user) => (
          <UserCard
            key={user._id}
            name={user.name}
            age={user.age}
            email={user.email}
            onRemove={() => removeUser(user._id)}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
