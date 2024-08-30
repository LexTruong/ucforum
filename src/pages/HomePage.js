import React, { useEffect, useState } from "react"
import Carousel from "../components/Carousel"
import "../css/homePage.css"

export default function HomePage() {
   const [posts, setPosts] = useState([])
   const [popularPosts, setPopularPosts] = useState([])

   useEffect(() => {
      fetch("http://localhost:8080/posts")
      .then(res => res.json())
      .then(posts => setPosts(posts))
   }, [])

   useEffect(() => {
      fetch("http://localhost:8080/posts/popular")
      .then(res => res.json())
      .then(posts => setPopularPosts(posts))
   }, [])

   return (
      <div>
         <h1 className="subtitle">Latest</h1>
         <Carousel posts={posts}></Carousel>

         <h1 className="subtitle">Top Stories</h1>
         <Carousel posts={popularPosts}></Carousel>
      </div>

   )
}
