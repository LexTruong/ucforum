import yosemite from "../images/yosemite.jpg"
import "../css/postCard.css"

export default function PostCard() {
    return (
        <div className="cardcontainer">
            <img src={yosemite} className="cardimage"></img>
            <h3 className="cardtitle">Post Title</h3>
            <p className="carddescription">Description Description Description Description Description Description Description Description Description Description Description Description</p>
            <p className="carddetails">By Post Author, School, Year</p>
        </div>
    )
}