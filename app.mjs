import express from 'express'
import mongoose from "mongoose"
import cors from "cors"
import path from "path";
const __dirname = path.resolve();

import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { 
    stringToHash,
    varifyHash, 
 
} from "bcrypt-inzi"

const SECRET = process.env.SECRET || "12345"
const PORT = process.env.PORT || 5001
const app = express()

mongoose.connect(`mongodb://abdurrehman:Disccompact890@cluster0-shard-00-00.7d9p9.mongodb.net:27017,cluster0-shard-00-01.7d9p9.mongodb.net:27017,cluster0-shard-00-02.7d9p9.mongodb.net:27017/users?ssl=true&replicaSet=atlas-wpbp4z-shard-0&authSource=admin&retryWrites=true&w=majority`)
.then(res => console.log("Connected to DB"))
// .catch(err => console.log(err))

const User = mongoose.model('data', {
    name: String,
    email: String,
    password: String,
    created: { type: Date, default: Date.now },
});
app.use(cookieParser())
app.use(express.json())


app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5001"],
    credentials: true
}))

app.use('/', express.static(path.join(__dirname, 'website/build')))
app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname, "./website/build/index.html"))
})


app.post('/api/v1/login', (req, res, next) => {

    if (!req.body.email ||
        !req.body.password
    ) {
        console.log("required field missing");
        res.status(403).send("required field missing");
        return;
    }
    console.log("req.body: ", req.body);

    User.findOne({ email: req.body.email }, (err, user) => {

        if (err) {
            res.status(500).send("error in getting database")
        } else {
            if (user) {

                varifyHash(req.body.password, User.password).then(result => {
                    if (result) {

                        var token = jwt.sign({
                            name: user.name,
                            email: user.email,
                            _id: user._id,
                        }, SECRET);
                        console.log("token created: ", token);

                        res.cookie("token", token, {
                            httpOnly: true,
                            // expires: (new Date().getTime + 300000), //5 minutes
                            maxAge: 300000
                        });

                        res.send({
                            name: user.name,
                            email: user.email,
                            _id: user._id,
                        });
                    } else {
                        res.status(401).send("Authentication fail");
                    }
                }).catch(e => {
                    console.log("error: ", e)
                })

            } else {
                res.send("user not found");
            }
        }
    })
})

app.post('/api/v1/signup', (req, res, next) => {

    if (!req.body.email ||
        !req.body.password ||
        !req.body.name
    ) {
        console.log("required field missing");
        res.status(403).send("required field missing");
        return;
    } else {

        User.findOne({ email: req.body.email }, (err, user) => {
            if (user) {
                res.send("user already exist");
            } else {
                console.log(req.body)

                stringToHash(req.body.password).then(passwordHash => {
                    console.log("hash: ", passwordHash);

                    let newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: passwordHash,
                    })
                    newUser.save(() => {
                        console.log("data saved")
                        res.send('signup success')
                    })
                })
            }
        })
    }

})

app.use((req, res, next) => {

    jwt.verify(req.cookies.token, SECRET,
        function (err, decoded) {

            req.body._decoded = decoded;

            console.log("decoded: ", decoded) // bar

            if (!err) {
                next();
            } else {
                res.status(401).sendFile(path.join(__dirname, "./website/build/index.html"))
            }

        })

});

app.post('/api/v1/logout', (req, res, next) => {
    res.cookie("token", "", {
        httpOnly: true,
        maxAge: 300000
    });
    res.send();
})

app.get('/api/v1/data', (req, res) => {
    User.findOne({ email: req.body._decoded.email }, (err, user) => {

        if (err) {
            res.status(500).send("error in getting database")
        } else {
            if (user) {
                res.send({
                    name: user.firstName,
                    email: user.email,
                    _id: user._id,
                });
            } else {
                res.send("user not found");
            }
        }
    })
})
app.post('/api/v1/profile', (req, res) => {
    res.send('profile created')
})
app.put('/api/v1/profile', (req, res) => {
    res.send('profile updated')
})
app.delete('/api/v1/profile', (req, res) => {
    res.send('profile deleted')
})
app.get("/**", (req, res, next) => {
    res.sendFile(path.join(__dirname, "./website/build/index.html"))
    // res.redirect("/")
})

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})