import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import authService from '../services/authService';
import "../styles/auth.css"


const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [number, setNumber] = useState("")
    const [name, setName] = useState("")
    const [error, setError] = useState("")
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();
        console.log(email, password);
        const data = {
            name: name,
            number: number,
          username: email,
          password: password, 
        }
        
        const resp = await authService.signupUser(data, setError)
        console.log(resp);
        history.push("/dashboard/login")
      }

    return (
        <div className="login-container">
            <div className="form-wrapper">
                <form class="login">
                    <h1>Signup</h1>
                    <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}/>
                    <input type="number" placeholder="Contact" value={number} onChange={(e) => setNumber(e.target.value)} />
                    <input type="text" placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {error && <p>{error}</p>}
                    <button onClick={handleSubmit}>Signup</button>
                </form>
            </div>
        </div>
    )
}

export default SignUp
