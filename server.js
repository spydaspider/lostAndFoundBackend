const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use((req,res,next)=>{
    console.log(req.path, req.body);
    next();
})
app.get('/', (req,res)=>{
    res.send("SeekItem backend running");
}
)
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(PORT,()=>{
        console.log(`Started seek server on port ${PORT}`);
    })
}).catch((error)=>{
    console.error(error.message);
})