import {useState} from 'react';

export default function CommentForm({handleSubmit, submitLabel}) {
    const [text, setText] = useState("")
    const isTextareaDisabled = text.length == 0;
    const onSubmit = event => {
        event.preventDefault()
        handleSubmit(text)
        setText("")
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <textarea placeholder="Write a Comment!" 
                value={text} onChange={(e) => setText(e.target.value)}/>
                <button disabled = {isTextareaDisabled}>{submitLabel}</button>
            </form>
        </div>
    )
}