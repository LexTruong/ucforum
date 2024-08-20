import "../css/postCard.css"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
 
export default function PostCard({_id, title, summary,
    authorId, createdAt, file}) {

    const [username, setUsername] = useState("")
    const [date, setDate] = useState("")

    useEffect(() => {
        const first = authorId.first.charAt(0).toUpperCase() + authorId.first.slice(1)
        const last = authorId.last.charAt(0).toUpperCase() + authorId.last.slice(1)
        setUsername(first + " " + last)

        const date = new Date(createdAt)
        setDate(date.toDateString())
    }, [authorId, createdAt])

    return (
        <div className="cardcontainer">
            <Link to={`/post/${_id}`}>
                <img src={`http://localhost:8080/${file}`} className="cardimage" alt=""></img>
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