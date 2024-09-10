import jwt from "jsonwebtoken"

// const authenticateJWT = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     console.log(authHeader)
//     if (authHeader) {
//       const token = authHeader.split(' ')[1];
//       jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//           return res.sendStatus(403);
//         }
//         req.user = user;
//         next();
//       });
//     } else {
//       res.sendStatus(401);
//     }
//   };

export function getUser(token){
    if(!token) return null;
    return jwt.verify(token,process.env.JWT_SECRET)
}


const authenticateJWT = (req,res,next)=>{
    const token = req.signedCookies?.cookie
    if(!token) return res.status(403).json({error:"not logged in"})
    const user = getUser(token)
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized'});
    }
    next();
}
  export default authenticateJWT;