import { Link, useNavigate } from "react-router-dom";
import "../css/navbar.css"
import { useEffect, useState } from "react";
import hamburger from '../images/hamburger.png'

export default function Navbar() {
    const navigate = useNavigate()
    const [first, setFirst] = useState(null)
    const [last, setLast] = useState(null)

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
        .then(data => {
            if (data.isLoggedIn) {
                setFirst(data.first.charAt(0).toUpperCase() + data.first.slice(1))
                setLast(data.last.charAt(0).toUpperCase() + data.last.slice(1))
            } 
    })}, [])

    function toggleDropdown() {
        document.getElementsByClassName("dropdownContent")[0].classList.toggle("show")
    }

    window.onclick = function(event) {
        if (!event.target.matches('.buttonIcon')) {
            var dropdowns = document.getElementsByClassName("dropdownContent");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
      }
    

    return (
        <nav>
            <div className="topics">
                <Link to="/topic/politics">Politics</Link>
                <Link to="/topic/education">Education</Link>
                <Link to="/topic/culture">Culture</Link>
            </div>
            {first
            ? <div className="accountMenu">
                <p className="accountName">{first} {last}</p>
                <div className="dropdownMenu">
                    <img onClick={toggleDropdown} className="buttonIcon"src={hamburger}/>
                    <div className="dropdownContent">
                        <Link to="/create">Write Article</Link>
                        <Link to="/">View Past Posts</Link>
                        <Link to="/">Manage Account</Link>
                        <a href="/" onClick={logout}>Logout</a>
                    </div>
                </div>

            </div>
            : <div className="signin">
                <Link to="/signin">Sign In</Link>
            </div>
            }

        </nav>
    )
}