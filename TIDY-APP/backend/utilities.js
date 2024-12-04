const jwt = require('jsonwebtoken');
function authenticationToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1];
    if(!token){
        return res.status(401).send("Unauthorized");
    }
    // console.log(token,"token");
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
        if(err){
            return res.status(403).send('Token Verfication Failed');
        }else{
            if (decoded.role && decoded.role === 'admin') {
                req.admin = decoded;
                console.log(decoded, "admin");
            }else{
                req.user=decoded;
                console.log(decoded,"user");
            } 
            next();
        }
    });    
}
module.exports = {
    authenticationToken
};