import "../css/accountPage.css"
import React, { useEffect, useState } from "react"
import { Link, useNavigate} from "react-router-dom";

export default function AccountPage() {
    const navigate = useNavigate()

    const [posts, setPosts] = useState([])
    const [email, setEmail] = useState()
    const [first, setFirst] = useState()
    const [last, setLast] = useState()
    const [username, setUsername] = useState()
    const [school, setSchool] = useState()
    const [position, setPosition] = useState()
    const [createdAt, setCreatedAt] = useState()

    useEffect(() => {
        fetch("http://localhost:8080/pastposts", {
        headers: {
            "x-access-token": localStorage.getItem("token"),
            "Content-type": "application/json"
        },
    }) 
    .then(res => res.json())
    .then(posts => setPosts(posts))
    }, [])

    useEffect(() => {
        fetch("http://localhost:8080/account", {
            headers: {
                "x-access-token": localStorage.getItem("token")
            }
        })
        .then(res => res.json())
        .then(userDoc => {
            setEmail(userDoc.email)
            setPosition(userDoc.position)
            setSchool(userDoc.school)
            
            const date = new Date(userDoc.createdAt)
            setCreatedAt(date.toDateString().slice(4))

            const first = userDoc.first.charAt(0).toUpperCase() + userDoc.first.slice(1)
            const last = userDoc.last.charAt(0).toUpperCase() + userDoc.last.slice(1)
            setUsername(first + " " + last)
            setFirst(userDoc.first)
            setLast(userDoc.last)
        })
    }, [])

    const deleteAccount = () => {
        if(window.confirm("Are you sure you want to delete your account?")) {
            if(window.confirm("Are you REALLY REALLY SURE?")) {
                fetch('http://localhost:8080/deleteAccount', {
                    headers: {
                        "x-access-token": localStorage.getItem("token"),
                    }
                })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    localStorage.removeItem("token")
                    navigate('/')
                    navigate(0)
                })
                
            }
        }
    }

    return (
        <div className="accountPageContainer">
            <h1 className="accountUsername">Hello {username}</h1>
            <p className="userPostNumber">Number of Posts: <b>{posts.length}</b></p>

            <div className="linkstoOthers">
                <Link to="/past"><button className="pastPostsButton">View Past Posts</button></Link>
                <Link to="/create"><button className="createPostButton">Create Post</button></Link>
            </div>

            <div className="accountInfoContainer">
                <h2 className="accountInfoTitle">Account Info</h2>
                <div className="accountInfo">
                    <p>First Name: {first}</p>
                    <p>Last Name: {last}</p>
                    <p>Password: **********</p>
                    <p>Email: {email}</p>
                    <p>School: {school}</p>
                    <p>Position: {position}</p>
                </div>
                <Link to="/update"><button className="updateAccountButton">Update Account Information</button></Link>
            </div>

            <p className="memberSince">Member since <em>{createdAt}</em></p>
            
            <p className="deleteAccount" onClick={deleteAccount}>Delete Account</p>
        </div>
    )
}