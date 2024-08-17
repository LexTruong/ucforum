import yosemite from "../images/yosemite.jpg"
import "../css/postCard.css"
import { Link } from "react-router-dom"
 
export default function PostCard({_id, title, summary}) {

    return (
        <div className="cardcontainer">
            <Link to={`/post/${_id}`}>
                <img src={yosemite} className="cardimage" alt=""></img>
                <h3 className="cardtitle">{title}</h3>
                <p className="carddescription">{summary}</p>
                <p className="carddetails">By Post Author, School, Year</p>
            </Link>
        </div>
    )
}