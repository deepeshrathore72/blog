const express = require("express")
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require('./models/post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = 'fdmnerkcnmmwrkn';
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

// app.use(express.urlencoded({extended : true}));
app.use(express.json());//used to parse the data coming from register page
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'))

const mongoUrl = "mongodb+srv://aniketrathor1:qTHryr3B00NGsVLS@cluster0.lp1jt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
main().then(() => {
    console.log("connected to DB");
}).catch((err) => { console.error(err) });

async function main() {
    await mongoose.connect(mongoUrl);
}

const salt = bcrypt.genSaltSync(10);

app.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        let user1 = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        user1.save().then(result => console.log(result));
    } catch (e) {
        res.status(400).json(e);
    }
    
    // res.json({requestData : {username, password}});
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user1 = await User.findOne({ username });
    if(user1 == null){
        return res.status(401).json({ message: "User not found" });
    }
    const passOk = bcrypt.compareSync(password, user1.password);
    if (passOk) {
        jwt.sign({ username, id: user1._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: user1._id,
                username
            });
        });
    } 
    else {
        res.status(400).json("Invalid credentials");
    }
});

app.get("/profile", (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});


app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

// app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
//     const { originalname, path } = req.file;
//     const parts = originalname.split('.');
//     const ext = parts[parts.length - 1];
//     const newPath = path + '.' + ext;
//     fs.renameSync(path, newPath);

//     const { token } = req.cookies;
//     if(token == null){
//         return res.status(400).json("Invalid credentials");
//     }
//     jwt.verify(token, secret, {}, async (err, info) => {
//         if (err) throw err;
//         const { title, summary, content } = req.body;
//         const postDoc = await Post.create({
//             title,
//             summary,
//             content,
//             cover: newPath,
//             author: info.id,
//         });
//         res.json(postDoc);
//     });
// });

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                return res.status(403).json({ error: "Token verification failed" });
            }

            if (!req.file) {
                return res.status(400).json({ error: "File upload is required" });
            }

            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            const newPath = `${path}-${Date.now()}.${ext}`;

            await fs.promises.rename(path, newPath);

            const { title, summary, content } = req.body;
            if (!title || !summary || !content) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            try {
                const postDoc = await Post.create({
                    title,
                    summary,
                    content,
                    cover: newPath,
                    author: info.id,
                });
                res.json(postDoc);
            } catch (err) {
                res.status(500).json({ error: "Failed to create post" });
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            return res.status(403).json({ error: "Token verification failed" });
        }
        const { id, title, summary, content } = req.body;
        const postDoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);

        if(!isAuthor){
            return res.status(400).json('you are not the author');
        }
        await postDoc.updateOne({
            title, 
            summary,
            content,
            cover : newPath ? newPath : postDoc.cover,

        });
        res.json(postDoc);
    });
});

app.get('/post', async (req, res) => {
    res.json(await Post.find()
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .limit(20)
    );
});

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});