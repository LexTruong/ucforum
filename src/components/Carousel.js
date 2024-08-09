import Carousel from "react-multi-carousel"
import PostCard from "./PostCard";
import "react-multi-carousel/lib/styles.css";
import "../css/carousel.css"

const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1440 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1440, min: 960 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 960, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  }

export default function PostCarousel() {
    return(
        <div className="carouselcontainer">
            <Carousel responsive={responsive} className="carousel" itemClass="item">
                <PostCard className="card"/>
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
            </Carousel>
        </div>
    )
}