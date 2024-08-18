import "../css/commentsBox.css"
import {useState} from "react";

interface Comment {
    body: String;
    comment: Array<Comment>;
}

const dummyComments: Array<Comment> = [
    {
        body: 'First Comment 1',
        comment: [],
    },
    {
        body: "Second Comment 2",
        comment: [],
    },
    {
        body: "Third Comment 3",
        comment: [],
    }, 
]

export default function Comments() {
    const [comments, setComments] = useState(dummyComments);
    const [commentBody, setCommentBody] = useState('');

    const onComment = () => {
        const newComment: Comment = {
            body: commentBody,
            comment: []
        }
        setComments(prev => [newComment, ...prev])
        setCommentBody("")
    }

    return(
        <div>
            <h1> Comments </h1>
            <input 
                value = {commentBody}
                onChange={(event) => setCommentBody(event.target.value)}
                className="commentsBox" placeholder = "Leave a Comment"/>
            <button onClick={() => onComment()}>Comment</button>
            <div>
                {comments.map((comment) => (
                    <CommentItem comment = {comment}/>
                ))}
            </div>
        </div>
    )
}

interface CommentItemProps{
    comment: Comment;
}

const CommentItem = ({ comment}: CommentItemProps) => {
    const [isReplying, setIsReplying] = useState(false)


    return (
        <div className="subComments"> 
            <span> {comment.body} </span>
            {isReplying ? 
            (<button className= "cancelButton" onClick={()=> setIsReplying(false)}> Cancel </button>)
            :
            (<button onClick = {() => setIsReplying(true)}
            className="replyButton">Reply</button>)
            }
            {isReplying && (<input className="commentsBox" placeholder="Reply to Comment"/>)}
        </div>
    )
}