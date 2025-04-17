const jwt = require('jsonwebtoken');

const createJSONWebToken = (payload, jwtSecretKey, expiresIn) => {

    if(typeof payload !== "object" || !payload){
        throw new Error("Payload must be a non-empty object");
    }
    if(typeof jwtSecretKey !== "string" || jwtSecretKey === ""){
        throw new Error("Secret key must be a non-empty string")
    }

    try {
        const token = jwt.sign(payload, jwtSecretKey, {expiresIn});
        return token;
    } catch (error) {
        console.log("Failed to sign the JWT", error);
        throw error;
    }
}

module.exports = { createJSONWebToken };