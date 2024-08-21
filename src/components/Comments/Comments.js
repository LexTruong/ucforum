import {useState, useEffect} from "react";  
import {getComments as getCommentsApi, createComment as createCommentApi, deleteComment as deleteCommentApi, updateComment as updateCommentApi} from '../../api'
import Comment from './Comment'
import CommentForm from './CommentForm'  


export default function Comments() {
    const [backendComments, setBackendComments] = useState([])
    const [activeComment, setActiveComment] = useState(null)
    const rootComments = backendComments.filter(backendComments => backendComments.parentId == null)
    
    const getReplies = commentId => {
        return backendComments.filter(backendComment => backendComment.parentId == commentId)
        .sort((a, b) => new Date(a.createdAt).getTime()-new Date(b.createdAt).getTime())
    }
    
    const addComment = (text, parentId) => {
        console.log('addComment', text, parentId)
        createCommentApi(text, parentId).then(comment => {
            setBackendComments([comment, ...backendComments])
            setActiveComment(null)
        })
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

    useEffect(() => {
        getCommentsApi().then(data => {
            setBackendComments(data);
        })
    }, [])

    return (
        <div>
            <h3> Comments </h3>
            <div> Write Comment</div>
            <CommentForm submitLabel="Write" handleSubmit={addComment}/>
            <div>
                {rootComments.map(rootComment =>
                    <Comment 
                    key={rootComment.id} 
                    comment={rootComment} 
                    replies={getReplies(rootComment.id)}
                    currentUserId = {1}
                    deleteComment = {deleteComment}
                    activeComment = {activeComment}
                    updateComment = {updateComment}
                    setActiveComment = {setActiveComment}
                    addComment = {addComment}
                    />
                )}
            </div>
        </div>
    )
}