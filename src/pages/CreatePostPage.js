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
    const [files, setFiles] = useState("")

    async function createPost(e) {
        e.preventDefault()

        const data = {
            title,
            summary,
            content,
            file: files[0]
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
                <textarea wrap="hard" type="text" className="postSummary"  
                    placeholder="Summarize your article into 1-2 sentences for readers." 
                    onChange={e => setSummary(e.target.value)} />
                <div className="imageInput">
                    <label className="imageLabel" for="mainImage">Main Image </label>
                    <input type="file" className="postImage" name="mainImage"
                        onChange={e => setFiles(e.target.files)}/>
                </div>

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