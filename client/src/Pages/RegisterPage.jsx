import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    async function register(event){
        event.preventDefault();
        let response = await fetch('http://localhost:8080/register', {
            method: 'post',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type':'application/json'},
        }); 
        if(response.status === 200){
            setRedirect(true);
            alert("Registration successful"); 
        }else{
            alert("Registration failed");
        }
        setPassword('');
        setUsername('');
    }

    if(redirect){
        return <Navigate to="/"/>
    }

    return (
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text" placeholder="username" value={username} onChange={event => setUsername(event.target.value)} required/>
            <input type="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} required/>
            <button>Register</button>
        </form>
    );
}