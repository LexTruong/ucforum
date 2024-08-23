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
    const [topic, setTopic] = useState("Politics")
    const [files, setFiles] = useState("yosemite.png")
    const [caption, setCaption] = useState("")

    async function createPost(e) {
        e.preventDefault()

        const data = new FormData()
        data.set('title', title)
        data.set('summary', summary)
        data.set('content', content)
        data.set('topic', topic)
        data.set('file', files[0])
        data.set('caption', caption)

        fetch("http://localhost:8080/post", {
            method: 'POST',
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            body: data
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data === "Post Created") {
                navigate("/")
            } else if (data === "Missing Info") {
                alert("Fill Out All Information")
            }
        })
    }

    return (
        <div className="createContainer">
            <h1 className="pageTitle">Create Article</h1>

            <form className="postInfo" onSubmit={e => createPost(e)}>
                <input type="text" className="postTitle" placeholder="Title" 
                    onChange={e => setTitle(e.target.value)} required />
                <h3 className="articleTopicLabel">Article Topic</h3>
                <select name="topic" required onChange={e => setTopic(e.target.value)}>
                    <option value="Politics">Politics</option>
                    <option value="Education">Education</option>
                    <option value="Culture">Culture</option>
                </select>
                <textarea wrap="hard" type="text" className="postSummary"  
                    placeholder="Summarize your article into 1-2 sentences for readers." 
                    onChange={e => setSummary(e.target.value)} required />
                <div className="imageInput">
                    <p className="imageLabel">Cover Image </p>
                    <input type="file" className="postImage" name="mainImage"
                        onChange={e => setFiles(e.target.files)} required />
                </div>
                <textarea wrap="hard" type="text" className="imageCaption"  
                    placeholder="Image Caption" 
                    onChange={e => setCaption(e.target.value)} required />

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
                <input type="submit" className="postButton" value='Post Article' />
            </form>
        </div>
    )
}