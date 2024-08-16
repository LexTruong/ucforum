const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const app = express();
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("./models/user")
const encryptionKey= "H1Dwau7adhaWDH765928jjHWH"

// middleware
const urlencodedParser = bodyParser.urlencoded({extended: false})
app.use(bodyParser.json(), urlencodedParser)
app.use(cors({credentials: true, origin: 'http://localhost:3000'}))

// connecting to mongoDB database
// username: lextruong
// password: BjcZCcvL4Q5ijs32
const dbURI = "mongodb+srv://lextruong:BjcZCcvL4Q5ijs32@cluster0.705zh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(dbURI)


// routes
app.post("/register", async (req, res) => {
    const user = req.body;

    //check if user exists already
    const takenEmail = await User.findOne({email: user.email})
    
    if (takenEmail) {
        res.json({message:"Taken"})
    } else {
        encryptedPassword = await bcrypt.hash(req.body.password, 10)

        const dbUser = new User({
            email: user.email.toLowerCase(),
            password: encryptedPassword
        })

        dbUser.save()
        res.json({message: "Added user to database"})
    }
})

app.post("/login", (req, res) => {
    const userLoggingIn = req.body;

    User.findOne({email: userLoggingIn.email})
    .then(dbUser => {
        if (!dbUser) {
            return res.json({message:"Invalid"})
        }
        bcrypt.compare(userLoggingIn.password, dbUser.password)
        .then(isCorrect => {
            if (isCorrect) {
                const payload = {
                    id: dbUser._id,
                    email: dbUser.email,
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
                    message: "invalid"
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
            req.user.email = decoded.email
            next()
        })
    }
    else {
        res.json({message:"incorrect token given", isLoggedIn: false})
    }
}

app.get("/isUserAuth", verifyJWT, (req, res) => {
    res.json({isLoggedIn:true, email: req.user.email})
})

app.listen(8080, () => console.log('\nServer running on http://localhost:8080\n'));
