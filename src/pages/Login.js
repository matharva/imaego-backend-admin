import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import "../styles/auth.css";
import authService from "../services/authService";
import { projectFirestore, projectStorage } from "../firebase";
import { StyledFirebaseAuth } from "react-firebaseui";
import firebase from "firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(email, password);
    const data = {
      username: email,
      password: password,
    };

    const resp = await authService.loginUser(data, setError);
    if (!resp) history.push("/dashboard/talent");
    console.log(resp);
    // } catch{
    //     setError("Invalid Credentials")
    // }
    // console.log(resp);
  }

  const uiConfig = {
    signInFlow: "popup",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccessWithAuthResult: async (data) => {
        history.push("/dashboard/talent");
      },
    },
  };

  return (
    <div className="login-container">
      <div className="form-wrapper">
        <form class="login">
          <h1>Login</h1>
          <input
            type="text"
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p>{error}</p>}
          {/* <p>
                        If you don't have an account, <Link to="/signup">Signup</Link>
                    </p> */}
          <button onClick={handleSubmit}>Login</button>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
