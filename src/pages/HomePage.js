import React from "react"
import Carousel from "../components/Carousel"
import "../css/homePage.css"

export default function HomePage() {
   return (
      <div>
         <h1 className="subtitle">Latest</h1>
         <Carousel></Carousel>

         <h1 className="subtitle">Top Stories</h1>
         <Carousel></Carousel>
      </div>

   )
}
