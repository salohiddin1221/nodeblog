const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//Register

router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    } catch(err) {
       res.status(500).json({ message: err.message });
    }
})


//Login

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if(!user) return res.status(400).json({ message: 'Invalid Credentials' });
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid Credentials' });
        const {password , ...userWithoutPassword} = user.toObject();
        res.json({
            message: 'Logged in Successfully',
            userWithoutPassword
        });
    } catch(err) {
       res.status(500).json({ message: err.message });
    }
})





module.exports = router;