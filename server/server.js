const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const app = express();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const multer = require('multer')
const path = require('path')

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
        isLoggedIn: true,
        first: req.user.first,
        last: req.user.last
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

// get all posts
app.get('/posts', async (req, res) => {
    const posts = await Post.find().populate('authorId', ['first', 'last', 'email', 'school', 'position']).sort({createdAt: -1}).limit(20)

    res.json(posts)
})

// get all posts of a topic
app.get('/topic/:name', async (req, res) => {
    const {name} = req.params
    
    const topic = name.charAt(0).toUpperCase() + name.slice(1)

    const posts = await Post.find({ topic: topic }).populate('authorId', ['first', 'last', 'email', 'school', 'position']).sort({createdAt: -1}).limit(20)

    res.json(posts)
})

// get single post
app.get('/post/:id', async (req, res) => {
    const {id} = req.params
    const post = await Post.findById(id).populate('authorId', ['first', 'last', 'email', 'school', 'position'])
    res.json(post)
})

// update post


// update account


// get all comments for a post


// make a new comment


// update a comment


// reply to a comment


// delete a comment



app.listen(8080, () => console.log('\nServer running on http://localhost:8080\n'))