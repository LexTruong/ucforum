import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import "../css/createPostPage.css"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useNavigate } from 'react-router-dom';


export default function EditPostPage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("")
    const [summary, setSummary] = useState("")
    const [content, setContent] = useState("")
    const [topic, setTopic] = useState("Politics")
    const [files, setFiles] = useState("yosemite.png")
    const [caption, setCaption] = useState("")

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

    const [postInfo, setPostInfo] = useState(null)
    const [userId, setUserId] = useState(null)
    const {id} = useParams()


    useEffect(() => {
        fetch(`http://localhost:8080/post/${id}`)
        .then(res => res.json())
        .then(postInfo => {
            setTitle(postInfo.title)
            setSummary(postInfo.summary)
            setContent(postInfo.content)
            setTopic(postInfo.topic)
            setCaption(postInfo.caption)
        })

    }, [id])

    async function updatePost(e) {
        e.preventDefault()

        const data = new FormData()
        data.set('title', title)
        data.set('summary', summary)
        data.set('content', content)
        data.set('topic', topic)
        data.set('caption', caption)
        if (files?.[0]) {
            data.set('file', files?.[0])
        }
        data.set('id', id)

        fetch("http://localhost:8080/post", {
            method: 'PUT',
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            body: data
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data === "Post Updated") {
                navigate("/")
            } else if (data === "Missing Info") {
                alert("Fill Out All Information")
            }
        })
    }

    return (
        <div className="createContainer">
            <h1 className="pageTitle">Edit Article</h1>

            <form className="postInfo" onSubmit={updatePost}>
                <input type="text" className="postTitle" value={title}
                    onChange={e => setTitle(e.target.value)}/>
                <h3 className="articleTopicLabel">Article Topic</h3>
                <select className="selectTopic" name="topic" value={topic} required onChange={e => setTopic(e.target.value)}>
                    <option value="Politics">Politics</option>
                    <option value="Education">Education</option>
                    <option value="Culture">Culture</option>
                </select>
                <textarea wrap="hard" type="text" className="postSummary"  value={summary}
                    onChange={e => setSummary(e.target.value)} required />
                <div className="imageInput">
                    <p className="imageLabel">Cover Image - Will remain unchanged if a new file is not chosen</p>
                    <input type="file" className="postImage" name="mainImage"
                        onChange={e => setFiles(e.target.files)} />
                </div>
                <textarea wrap="hard" type="text" className="imageCaption"  value={caption}
                    onChange={e => setCaption(e.target.value)} required />

                <div className="editorContainer">
                    <h3 className="articleTextLabel">Article Text</h3>
                    <ReactQuill
                        className="editor"
                        theme="snow" 
                        modules={modules}
                        formats={formats}
                        onChange={setContent}
                        value={content}
                    />
                </div>
                <input type="submit" className="postButton" value='Update Article'/>
            </form>
        </div>
    )
}