


const isAdmin = async(req, res, next) => {
    try {
        const user = req.user;
        if(user?.role === 'admin'){
            return next();
        }
        res.status(401).json({sucess: false, message: "Unauthorized!"});
    } catch (error) {
        res.status(500).json({success: false, message: "Unauthorized"});
    }
};

const isOwner = async(req, res, next) => {
    try {
        const user = req.user;
        if(user?.role === 'owner'){
            return next();
        }
        res.status(401).json({sucess: false, message: "Unauthorized!"});
    } catch (error) {
        res.status(500).json({success: false, message: "Unauthorized"});
    }
};

const isNotUser = async(req, res, next) => {
    try {
        const user = req.user;
        if(user?.role !== 'user'){
            return next();
        }
        res.status(401).json({sucess: false, message: "Unauthorized!"});
    } catch (error) {
        res.status(500).json({success: false, message: "Unauthorized"});
    }
};



module.exports = {isAdmin, isOwner, isNotUser};