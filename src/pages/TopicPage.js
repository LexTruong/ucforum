import React, { useEffect, useState } from "react"
import Carousel from "../components/Carousel"
import "../css/homePage.css"
import { useParams } from "react-router-dom"

export default function TopicPage() {
   const {name} = useParams()
   const [posts, setPosts] = useState([])
   const [popularPosts, setPopularPosts] = useState([])

   useEffect(() => {
      fetch(`http://localhost:8080/topic/${name}`)
      .then(res => res.json())
      .then(posts => setPosts(posts))
   }, [name])

   useEffect(() => {
      fetch(`http://localhost:8080/topic/popular/${name}`)
      .then(res => res.json())
      .then(posts => setPopularPosts(posts))
   }, [name])

   const topic = name.charAt(0).toUpperCase() + name.slice(1)

   return (
      <div>
        <h1 className="topictitle">{topic}</h1>

         <h1 className="subtitle">Latest</h1>
         <Carousel posts={posts}></Carousel>

         <h1 className="subtitle">Top Stories</h1>
         <Carousel posts={popularPosts}></Carousel>
      </div>
   )
}