import { validate } from "../utility/validate.js";
import { verifyToken } from "../utility/jwt.js";
import User from "../models/User.js";


export const authRedirectMiddleware = async (req,res,next)=>{

  try {
    const token = req.cookies.authToken;

    if(token && req.session.user ){

        const userTokenVerify = verifyToken(token);

        if(userTokenVerify){

            const userData = await User.findById(userTokenVerify.id);

            if(userData){
                
                next()
            }
            else{
                delete req.session.user;
                res.clearCookie('authToken');
                validate(req,res,'User data not found!', '/login');
       
            }
      

        }else{

            delete req.session.user;
            res.clearCookie('authToken');
            validate(req,res,'Invalid Token!', '/login');

            
        }
     
    }
    else{
        delete req.session.user;
        res.clearCookie('authToken');
        validate(req,res,'Your are not allowed!', '/login')
    }


  } catch (error) {
    delete req.session.user;
    res.clearCookie('authToken');
    validate(req,res,'Login Again.','/login');
  }

 

}