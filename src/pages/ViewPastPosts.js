import { Link } from "react-router-dom"
import PostCard from "../components/PostCard"
import "../css/viewPastPosts.css"
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react"

export default function ViewPastPosts() {
    const navigate = useNavigate()
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch("http://localhost:8080/pastposts", {
        headers: {
            "x-access-token": localStorage.getItem("token"),
            "Content-type": "application/json"
        },
    }) 
    .then(res => res.json())
    .then(posts => setPosts(posts))
    }, [])

    const deletePost = (id) => {
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

    return (
        <div className="pastPostsContainer">
            {posts.length > 0 && posts.map((post, i) => (
                <div className="pastPost" key={i}>
                    <div className="postCardContainer">
                        <PostCard {...post}/>
                    </div>
                    <div className="pastPostInfo">
                        <div className="statistics">
                            <span>Number of Likes: <b>{post.likes.length}</b></span>
                            <span>Number of Dislikes: <b>{post.dislikes.length}</b></span>
                            <span>Number of Comments: <b>{post.comments.length}</b></span>
                        </div>
                        <div className="pastPostOptions">
                            <Link to={`/edit/${post._id}`}><p className="editButton">Edit</p></Link>
                            <button className="deleteButton" onClick={() => deletePost(post._id)}>Delete</button>
                        </div>
                    </div>
                    
                </div>
              ))}
        </div>
    )
}