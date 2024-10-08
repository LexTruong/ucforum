const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const app = express();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const multer = require('multer')
const path = require('path')
require('dotenv').config()

const User = require("./models/User");
const Post = require('./models/Post');
const encryptionKey = "H1Dwau7adhaWDH765928jjHWH"

// middleware
const urlencodedParser = bodyParser.urlencoded({extended: false})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        // check if file is an image file
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})

app.use(express.static(__dirname + '/uploads'))
app.use(bodyParser.json(), urlencodedParser)
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

// connecting to mongoDB 
const dbURI = process.env.DB_URI

mongoose.connect(dbURI)

// create new account and add to database
app.post("/register", async (req, res) => {
    const user = req.body;

    //check if user exists already
    const takenEmail = await User.findOne({email: user.email})
    
    if (takenEmail) {
        res.json({message: "Taken Email"})
    } else {
        encryptedPassword = await bcrypt.hash(req.body.password, 10)

        const dbUser = new User({
            first: user.first.toLowerCase(),
            last: user.last.toLowerCase(),
            school: user.school,
            position: user.position,
            email: user.email.toLowerCase(),
            password: encryptedPassword
        })

        dbUser.save()
        res.json({message: "Added user to database"})
    }
})

// login user and return unique token
app.post("/login", (req, res) => {
    const userLoggingIn = req.body;

    User.findOne({email: userLoggingIn.email})
    .then(dbUser => {
        if (!dbUser) {
            return res.json({message:"Invalid Email"})
        }
        bcrypt.compare(userLoggingIn.password, dbUser.password)
        .then(isCorrect => {
            if (isCorrect) {
                const payload = {
                    id: dbUser._id,
                    first: dbUser.first,
                    last: dbUser.last
                }
                jwt.sign(
                    payload,
                    encryptionKey,
                    {expiresIn:40000},
                    (err, token) => {
                        if(err) return res.json({message:err})
                        return res.json({
                            message: "Success",
                            token: "Bearer " + token
                        })
                    }
                )
            }
            else {
                return res.json({
                    message: "Invalid Password"
                })
            }
        })
    })
})

function verifyJWT(req, res, next) {
    const token = req.headers["x-access-token"]?.split(' ')[1]

    if (token) {
        jwt.verify(token, encryptionKey, (err, decoded) => {
            if (err) return res.json({
                isLoggedIn: false,
                message: "auth failed"
            })
            req.user = {};
            req.user.id = decoded.id
            req.user.first = decoded.first
            req.user.last = decoded.last
            next()
        })
    }
    else {
        res.json({message:"incorrect token given", isLoggedIn: false})
    }
}

// check if user has valid token
app.get("/isUserAuth", verifyJWT, (req, res) => {
    res.json({
        isLoggedIn: true,
        first: req.user.first,
        last: req.user.last,
        userId: req.user.id
    })
})

// create new post and add to database 
// takes a FormData object as body
app.post('/post', verifyJWT, upload.single('file'), async (req, res) => {
    const postInfo = req.body

    // author is the id corresponding to a user in the database
    // can use to get user info from database
    try {
        const postDoc = new Post({
            title: postInfo.title,
            summary: postInfo.summary,
            content: postInfo.content,
            topic: postInfo.topic,
            file: req.file.filename,
            caption: postInfo.caption,
            authorId: req.user.id
        })

        await postDoc.save()
        res.json("Post Created")
    } catch(error) {
        res.status(400)
        if (error.name === "ValidationError") {
            res.json("Missing Info")
        } else {
            res.json(error.message)
        }
    }
})

// update Post
app.put('/post', verifyJWT, upload.single('file'), async (req, res) => {
    const postInfo = req.body

    const title = postInfo.title
    const summary = postInfo.summary
    const content = postInfo.content
    const topic = postInfo.topic
    const caption = postInfo.caption
    const id = postInfo.id


    // author is the id corresponding to a user in the database
    // can use to get user info from database
    try {
        const postDoc = await Post.findById(id)

        await postDoc.updateOne({
            title,
            summary,
            caption,
            content,
            topic,
            file: req.file ? req.file.filename : postDoc.file
        })

        res.json("Post Updated")
    } catch(error) {
        res.status(400)
        if (error.name === "ValidationError") {
            res.json("Missing Info")
        } else {
            res.json(error.message)
        }
    }
})

// get all posts, sort by date
app.get('/posts', async (req, res) => {
    const posts = await Post.find().populate('authorId', ['first', 'last', 'email', 'school', 'position']).sort({createdAt: -1}).limit(20)

    res.json(posts)
})

// get all posts, sort by number of likes and dislikes
app.get('/posts/popular', async (req, res) => {
    const posts = await Post.aggregate([
        {
            "$addFields": {
                "interactions": {"$add": [
                    {"$size": "$likes"},
                    {"$size": "$dislikes"},
                    {"$size": "$comments"}
                ]
            }}
        },
        {
            "$sort": {"interactions": -1}
        },
        {
            "$limit": 20
        }
    ])
    const populated = await User.populate(posts, {"path": "authorId"})
    res.json(populated)
})

// get all posts of a topic, sort by date
app.get('/topic/:name', async (req, res) => {
    const {name} = req.params
    
    const topic = name.charAt(0).toUpperCase() + name.slice(1)

    const posts = await Post.find({ topic: topic }).populate('authorId', ['first', 'last', 'email', 'school', 'position']).sort({createdAt: -1}).limit(20)

    res.json(posts)
})

// get all posts of a topic, sort by popularity
app.get('/topic/popular/:name', async (req, res) => {
    const {name} = req.params
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1)

    const posts = await Post.aggregate([
        {
            "$match": {"topic": capitalized}
        },
        {
            "$addFields": {
                "interactions": {"$add": [
                    {"$size": "$likes"},
                    {"$size": "$dislikes"},
                    {"$size": "$comments"}
                ]
            }}
        },
        {
            "$sort": {"interactions": -1}
        },
        {
            "$limit": 20
        }
    ])
    const populated = await User.populate(posts, {"path": "authorId"})
    res.json(populated)
})

// get single post
app.get('/post/:id', async (req, res) => {
    const {id} = req.params
    const post = await Post.findById(id).populate('authorId', ['first', 'last', 'email', 'school', 'position'])
    res.json(post)
})

// Get all posts of a single user
app.get('/pastposts', verifyJWT, async (req, res) => {
    const posts = await Post.find({ authorId: req.user.id }).populate('authorId', ['first', 'last', 'email', 'school', 'position']).sort({createdAt: -1})
    res.json(posts)
})

// delete post
app.put('/delete', async (req, res) => {
    const {id} = req.body
    await Post.deleteOne({ _id: id })

    res.json("Deleted Post")
})

// get account info
app.get('/account', verifyJWT, async (req, res) => {
    const userId = req.user.id

    const user = await User.findById(userId)
    res.json(user)
})

// update account
app.put("/updateAccount", verifyJWT, async (req, res) => {
    const updatedUser = req.body;

    const userDoc = await User.findById(req.user.id)

    if (userDoc.email !== updatedUser.email.toLowerCase()) {
        const takenEmail = await User.findOne({email: updatedUser.email})
        if (takenEmail) return res.json("Email Taken")
    }
    
    encryptedPassword = await bcrypt.hash(updatedUser.password, 10)

    await userDoc.updateOne({
        first: updatedUser.first.toLowerCase(),
        last: updatedUser.last.toLowerCase(),
        school: updatedUser.school,
        position: updatedUser.position,
        email: updatedUser.email.toLowerCase(),
        password: encryptedPassword
    })

    userDoc.save()

    // return new JWT
    const payload = {
        id: req.user.id,
        first: updatedUser.first.toLowerCase(),
        last: updatedUser.last.toLowerCase()
    }

    jwt.sign(
        payload,
        encryptionKey,
        {expiresIn:40000},
        (err, token) => {
            if(err) return res.json({message:err})
            return res.json({
                message: "Updated Account",
                token: "Bearer " + token
            })
        }
    )
})

// delete account
app.get('/deleteAccount', verifyJWT, async (req, res) => {
    await User.deleteOne({ _id: req.user.id })

    res.json("Deleted User")
})

// add or remove likes or dislikes
app.put('/like', verifyJWT, async (req, res) => {
    const {id, type, action} = req.body

    if (type === "like" && action === "add") {
        await Post.updateOne(
            {_id: id},
            {$push: {
                likes: req.user.id
            }}
        )
        const updatedPost = await Post.findById(id)
        res.json(updatedPost.likes)
    }

    if (type === "like" && action === "remove") {
        await Post.updateOne(
            {_id: id},
            {$pull: {
                likes: req.user.id
            }}
        )
        const updatedPost = await Post.findById(id)
        res.json(updatedPost.likes)
    }

    if (type === "dislike" && action === "add") {
        await Post.updateOne(
            {_id: id},
            {$push: {
                dislikes: req.user.id
            }}
        )
        const updatedPost = await Post.findById(id)
        res.json(updatedPost.dislikes)
    }

    if (type === "dislike" && action === "remove") {
        await Post.updateOne(
            {_id: id},
            {$pull: {
                dislikes: req.user.id
            }}
        )
        const updatedPost = await Post.findById(id)
        res.json(updatedPost.dislikes)
    }
})

// get all comments for a post
app.get('/comments/:id', async (req, res) => {
    const {id} = req.params
    const post = await Post.findById(id).populate({
        path: 'comments',
        populate: {
            path: 'authorId',
            model: 'User'
        }
    })
    const comments = post.comments
    res.json(comments)
})

// make a new comment or reply to a comment
app.post('/addcomment/:id', verifyJWT, async (req, res) => {
    const {id} = req.params
    const data = req.body

    const comment = {
        body: data.body,
        authorId: req.user.id,
        parentId: data.parent
    }

    const postDoc = await Post.findById(id)
    postDoc.comments.push(comment)
    await postDoc.save()

    res.json("Added Comment")
})

// update a comment
app.post('/updateComment/:id', async (req, res) => {
    const {id} = req.params
    const data = req.body
    const _id = data.commentId
    const newText = data.text

    const postDoc = await Post.findById(id)
    const comment = postDoc.comments.id(_id)
    comment.body = newText
    await postDoc.save()

    res.json("Updated Comment")
})

// delete a comment
app.post('/deleteComment/:id', async (req, res) => {
    const {id} = req.params
    const data = req.body
    const deleteList = data.deleteCommentIds

    const postDoc = await Post.findById(id)

    for(i=0; i< deleteList.length; i++) {
        postDoc.comments.id(deleteList[i]).deleteOne()
    }

    await postDoc.save()

    res.json("Deleted Comment")
})


app.listen(8080, () => console.log('\nServer running on http://localhost:8080\n'))