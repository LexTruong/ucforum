import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import "../css/createPostPage.css"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

export default function EditPostPage() {
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
            setPostInfo(postInfo)
        })

    }, [id])

    if (!postInfo) return "Post Unavailable"

    return (
        <div className="createContainer">
            <h1 className="pageTitle">Edit Article</h1>

            <form className="postInfo">
                <input type="text" className="postTitle"
                    onChange={e => setTitle(e.target.value)}/>
                <h3 className="articleTopicLabel">Article Topic</h3>
                <select className="selectTopic" name="topic" required onChange={e => setTopic(e.target.value)}>
                    <option value="Politics">Politics</option>
                    <option value="Education">Education</option>
                    <option value="Culture">Culture</option>
                </select>
                <textarea wrap="hard" type="text" className="postSummary"  
                    onChange={e => setSummary(e.target.value)} required />
                <div className="imageInput">
                    <p className="imageLabel">Cover Image </p>
                    <input type="file" className="postImage" name="mainImage"
                        onChange={e => setFiles(e.target.files)} required />
                </div>
                <textarea wrap="hard" type="text" className="imageCaption"  
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