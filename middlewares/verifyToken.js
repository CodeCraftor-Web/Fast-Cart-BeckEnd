const jwt = require('jsonwebtoken');
const { createJSONWebToken } = require("../helpers/createJsonWebToken");

const ACCESS_TOKEN_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_TOKEN_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;


const verifyToken = (req, res, next) => {
    const header = req?.headers?.authorization;
    const accessToken = header?.split(' ')[1];
    
    if(!accessToken){
        return res.status(401).json({ message: 'Unauthorized' });
    }else{
        jwt.verify(accessToken, ACCESS_TOKEN_SECRET_KEY, (err, decoded)=>{
            if(err){
                return res.json({success: false, message: 'Unauthorized'})
            }else{
                req.id = decoded.id;
                next();
            }
        })
    }
};



module.exports = verifyToken;