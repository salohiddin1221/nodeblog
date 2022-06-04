const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const categoryRoute = require('./routes/categories');
const multer = require('multer');

dotenv.config();
app.use(express.json());

// mongo db connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => { 
        console.log(err); 
    })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    }, filename: function (req, file, cb) { 
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
    res.status(200).send("File Uploaded");
})




app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);
app.use('/api/category', categoryRoute);



app.get('/', (req, res) => {
    res.send('Hello World!');
})


app.listen((process.env.PORT || 5000), function(){
    console.log('listening on *:5000');
  });