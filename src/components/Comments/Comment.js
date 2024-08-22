import CommentForm from "./CommentForm"  

export default function Comment({comment, replies, currentUserId, deleteComment, activeComment, setActiveComment, parentId = null, addComment, updateComment, getReplies}) {
    const canReply = Boolean(currentUserId)
    const canEdit = currentUserId  // === comment.userId
    const canDelete = currentUserId  // === comment.userId
    const isReplying = activeComment && 
        activeComment.type === "replying" && 
        activeComment._id === comment._id
    const isEditing = activeComment && 
        activeComment.type === "editing" && 
        activeComment._id === comment._id

    // const replyId = parentId ? parentId : comment._id
    if (!parentId) {
        parentId = comment._id
    }


    return (
        <div>
            <div> 
                <div>{comment.username}</div>
            </div>
            {!isEditing && <div>{comment.body}</div>}
            {isEditing && (
                <CommentForm 
                submitLabel="Update"
                hasCancelButton 
                initialText={comment.body}
                handleSubmit={(text) => updateComment(text, comment._id)}
                handleCancel={() => setActiveComment(null)}
                />
            )}
            <div>
                {canReply && (
                    <div 
                    onClick={() => 
                    setActiveComment({_id: comment._id, type: "replying"}) }> Reply </div>)}
                {canEdit && (
                    <div 
                    onClick={() => 
                    setActiveComment({_id: comment._id, type: "editing"}) }> Edit </div>)}
                {canDelete && (<div onClick={() => deleteComment(comment._id)}> Delete </div>)}
            </div>
             {isReplying && (
                <CommentForm
                    submitLabel="Reply" 
                    // pass comment._id as parentId
                    handleSubmit={(text) => addComment(text, comment._id)}
                /> 
            )}
            {replies.length > 0 && (
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