import {useState, useEffect} from "react";
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

    const updateComment = (text, commentId) => {
        const body = {
            text,
            commentId
        }

        fetch(`http://localhost:8080/updateComment/${id}`, {
            method: "POST",
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(data => console.log(data))

        setActiveComment(null)
        navigate(0)
    }

    const deleteComment = (commentId) => {
        if(window.confirm("Are you sure delete yes?")) {
            let deleteCommentIds = [commentId]

            const deleteCommentHelper = (parentId) => {
                let children = []

                for(let i = 0; i < backendComments.length; i++) {
                    if (backendComments[i].parentId == parentId) {
                        children.push(backendComments[i]._id)
                        deleteCommentIds.push(backendComments[i]._id)
                    }   
                }
                
                for(let j = 0; j < children.length; j++) {
                    deleteCommentHelper(children[j])
                }
            }

            deleteCommentHelper(commentId)

            const body = {
                deleteCommentIds
            }

            console.log(body)
            
            fetch(`http://localhost:8080/deleteComment/${id}`, {
                method: 'POST',
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(body)
            })
            
            const updatedBackendComments = backendComments.filter(
            (backendComment) => {
                for(let k = 0; k < deleteCommentIds.length; k++) {
                    if (backendComment._id === deleteCommentIds[k]) {
                        return true
                    }   
                }
                return false
            })
            setBackendComments(updatedBackendComments)

            navigate(0)
        } 
    }

    // fetch current user ID to pass in as parameter to each comment
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

    return (
        <div className="commentsContainer">
            <h2 className="singlePostCommentTitle">{numComments} Comments</h2>

            {userId
            ? <CommentForm submitLabel="Comment" handleSubmit={addComment} placeholder="Leave a comment" />
            : <h4 className="signComment">Sign In To Comment</h4>
            }
            
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