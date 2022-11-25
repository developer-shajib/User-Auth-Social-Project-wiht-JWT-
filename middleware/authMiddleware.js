import { validate } from "../utility/validate.js";


export const guestMiddleware = (req,res,next)=>{

    const token = req.cookies.authToken;

    if(token && req.session.user){
        
        validate(req,res,'You are already loggedIn!', '/')
    }
    else{
        next()
    }
}