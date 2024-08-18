import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import "../css/createPostPage.css"
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePostPage() {
    const navigate = useNavigate();

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline','strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image'],
            ['clean']
        ]
    }
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    const [title, setTitle] = useState("")
    const [summary, setSummary] = useState("")
    const [content, setContent] = useState("")
    const [topic, setTopic] = useState("temp")
    const [files, setFiles] = useState("")
    const [caption, setCaption] = useState("")

    async function createPost(e) {
        e.preventDefault()

        const form = e.target;
        
        const data = {
            title,
            summary,
            content,
            topic: form[1].value,
            file: files[0],
            caption
        }

        fetch("http://localhost:8080/post", {
            method: 'POST',
            headers: {
                "x-access-token": localStorage.getItem("token"),
                "Content-type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            navigate("/")
        })

    }

    return (
        <div className="createContainer">
            <h1 className="pageTitle">Create Article</h1>

            <form className="postInfo" onSubmit={e => createPost(e)}>
                <input type="text" className="postTitle" placeholder="Title" 
                    onChange={e => setTitle(e.target.value)} />
                <h3 className="articleTopicLabel">Article Topic</h3>
                <select name="topic" required >
                        <option value="Politics">Politics</option>
                        <option value="Education">Education</option>
                        <option value="Culture">Culture</option>
                    </select>
                <textarea wrap="hard" type="text" className="postSummary"  
                    placeholder="Summarize your article into 1-2 sentences for readers." 
                    onChange={e => setSummary(e.target.value)} />
                <div className="imageInput">
                    <p className="imageLabel">Cover Image </p>
                    <input type="file" className="postImage" name="mainImage"
                        onChange={e => setFiles(e.target.files)}/>
                </div>
                <textarea wrap="hard" type="text" className="imageCaption"  
                    placeholder="Image Caption" 
                    onChange={e => setCaption(e.target.value)} />

                <div className="editorContainer">
                <h3 className="articleTextLabel">Article Text</h3>
                <ReactQuill
                    className="editor"
                    theme="snow" 
                    modules={modules}
                    formats={formats}
                    onChange={setContent}
                />
            </div>
            <input type="submit" className="postButton" value='Post Article'/>
            </form>

        </div>
    )
}