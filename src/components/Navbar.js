import { Link } from "react-router-dom";
import "../css/navbar.css"

export default function Navbar() {
    return (
        <nav>
            <div className="topics">
                <Link to="/topic/politics">Politics</Link>
                <Link to="/topic/education">Education</Link>
                <Link to="/topic/culture">Culture</Link>
            </div>
            <div className="signin">
                <Link to="/signin">Sign In</Link>
            </div>
        </nav>
    )
}