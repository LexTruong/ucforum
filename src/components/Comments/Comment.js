import { useEffect, useState } from "react"
import CommentForm from "./CommentForm"

export default function Comment({comment, replies, currentUserId, deleteComment, activeComment, setActiveComment, addComment, updateComment, getReplies}) {
    const canReply = Boolean(currentUserId)
    const canEdit = currentUserId === comment.authorId._id
    const canDelete = currentUserId === comment.authorId._id
    const isReplying = activeComment && 
        activeComment.type === "replying" && 
        activeComment._id === comment._id
    const isEditing = activeComment && 
        activeComment.type === "editing" && 
        activeComment._id === comment._id
        
    const [username, setUsername] = useState("")
    const [school, setSchool] = useState("")
    const [position, setPosition] = useState("")
    const [showReplies, setShowReplies] = useState(false)

    useEffect(() => {
        const first = comment.authorId.first.charAt(0).toUpperCase() + comment.authorId.first.slice(1)
        const last = comment.authorId.last.charAt(0).toUpperCase() + comment.authorId.last.slice(1)
        const school = comment.authorId.school.charAt(0).toUpperCase() + comment.authorId.school.slice(1)
        const position = comment.authorId.position.charAt(0).toUpperCase() + comment.authorId.position.slice(1)

        setUsername(first + " " + last)
        setSchool(school)
        setPosition(position)
    }, [comment])

    const handleReplies = () => {
        setShowReplies(!showReplies)
    }

    return (
        <div className="singleComment">
            <div className="commentAuthorInfo"> 
                <div className="commentUsername">{username}</div>
                <div className="commentInfo">{school} {position}</div>
            </div>
            {!isEditing && <div className="commentBody">
                {comment.body}
                </div>}
            {isEditing && (
                <CommentForm 
                submitLabel="Update"
                hasCancelButton 
                initialText={comment.body}
                handleSubmit={(text) => updateComment(text, comment._id)}
                handleCancel={() => setActiveComment(null)}
                />
            )}
            <div className="commentOptions">
                {canReply && <p>Like / Dislike</p>}
                {canReply && (
                    <div 
                    className="replyAction"
                    onClick={() => 
                    setActiveComment({_id: comment._id, type: "replying"}) }> Reply </div>)}
                {canEdit && (
                    <div 
                    className="editAction"
                    onClick={() => 
                    setActiveComment({_id: comment._id, type: "editing"}) }> Edit </div>)}
                {canDelete && (
                    <div 
                    className="deleteAction"
                    onClick={() => 
                    deleteComment(comment._id)}> Delete </div>)}
            </div>
             {isReplying && (
                <CommentForm
                    submitLabel="Reply" 
                    // pass comment._id as parentId
                    hasCancelButton
                    handleSubmit={(text) => addComment(text, comment._id)}
                    handleCancel={(() => setActiveComment(null))}
                    placeholder="Reply"
                /> 
            )}
            {replies.length > 0 && (<div>
                <button className="repliesButton" onClick={handleReplies}>↓ Replies</button>
            </div>)}
            {replies.length > 0 && showReplies && (
                <div>
                    {replies.map(reply => (
                        <Comment comment={reply} key={reply._id}
                        currentUserId = {currentUserId}
                        deleteComment = {deleteComment}
                        addComment={addComment}
                        updateComment = {updateComment}
                        parentId = {comment._id}
                        replies={getReplies(reply._id)}
                        activeComment={activeComment}
                        setActiveComment = {setActiveComment}
                        getReplies={getReplies}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}