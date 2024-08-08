import { Link } from "react-router-dom"
import Navbar from "./Navbar"
import "../css/header.css"

export default function Header() {
    return (
        <header>
            <div className="header">
                <Link to="/" className="logo">
                    <h1> UC Forum </h1>
                </Link>
                <h5 id="subtext"> Uncensored Discussion </h5>
            </div>
            <Navbar />
        </header>
    )
}
