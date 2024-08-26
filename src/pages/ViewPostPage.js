import "../css/viewPostPage.css"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Comments from "../components/Comments/Comments"
import { useNavigate } from 'react-router-dom';


export default function ViewPostPage() {
    const navigate = useNavigate()
    const [postInfo, setPostInfo] = useState(null)
    const [username, setUsername] = useState("")
    const [date, setDate] = useState("")
    const [userId, setUserId] = useState(null)

    const [likes, setLikes] = useState([])
    const [dislikes, setDislikes] = useState([])
    const [liked, setLiked] = useState(false)
    const [disliked, setDisliked] = useState(false)

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

            setLikes(postInfo.likes)
            setDislikes(postInfo.dislikes)
        })

    }, [id])
    
    // fetch current user ID to see if user can edit article
    // set liked and disliked
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
            if (likes) {
                setLiked(likes.includes(data.userId))
            }
            if (dislikes) {
                setDisliked(dislikes.includes(data.userId))
            }
        })
    }, [postInfo, likes, dislikes])

    const deletePost = () => {
        if(window.confirm("Are you sure delete yes?")) {
            if(window.confirm("Are you REALLY REALLY SURE?")) {
                fetch('http://localhost:8080/delete', {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({ id })
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    navigate('/')
                })
                
            }
        }
    }

    const fetchLike = (body) => {
        fetch('http://localhost:8080/like', {
            method: "PUT",
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(data => {
            if (body.type === "like") {
                if (body.action === "add") {
                    console.log("Added Like")
                } else {
                    console.log("Removed Like")
                }

                setLikes(data)
            } else {
                if (body.action === "add") {
                    console.log("Added Dislike")
                } else {
                    console.log("Removed Dislike")
                }

                setDislikes(data)
            }
        })
        .catch(e => console.log(e))
    }

    const updateLikes = () => {
        if (liked) {
            const body = {
                id,
                type: "like",
                action: "remove"
            }
            fetchLike(body)
            setLiked(false)

        } else {
            const body = {
                id,
                type: "like",
                action: "add"
            }
            fetchLike(body)
            setLiked(true)

            if (disliked) {
                const body = {
                    id,
                    type: "dislike",
                    action: "remove"
                }
                fetchLike(body)
                setDisliked(false)
            }
        }
    }

    const updateDislikes = () => {
        if (disliked) {
            const body = {
                id,
                type: "dislike",
                action: "remove"
            }
            fetchLike(body)
            setDisliked(false)
        } else {
            const body = {
                id,
                type: "dislike",
                action: "add"
            }
            fetchLike(body)
            setDisliked(true)

            if(liked) {
                const body = {
                    id,
                    type: "like",
                    action: "remove"
                }
                fetchLike(body)
                setLiked(false)
            }
        }
        
    }

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
            {postInfo.authorId._id === userId && (
                <div className="postOptions">
                    <Link to={`/edit/${id}`}>UPDATE POST</Link>
                    <button onClick={deletePost}>DELETE POST</button>
                </div>
            )} 

            <div className="singlePostImageContainer">
                <img src={`http://localhost:8080/${postInfo.file}`} className="singlePostImage" alt="placeholder"></img>
                <p className="singlePostCaption">{postInfo.caption}</p>
            </div>

            <div className="singlePostText">
                <div className="singlePostContent" dangerouslySetInnerHTML={{__html: postInfo.content}}></div>
            </div>

            <div className="likesDislikes">
                <button className="singlePostThumbs" onClick={updateLikes}> ^ {likes.length}</button>
                <button className="singlePostThumbs" onClick={updateDislikes}> ⌄ {dislikes.length}</button>
            </div>
            
            <Comments id={id}></Comments>
        </div>
    )
}