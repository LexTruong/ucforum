import PostCard from "../components/PostCard"
import "../css/viewPastPosts.css"
import React, { useEffect, useState } from "react"

export default function ViewPastPosts() {
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

    return (
        <div className="pastPostsContainer">
            {posts.length > 0 && posts.map((post, i) => (
                <div className="pastPost">
                    <div className="postCardContainer">
                        <PostCard {...post} key={i} />
                    </div>
                    <div className="pastPostOptions">
                        <p className="editButton">Edit</p>
                        <p className="deleteButton">Delete</p>
                    </div>
                </div>
              ))}
        </div>
    )
}