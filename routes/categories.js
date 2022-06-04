const router = require('express').Router();
const Category = require('../models/Category'); 


//create category

router.post('/', async (req, res) => {
    const category = new Category(req.body);

    try { 
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})

//get all categories

router.get('/', async (req, res) => { 

    try { 
        const cats = await Category.find();
        res.status(201).json(cats);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
})


module.exports = router;