const express = require("express");
const mongoose = require("mongoose");
const users = require('./routes/users.js');
const itemLostAndFoundPost = require('./routes/itemLostAndFoundPost.js');
const claimant = require('./routes/claimRoute.js');
const adminItemRoutes = require('./routes/adminItems');
const adminClaimRoutes = require('./routes/adminClaims');
const path = require("path");

require("dotenv").config();
const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req,res,next)=>{
    console.log(req.path, req.body);
    next();
})
app.get('/', (req,res)=>{
    res.send("SeekItem backend running");
}
)
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users/', users);
app.use('/api/items', itemLostAndFoundPost);
app.use('/api/claims', claimant);
app.use('/api/admin', adminItemRoutes);
app.use('/api/admin', adminClaimRoutes);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(PORT,()=>{
        console.log(`Started seek server on port ${PORT}`);
    })
}).catch((error)=>{
    console.error(error.message);
})