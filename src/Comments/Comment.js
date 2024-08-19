export default function Comment({comment, replies, currentUserId, deleteComment}) {
    const canReply = Boolean(currentUserId)
    const canEdit = currentUserId == comment.userId
    const canDelete = currentUserId
    const createdAt = new Date(comment.createdAt).toLocaleDateString()
    return (
        <div>
            <div> 
                <div>{comment.username}</div>
                <div> {createdAt}</div>
            </div>
            <div>{comment.body}</div>
            <div>
                {canReply && <div> Reply </div>}
                {canEdit && <div> Edit </div>}
                {canDelete && <div onClick={() => deleteComment(comment.id)}> Delete </div>}
            </div>
            {replies.length > 0 && (
                <div>
                    {replies.map(reply => (
                        <Comment comment={reply} key={reply.id}
                        currentUserId = {currentUserId}
                        deleteComment = {deleteComment}
                        replies={[]}/>
                    ))}
                </div>
            )}
        </div>
    )
}