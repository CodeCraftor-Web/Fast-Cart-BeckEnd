const UserModel = require("./UserSchema");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createJSONWebToken } = require("../helpers/createJsonWebToken");
const sendEmailWithNodemailer = require("../helpers/email");
const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;

const getUsers = async(req, res, ) => {
    try {

        const users = await UserModel.find({});
        if(users.length === 0){
            return res.status(404).json({success: false, message: "No user found"});
        }

        res.status(200).json({success: true, message: "users were returned", users});
    } catch (error) {
        res.status(500).json({success: false, message:error.message});
    }
};

const getUserById = async(req, res, ) => {
    try {
        
        const user = await UserModel.findById(req.id).select("-password -refreshToken");
        if(!user){
            res.status(404).json({success: false, message: "User not found"});
        }
        res.status(200).json({success: true, message: "users were returned", user});
    } catch (error) {
        res.status(500).json({success: false, message:error.message});
    }
};

const register = async(req, res) => { 
    try {
        
        const {name, email, password} = req.body;
        
        const userExists = await UserModel.exists({email});

        if(userExists){
            res.status(400).json({success: false, message: "User already exists!"});
        }

       const token = createJSONWebToken({name, email, password}, ACCESS_TOKEN_SECRET_KEY, '10m');

       const emailData = {
        email,
        subject: "Account Activation Email",
        html: `
        
            <h2>Hello ${name}</h2>
            <p>Please click here to <a href="${process.env.CLIENT_URL}/user/verify/${token}" target="_blank">activate your account</a></p>
        
        `
        }

        try {
            await sendEmailWithNodemailer(emailData);
        } catch (emailError) {
            console.log(emailError.message);
            res.status(500).json({success: false, message:"Failed to send verification email"});
            return;
        }

        res.status(200).json({success: true, message: `Go to your ${email} to activate your account`, token})
    
    } catch (error) {
        res.status(500).json({success: false, message:error.message});
       
    }
}


const activateUserAccount = async(req, res, next) => {
    try {
        const {token} = req.body;
       
        if(!token) {
            return res.status(400).json({success: false, message: "Verification link expired. Please try again"})
        }

        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET_KEY);

        if(!decoded){
            return res.status(400).json({success: false, message: "Account cannot be verified. Please try again."})
        }

        const userExists = await UserModel.exists({email: decoded.email});

        if(userExists){
            return res.status(400).json({success: false, message: "User already verified"}) 
        }

        const hashedPassword = await bcrypt.hash(decoded.password, 10);  

        const newUser = new UserModel({name:decoded.name, email: decoded.email, password: hashedPassword, isEmailVerified: true});
        await newUser.save();

       res.status(200).json({success: true, message: "Account verified successfully. Please sign in", newUser})
    } catch (error) {
       console.log(error.message); 
       res.status(500).json({success: false, message: error.message});
    }
}

const signIn = async(req, res) => {
    try {
        const {email,password} = req.body; 

        const userExist = await UserModel.findOne({email});
        if(!userExist){
            return res.status(400).json({success: false, message: "Invalid email/password"})
        }

        // Match Password 
        const passwordMatch = await bcrypt.compare(password, userExist.password);

        if(!passwordMatch){
            return res.status(400).json({success: false, message: "Invalid email/password"})
        }

        // Generate JWT Access Token
        const accessToken = createJSONWebToken({id: userExist._id, name: userExist.name, email: userExist.email}, ACCESS_TOKEN_SECRET_KEY, "3m");
       
         // Generate JWT Refresh Token
         const refreshToken = createJSONWebToken({id: userExist._id, name: userExist.name, email: userExist.email}, REFRESH_TOKEN_SECRET_KEY, "30d");
       
         await UserModel.findByIdAndUpdate(userExist._id, {refreshToken});

        // Set Refresh Token to Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',   
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        
        res.status(200).json({success: true, message: "Login successful", user: userExist, accessToken});  
    } catch (error) {
        res.status(500).json({success: false, message:error.message});
    }
}

const logout = async(req, res) => {
    try {
        const refreshToken = req?.cookies?.refreshToken;
        
        const deleteToken = await UserModel.findOneAndUpdate({refreshToken}, {refreshToken: ''}, {new: true});
        
        
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            });
    
    
            res.status(200).json({success: true, message: 'Logout successful' });
        
       
    } catch (error) {
        res.status(500).json({success: false, message:error.message});
    }
}

const deleteAccount = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const deletedUser = await UserModel.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({ success: false, message: "Account not found" });
      }
  
      res.status(200).json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, success: error.message });
    }
  };

const deleteAllAccounts = async (req, res, next) => {
    try {
  
      const deletedUsers = await UserModel.deleteMany();
  
      if (!deletedUsers) {
        return res.status(404).json({ success: false, message: "Accounts not found" });
      }
  
      res.status(200).json({ success: true, message: "All Accounts deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, success: error.message });
    }
  };


  const refreshJwToken = async(req, res) => {
        const refreshToken = req?.cookies?.refreshToken;

        if(!refreshToken){
            return res.status(401).json({success: false, message: "Unauthorized"});
        }

        try {
            const user = await UserModel.findOne({refreshToken});

            if(!user){
                return res.status(401).json({success: false, message: "Unauthorized"});
            }

            const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET_KEY);
           
            if(!decoded || decoded.id !== user._id.toString()){
                return res.status(401).json({success: false, message: "Unauthorized here"});
            }

            const accessToken = createJSONWebToken({id: decoded.id, name: decoded.name, email: decoded.email}, ACCESS_TOKEN_SECRET_KEY, '3m');

            res.status(200).json({success: true, accessToken});
        } catch (error) {
            return res.status(401).json({success: false, message: "Unauthorized"});
        }
  }

  

module.exports = {register, activateUserAccount, signIn, logout, getUsers, getUserById, deleteAccount, deleteAllAccounts, refreshJwToken};