require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const authRoutes = require("./routes/authRoutes")
const postRoutes = require("./routes/postRoutes")
const userRoutes = require("./routes/userRoutes")
const app = express();

//middleware
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,
  }));

//routes
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use('/api/users', userRoutes)

//define a simple route
app.get("/", (req, res)=>{
    res.send("welcome to backend server");
})

//connect to database
connectDB();

//start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`server is running on port: ${PORT}`);
})