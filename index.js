const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express(); 
const userRoute = require('./routes/users');
const postRoute = require('./routes/posts');
const adminRoute = require('./routes/admin.route'); 
const cors = require('cors');


dotenv.config();
app.use(express.json());

app.use(cors())

// mongo db connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
})
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => { 
        console.log(err); 
    })








app.use('/api/users', userRoute);
app.use('/api/posts', postRoute); 
app.use('/admin', adminRoute);




app.get('/', (req, res) => {
    res.send('Hello World!');
})


app.listen((process.env.PORT || 5000), function(){
    console.log('listening on *:5000');
  });