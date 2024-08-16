import { Link, useNavigate } from "react-router-dom";
import "../css/navbar.css"
import { useEffect, useState } from "react";

export default function Navbar() {
    const navigate = useNavigate()
    const [email, setEmail] = useState(null)

    async function logout() {
        localStorage.removeItem("token")
        navigate(0)
    }

    useEffect(() => {
        fetch("http://localhost:8080/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn ? setEmail(data.email) : null)
    }, [])

    return (
        <nav>
            <div className="topics">
                <Link to="/topic/politics">Politics</Link>
                <Link to="/topic/education">Education</Link>
                <Link to="/topic/culture">Culture</Link>
            </div>
            {email
            ? <div>
                <p>{email}</p>
                <p onClick={logout}>Logout</p>
            </div>
            : <div className="signin">
                <Link to="/signin">Sign In</Link>
            </div>
            }

        </nav>
    )
}