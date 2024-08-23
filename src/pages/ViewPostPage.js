import "../css/viewPostPage.css"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Comments from "../components/Comments/Comments"


export default function ViewPostPage() {
    const [postInfo, setPostInfo] = useState(null)
    const [username, setUsername] = useState("")
    const [date, setDate] = useState("")
    const [userId, setUserId] = useState(null)
    const {id} = useParams()

    useEffect(() => {
        fetch(`http://localhost:8080/post/${id}`)
        .then(res => res.json())
        .then(postInfo => {
            setPostInfo(postInfo)
            
            const first = postInfo.authorId.first.charAt(0).toUpperCase() + postInfo.authorId.first.slice(1)
            const last = postInfo.authorId.last.charAt(0).toUpperCase() + postInfo.authorId.last.slice(1)
            setUsername(first + " " + last)

            const date = new Date(postInfo.createdAt)
            setDate(date.toDateString())
        })

    }, [id])
    
    // fetch current user ID to see if user can edit article
    useEffect(() => {
        fetch('http://localhost:8080/isUserAuth', {
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-type": "application/json"
            },
        })
        .then(res => res.json())
        .then(data => {
            setUserId(data.userId)
        })
    }, [])

    if (!postInfo) return 'Post Unavailable'

    return (
        <div className="singlePostContainer">
            <div className="singlePostText singlePostInfo">
                <Link to={`/topic/${postInfo.topic}`} className="singlePostTopic">{postInfo.topic}</Link>
                <h1 className="singlePostTitle">{postInfo.title}</h1>
                <p className="singlePostSummary">{postInfo.summary}</p>
                <p className="singlePostAuthor">By {username}, {postInfo.authorId.school} {postInfo.authorId.position}</p>
                <p className="singlePostDate">{date}</p>
            </div>
            {postInfo.authorId._id == userId && (
                <Link to={`/edit/${id}`}> UPDATE POST</Link>
            )}
            
            <div className="singlePostImageContainer">
                <img src={`http://localhost:8080/${postInfo.file}`} className="singlePostImage" alt="placeholder"></img>
                <p className="singlePostCaption">{postInfo.caption}</p>
            </div>

            <div className="singlePostText">
                <div className="singlePostContent" dangerouslySetInnerHTML={{__html: postInfo.content}}></div>
            </div>
            
            <Comments id={id}></Comments>
        </div>
    )
}