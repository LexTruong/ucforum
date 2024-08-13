import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import "../css/createPostPage.css"

export default function CreatePostPage() {
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

    return (
        <div className="createContainer">
            <h1 className="pageTitle">Create Article</h1>

            <form className="postInfo">
                <input type="text" className="postTitle" placeholder="Title" />
                <textarea wrap="hard" type="text" className="postSummary" placeholder="Summarize your article into 1-2 sentences for readers." />
                <div className="imageInput">
                    <label className="imageLabel" for="mainImage">Main Image </label>
                    <input type="file" className="postImage" name="mainImage"/>
                </div>
            </form>
            <div className="editorContainer">
                <h3 className="articleTextLabel">Article Text</h3>
                <ReactQuill
                    className="editor"
                    theme="snow" 
                    modules={modules}
                    formats={formats}
                />
            </div>
            <button className="postButton">Post Article</button>
        </div>
    )
}