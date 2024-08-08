import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext} from "pure-react-carousel";
import 'pure-react-carousel/dist/react-carousel.es.css';
import PostCard from "./PostCard";
import "../css/carousel.css"

export default function Carousel() {
    return(
        <CarouselProvider
            naturalSlideHeight={90}
            naturalSlideWidth={100}
            totalSlides={5}
            visibleSlides={3}
            infinite = {true}
            isIntrinsicHeight={true}
            className="carousel"
        >
            <Slider className="slider">
                <Slide index={0} className="slide">
                    <PostCard></PostCard>
                </Slide>
                <Slide index={1} className="slide">
                    <PostCard></PostCard>
                </Slide>
                <Slide index={2} className="slide">
                    <PostCard></PostCard>
                </Slide>
                <Slide index={3} className="slide">
                    <PostCard></PostCard>
                </Slide>
                <Slide index={4} className="slide">
                    <PostCard></PostCard>
                </Slide>
                {/* <Slide index={5} className="slide">
                    <PostCard></PostCard>
                </Slide> */}
            </Slider>
        <ButtonBack className="carouselbutton back">&#8592;</ButtonBack>
        <ButtonNext className="carouselbutton next">&#8594;</ButtonNext>
        </CarouselProvider>
    )
}