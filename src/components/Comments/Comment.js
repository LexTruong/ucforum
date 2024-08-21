import CommentForm from "./CommentForm"  

export default function Comment({comment, replies, currentUserId, deleteComment, activeComment, setActiveComment, parentId = null, addComment, updateComment}) {
    const canReply = Boolean(currentUserId)
    const canEdit = currentUserId //=== comment.userId
    const canDelete = currentUserId //=== comment.userId
    const createdAt = new Date(comment.createdAt).toLocaleDateString()
    const isReplying = activeComment && 
        activeComment.type === "replying" && 
        activeComment.id === comment.id
    const isEditing = activeComment && 
        activeComment.type === "editing" && 
        activeComment.id === comment.id
    const replyId = parentId ? parentId : comment.id

    return (
        <div>
            <div> 
                <div>{comment.username}</div>
                <div> {createdAt}</div>
            </div>
            {!isEditing && <div>{comment.body}</div>}
            {isEditing && (
                <CommentForm 
                submitLabel="Update"
                hasCancelButton 
                initialText={comment.body}
                handleSubmit={(text) => updateComment(text, comment.id)}
                handleCancel={() => setActiveComment(null)}
                />
            )}
            <div>
                {canReply && (
                    <div 
                    onClick={() => 
                    setActiveComment({id: comment.id, type: "replying"}) }> Reply </div>)}
                {canEdit && (
                    <div 
                    onClick={() => 
                    setActiveComment({id: comment.id, type: "editing"}) }> Edit </div>)}
                {canDelete && (<div onClick={() => deleteComment(comment.id)}> Delete </div>)}
            </div>
             {isReplying && (
                <CommentForm
                    submitLabel="Reply" 
                    handleSubmit={(text) => addComment(text, replyId)}
                /> 
            )}
            {replies.length > 0 && (
                <div>
                    {replies.map(reply => (
                        <Comment comment={reply} key={reply.id}
                        currentUserId = {currentUserId}
                        deleteComment = {deleteComment}
                        addComment={addComment}
                        updateComment = {updateComment}
                        parentId = {comment.id}
                        replies={[]}
                        activeComment={activeComment}
                        setActiveComment = {setActiveComment}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}