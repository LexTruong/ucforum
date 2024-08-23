import {useState} from 'react';   

export default function CommentForm({handleSubmit, submitLabel, hasCancelButton = false, initialText = '', handleCancel, placeholder}) {
    const [text, setText] = useState(initialText)
    const isTextareaDisabled = text.length == 0;
    const onSubmit = event => {
        event.preventDefault()
        handleSubmit(text)
        setText("")
    }
    return (
        <div>
            <form onSubmit={onSubmit} className="commentForm">
                <input className="commentsTextArea" placeholder={placeholder}
                value={text} onChange={(e) => setText(e.target.value)}/>
                <button disabled={isTextareaDisabled} className="submitComment">{submitLabel}</button>
                {hasCancelButton && (
                    <button type="button" onClick={handleCancel} >Cancel</button>
                )}
            </form>
        </div> 
    )
}