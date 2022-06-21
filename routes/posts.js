const router = require('express').Router();
const User = require('../models/User'); 
const Post = require('../models/Posts');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    }, filename: function (req, file, cb) { 
        cb(null,new Date().toString() + file.originalname)
    }
})

const FileFilter = (req, file, cb) => { 
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    fileFilter: FileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});


//create post

router.post('/', upload.single('file') , (req , res) => {
    const newPost = new Post({
        title: req.body.title,
        desc: req.body.desc,
        photo: req.file.path,
        username: req.body.username,
        category: req.body.category
    });
    try { 
        const savedPost =  newPost.save();
        res.status(200).json(savedPost);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

//update post

router.put('/:id', async (req, res) => {
    try { 
        const post = await Post.findById(req.params.id);
        if(post.username === req.body.username) { 
            try { 
                const updatedPost = await Post.findByIdAndUpdate(req.params.id,
                    {
                     $set: req.body
                    },
                    { new: true });
                res.status(200).json(updatedPost);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }

        } else {
            res.status(401).json({ message: 'You are not authorized to update this post' });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }

})

//delete post

router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.username === req.body.username) {
            try {
                const deletedPost = await Post.findByIdAndDelete(req.params.id);
                res.status(200).json("Post deleted successfully");
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        } else {
            res.status(401).json({ message: 'You are not authorized to delete this post' });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

//get post

router.get("/:id", async (req, res) => {
    try { 
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

//get all posts

router.get('/', async (req, res) => { 
    const username = req.query.user;
    const catName = req.query.cat;
    try { 
        let posts;
        if (username) {
            posts = await Post.find({ username });
        } else if (catName) {
            posts = await Post.find({ catName });
        }
        else {
            posts = await Post.find();
        }
        res.status(200).json(posts);

    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;