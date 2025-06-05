const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { profilePicture } = require("./userController");

const generateToken = (userId) =>{
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: "7d"})
};

//signup
exports.signup = async (req, res) =>{
    const {username, email, password} = req.body;
    try {
        const exisitingUser = await User.findOne({email});
        if(exisitingUser) return res.status(400).json({message: "user already exists"})

        const user = await User.create({username, email, password});
        const token = generateToken(user._id);
        res.json({ user: {_id: user._id, username: user.username, email: user.email }, token });
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

//login
exports.login = async (req, res) =>{
    const {email, password} = req.body;
    try{
        const user = await User.findOne({email})
        if(!user || !(await user.comparePassword(password))) 
            return res.status(400).json({message: "invalid credentials"});

        const token= generateToken(user._id);
        res.json({ user: {_id: user._id, username: user.username, email: user.email, profilePicture: user.profilePicture }, token });
    }catch(error){
        return res.status(500).json({message:error.message})
    }
}