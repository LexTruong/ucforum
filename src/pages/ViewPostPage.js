import yosemite from "../images/yosemite.jpg"
import "../css/viewPostPage.css"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"


export default function ViewPostPage() {
    const [postInfo, setPostInfo] = useState(null)
    const {id} = useParams()

    useEffect(() => {
        fetch(`http://localhost:8080/post/${id}`)
        .then(res => res.json())
        .then(postInfo => setPostInfo(postInfo))
    }, [])

    if (!postInfo) return 'Post Unavailable'

    // need to add caption, category, comments, date

    return (
        <div className="singlePost">
            <h1 className="singlePostTitle">{postInfo.title}</h1>
            <p className="singlePostSummary">{postInfo.summary}</p>
            <p className="singlePostAuthor">By Amesh Abdul Jabar, UCLA Sophomore</p>
            <div className="singePostImageGroup">
                <img src={yosemite} className="singlePostImage" alt="placeholder"></img>
                <p className="singePostImageCaption"> tiny caption here </p>
            </div>
            <div className="singlePostArticle" dangerouslySetInnerHTML={{__html: postInfo.content}}></div>
            <div className="singlePostThumbs">
                <button className="singlePostThumbs"> ^ 500</button>
                <button className="singlePostThumbs"> ⌄ 500</button>
            </div>
            <h2 className="singlePostCommentTitle"> # of Comments</h2>
        </div>
    )
}