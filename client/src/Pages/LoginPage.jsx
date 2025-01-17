import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);

    async function login(event) {
        event.preventDefault();
        const response = await fetch("http://localhost:8080/login", {
            method: "post",
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (response.ok) {
            response.json().then( userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
            });
        }
        else {
            alert('invalid credentials');
        }
    }

    if(redirect){
        return <Navigate to="/"/>
    }

    return (
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input type="text" placeholder="username" value={username} onChange={event => setUsername(event.target.value)} required/>
            <input type="password" placeholder="password" value={password} onChange={event => setPassword(event.target.value)} required/>
            <button>Login</button>
        </form>
    );
}