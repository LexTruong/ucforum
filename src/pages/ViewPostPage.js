import yosemite from "../images/yosemite.jpg"
import "../css/viewPostPage.css"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"


export default function ViewPostPage() {
    const [postInfo, setPostInfo] = useState(null)
    const [username, setUsername] = useState("")
    const [date, setDate] = useState("")
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

    }, [])
    
    if (!postInfo) return 'Post Unavailable'

    // implement comments functionality

    return (
        <div className="singlePostContainer">
            <div className="singlePostText singlePostInfo">
                <Link to="/" className="singlePostTopic">Topic</Link>
                <h1 className="singlePostTitle">{postInfo.title}</h1>
                <p className="singlePostSummary">{postInfo.summary}</p>
                <p className="singlePostAuthor">By {username}, {postInfo.authorId.school} {postInfo.authorId.position}</p>
                <p className="singlePostDate">{date}</p>
            </div>
            
            <div className="singlePostImageContainer">
                <img src={yosemite} className="singlePostImage" alt="placeholder"></img>
                <p className="singlePostCaption">{postInfo.caption}</p>
            </div>

            <div className="singlePostText">
                <div className="singlePostContent" dangerouslySetInnerHTML={{__html: postInfo.content}}></div>
            </div>
            

            <div className="comments">
                <div className="singlePostThumbs">
                    <button className="singlePostThumbs"> ^ 500</button>
                    <button className="singlePostThumbs"> ⌄ 500</button>
                </div>
                <h2 className="singlePostCommentTitle"> # of Comments</h2>
            </div>
        </div>
    )
}