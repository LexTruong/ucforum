const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const app = express();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("./models/User");
const Post = require('./models/post');
const encryptionKey= "H1Dwau7adhaWDH765928jjHWH"

// middleware
const urlencodedParser = bodyParser.urlencoded({extended: false})
app.use(bodyParser.json(), urlencodedParser)
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

// connecting to mongoDB database
// username: lextruong
// password: BjcZCcvL4Q5ijs32
const dbURI = "mongodb+srv://lextruong:BjcZCcvL4Q5ijs32@cluster0.705zh.mongodb.net/data?retryWrites=true&w=majority&appName=Cluster0"

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
                isLoggedIn:false,
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
        isLoggedIn:true,
        first: req.user.first,
        last: req.user.last
    })
})

// create new post and add to database
app.post('/post', verifyJWT, (req, res) => {
    const postInfo = req.body

    // author is the id corresponding to a user in the database
    // can use to get user info from database
    const postDoc = new Post({
        title: postInfo.title,
        summary: postInfo.summary,
        content: postInfo.content,
        file: "temporary file",
        author: req.user.id
    })

    postDoc.save()
    res.json("Post Created")
})

// get all posts
app.get('/posts', async (req, res) => {
    const posts = await Post.find()

    res.json(posts)
})

// get single post
app.get('/post/:id', async (req, res) => {
    const {id} = req.params
    const post = await Post.findById(id)
    res.json(post)
})

// update post


// update account


app.listen(8080, () => console.log('\nServer running on http://localhost:8080\n'));
