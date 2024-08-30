import { Link, useNavigate } from "react-router-dom"
import "../css/signinPage.css"
import React, { useEffect } from 'react'

export default function SignInPage() {
    const navigate = useNavigate();

    function handleLogin(e) {
        e.preventDefault()

        const form = e.target;
        const user = {
            email: form[0].value,
            password: form[1].value
        }

        fetch("http://localhost:8080/login", {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(user)
        })
        .then(res => res.json())
        .then(data => {
            if(data.message === "Invalid Email") {
                alert("Invalid Email")
                navigate(0)
            }
            else if(data.message === "Invalid Password") {
                alert("Invalid Password")
                navigate(0)
            }
            else {
                localStorage.setItem("token", data.token)
                navigate("/")
                navigate(0)
            }
        })
    }

    useEffect(() => {
        fetch("http://localhost:8080/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? navigate("/") : null)
    }, [navigate])

    return (
        <div className="signincontainer">
            <form className="signinform" onSubmit={e => handleLogin(e)}>
                <input className="input enterform" type="email" name="email"
                    placeholder="Email Address" required />
                <input className="input enterform" type="password" name="password"
                    placeholder="Password" required />
                <input className="signinbtn" type="submit" value="Sign In" ></input>
            </form>
            <Link to="/forgot">
                <p className="forgot">Forget Password?</p>
            </Link>
            <hr></hr>
            <Link to="/signup">
                <button type="button" className="createAccountbtn">Create Account</button>
            </Link>
        </div>
    )
}