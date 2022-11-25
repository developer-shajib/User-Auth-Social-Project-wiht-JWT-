

//validate msg
export const validate = (req,res,msg,redirect,bg)=>{
   
    req.session.message = msg;
    req.session.bg = bg
    res.redirect(redirect);

    

}