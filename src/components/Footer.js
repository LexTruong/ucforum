import { Link } from "react-router-dom";
import "../css/footer.css"
import facebook from "../images/facebook.png"
import instagram from "../images/instagram.png"
import twitter from "../images/twitter.png"

export default function Footer() {
    return (
        <footer>
            <h3>UC FORUM</h3>
            <div className="footercontent">
                <div className="footertopics">
                    <Link to="/topic/politics">Politics</Link>
                    <Link to="/topic/education">Education</Link>
                    <Link to="/topic/culture">Culture</Link>
                </div>
                <div className="info">
                    <Link to="/about">About</Link>
                    <p>Contact</p>
                    <p>email@address</p>
                </div>
                <div className="icons">
                    <a href="/"><img src={facebook} alt="facebook" className="icon"/></a>
                    <a href="/"><img src={instagram} alt="Instagram" className="icon"/></a>
                    <a href="/"><img src={twitter} alt= "Twitter" className="icon"/></a>
                </div>
            </div>
        </footer>
    )
}