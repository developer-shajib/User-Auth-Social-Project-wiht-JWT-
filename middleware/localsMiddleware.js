


export const localsMiddleware = (req,res,next)=>{

        res.locals.message = req.session.message;
        delete req.session.message;
        res.locals.user = req.session.user;

   
        res.locals.resend = req.session.resend
        delete req.session.resend;

        res.locals.resendUserData = req.session.resendUserData;
        delete req.session.resend;

        res.locals.bg = req.session.bg
        delete req.session.bg

        res.locals.forget_email = req.session.forget_email;


        next()
    
}