import yosemite from "../images/yosemite.jpg"
import "../css/postCard.css"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
 
export default function PostCard({_id, title, summary,
    authorId, createdAt}) {

    const [username, setUsername] = useState("")
    const [date, setDate] = useState("")

    useEffect(() => {
        const first = authorId.first.charAt(0).toUpperCase() + authorId.first.slice(1)
        const last = authorId.last.charAt(0).toUpperCase() + authorId.last.slice(1)
        setUsername(first + " " + last)

        const date = new Date(createdAt)
        setDate(date.toDateString())
    })

    return (
        <div className="cardcontainer">
            <Link to={`/post/${_id}`}>
                <img src={yosemite} className="cardimage" alt=""></img>
                <h3 className="cardtitle">{title}</h3>
                <p className="carddescription">{summary}</p>
                <div className="carddetails">
                    <p className="postAuthorInfo">By {username}, {authorId.school} {authorId.position}</p>
                    <p className="postCardDate">{date}</p>
                </div>
            </Link>
        </div>
    )
}