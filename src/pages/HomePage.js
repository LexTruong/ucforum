import React, { useEffect, useState } from "react"
import Carousel from "../components/Carousel"
import "../css/homePage.css"

export default function HomePage() {
   // later differentiate between latest and popular posts
   const [posts, setPosts] = useState([])

   useEffect(() => {
      fetch("http://localhost:8080/posts")
      .then(res => res.json())
      .then(posts => setPosts(posts))
   }, [])

   return (
      // should check if posts list is empty

      <div>
         <h1 className="subtitle">Latest</h1>
         <Carousel posts={posts}></Carousel>

         <h1 className="subtitle">Top Stories</h1>
         <Carousel posts={posts}></Carousel>
      </div>

   )
}
