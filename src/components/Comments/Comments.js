import {useState, useEffect} from "react";  
import {getComments as getCommentsApi, createComment as createCommentApi, deleteComment as deleteCommentApi, updateComment as updateCommentApi} from '../../api'
import Comment from './Comment'
import CommentForm from './CommentForm'  
import { useNavigate } from "react-router-dom";
import "../../css/comments.css"

export default function Comments({id}) {
    const navigate = useNavigate()
    const [backendComments, setBackendComments] = useState([])
    const [activeComment, setActiveComment] = useState(null)
    const [rootComments, setRootComments] = useState([])
    const [userId, setUserId] = useState(null)
    const [numComments, setNumComments] = useState(0)
    
    // get comments
    useEffect(() => {
        fetch(`http://localhost:8080/comments/${id}`)
        .then(res => res.json())
        .then(data => {
            setBackendComments(data)
            const roots = data.filter(comment => comment.parentId === null)
            setRootComments(roots)
            setNumComments(data.length)
        }) 
    }, [id])
    
    // get replies for each root comment
    const getReplies = commentId => {
        return backendComments.filter(backendComment => backendComment.parentId == commentId)
        .sort((a, b) => new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime())
    }
    
    const addComment = (text, parent) => {
        const data = {
            body: text,
            parent: parent
        }

        fetch(`http://localhost:8080/addcomment/${id}`, {
            method: "POST",
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => console.log(data))

        setActiveComment(null)
        navigate(0)
    }

    // fetch current user ID and pass in as parameter to each comment
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
        })
    }, [])

    const deleteComment = (commentId) => {
        if(window.confirm("Are you sure delete yes?")) {
            deleteCommentApi(commentId).then(() => {
                const updateBackendComments = backendComments.filter(
                    (backendComment) => backendComment._id !== commentId)
                setBackendComments(updateBackendComments)
            })
        }
    }

    const updateComment = (text, commentId) => {
        updateCommentApi(text, commentId).then(() => {
            const updatedBackendComments = backendComments.map(backendComment => {
                if (backendComment._id === commentId) {
                    return {...backendComment, body: text}
                }
                return backendComment
            })
            setBackendComments(updatedBackendComments)
            setActiveComment(null)
        })
    }

    return (
        <div className="commentsContainer">
            <div className="singlePostThumbs">
                    <button className="singlePostThumbs"> ^ 500</button>
                    <button className="singlePostThumbs"> ⌄ 500</button>
                </div>
                <h2 className="singlePostCommentTitle">{numComments} Comments</h2>

            <CommentForm submitLabel="→" handleSubmit={addComment} placeholder="Leave a comment" />
            
            <div className="comments">
                {rootComments.map(rootComment => (
                    <Comment 
                    key={rootComment._id} 
                    comment={rootComment} 
                    replies={getReplies(rootComment._id)}
                    currentUserId={userId}
                    deleteComment={deleteComment}
                    activeComment={activeComment}
                    updateComment={updateComment}
                    setActiveComment={setActiveComment}
                    addComment={addComment}
                    getReplies={getReplies}
                    className="commentBranch"
                    />
                )
                    
                )}
            </div>
        </div>
    )
}