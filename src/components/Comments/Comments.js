import {useState, useEffect} from "react";  
import {getComments as getCommentsApi, createComment as createCommentApi, deleteComment as deleteCommentApi, updateComment as updateCommentApi} from '../../api'
import Comment from './Comment'
import CommentForm from './CommentForm'  


export default function Comments({id}) {
    const [backendComments, setBackendComments] = useState([])
    const [activeComment, setActiveComment] = useState(null)
    const [rootComments, setRootComments] = useState([])

    // get comments
    useEffect(() => {
        fetch(`http://localhost:8080/comments/${id}`)
        .then(res => res.json())
        .then(data => {
            setBackendComments(data)
            const roots = data.filter(comment => comment.parentId === null)
            setRootComments(roots)
        }) 
    }, [id])
    
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
            method: 'POST',
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => console.log(data))

        setActiveComment(null)
    }

    const deleteComment = (commentId) => {
        if(window.confirm("Are you sure delete yes?")) {
            deleteCommentApi(commentId).then(() => {
                const updateBackendComments = backendComments.filter(
                    (backendComment) => backendComment.id !== commentId)
                setBackendComments(updateBackendComments)
            })
        }
    }

    const updateComment = (text, commentId) => {
        updateCommentApi(text, commentId).then(() => {
            const updatedBackendComments = backendComments.map(backendComment => {
                if (backendComment.id === commentId) {
                    return {...backendComment, body: text}
                }
                return backendComment
            })
            setBackendComments(updatedBackendComments)
            setActiveComment(null)
        })
    }

    return (
        <div>
            <div> Write Comment</div>
            <CommentForm submitLabel="Write" handleSubmit={addComment}/>
            <div>
                {rootComments.map(rootComment => (
                    <p>{rootComment.authorId.first} - {rootComment.body}</p>
                    // <Comment 
                    // key={rootComment.id} 
                    // comment={rootComment} 
                    // replies={getReplies(rootComment.id)}
                    // currentUserId = {1}
                    // deleteComment = {deleteComment}
                    // activeComment = {activeComment}
                    // updateComment = {updateComment}
                    // setActiveComment = {setActiveComment}
                    // addComment = {addComment}
                    // />
                )
                    
                )}
            </div>
        </div>
    )
}