const router = require('express').Router();
const User = require('../models/User'); 
const Post = require('../models/Posts'); 
const bcrypt = require('bcrypt');

//update

router.put('/:id', async (req, res) => {
    if (req.body.userId === req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            req.body.password = hashPassword;
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body
            },
            {new: true}
            )
            res.status(200).json(updatedUser);

        } catch(err) {
           res.status(500).json({ message: err.message });
        }
    } else {
        res.status(401).json({ message: 'You are not authorized to update this user.' });
    }
})


//delete

router.delete('/:id', async (req, res) => {
    if (req.body.userId === req.params.id) {
        try {

            const user = await User.findById(req.params.id);

            try { 
                await Post.deleteMany({username: user.username})
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json({ message: 'User has been deleted...' });
    
            } catch(err) {
               res.status(500).json({ message: err.message });
            } 
        }
        catch (err) {
            res.status(404).json({ message:"user not found" });
        }
        
    } else {
        res.status(401).json({ message: 'You are not authorized to delete this user.' });
    }
})
 

//get user

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password , ...userWithoutPassword} = user.toObject();
        res.status(200).json(userWithoutPassword);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
})

// get all users

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
})



module.exports = router;