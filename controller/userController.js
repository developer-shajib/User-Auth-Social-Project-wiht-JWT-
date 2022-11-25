import User from "../models/User.js";
import { makeHash } from "../utility/hash.js";
import { validate } from "../utility/validate.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { createToken, verifyToken } from "../utility/jwt.js";
import { emailSend } from "../utility/mail.js";
import fs, { unlinkSync } from "fs";
import { resolve } from "path";
const __dirname = resolve();

/**
 * @desc show Profile Page
 * @name GET /
 * @access private
 */
export const profilePage = (req, res) => {
    res.render("profile");
};

/**
 * @desc user Login page
 * @name POST /login
 * @access public
 */
export const loginPage = (req, res) => {
    res.render("index");
};

/**
 * @desc user Register Page
 * @name POST /register
 * @access private
 */
export const registerPage = (req, res) => {
    res.render("register");
};
/**
 * @desc user Register Page
 * @name POST /register
 * @access public
 */
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //validation
        if (!name || !email || !password) {
            validate(req, res, "All fields are required!", "/register");
        } else {
            const emailCheck = await User.findOne().where("email").equals(email);

            if (emailCheck) {
                validate(req, res, "Email already Exits!", "/register");
            } else {
                const user = await User.create({ name, email, password: makeHash(password) });

                const token = createToken({ id: user._id }, 1000 * 60 * 60 * 24);

                const activation_link = `${process.env.APP_URL}:${process.env.PORT}/activate/${token}`;

                emailSend(email, { name, email, link: activation_link });

                validate(req, res, "User Register Successful.Check your email and activate your account!", "/login", "#4a930d");
            }
        }
    } catch (error) {
        validate(req, res, error.message);
    }
};

/**
 * @desc user Login Page
 * @name POST /login
 * @access public
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //validation
        if (!email || !password) {
            validate(req, res, "All fields are required!", "/login");
        } else {
            const loginUser = await User.findOne().where("email").equals(email);

            if (!loginUser) {
                validate(req, res, "Email does not Exists!", "/login");

            } else {
                const passMatch = bcryptjs.compareSync(password, loginUser.password);

                if (!passMatch) {

                    req.session.forget_email = email;
                    validate(req, res, "Wrong Password", "/login");

                } else {

                    if (loginUser.isActivate == false) {

                        req.session.resend = `resend`;
                        req.session.name = loginUser.name;
                        req.session.email = loginUser.email;

                        const token = createToken({ id: loginUser._id }, 1000 * 60 * 60 * 24 * 3);
                        const activation_link = `${process.env.APP_URL}:${process.env.PORT}/activate/${token}`;

                        req.session.link = activation_link;

                        validate(req, res, `Please Activate your Account or `, "/login");
                    
                    } else {

                        const logToken = createToken({ id: loginUser._id }, '1d');

                        res.cookie("authToken", logToken, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1) });
                        req.session.user = loginUser;
                        delete req.session.forget_email
                        validate(req, res, "Login Successful", "/", "#4a930d");

                    }
                }
            }
        }
    } catch (error) {
        validate(req, res, error.message, "/login");
    }
};

/**
 * @desc user Logout Page
 * @name GET /logout
 * @access public
 */
export const logoutUser = (req, res) => {
    delete req.session.user;
    res.clearCookie("authToken");
    validate(req, res, "Logged out successful.", "/login", "#4a930d");
};

/**
 * @desc user Account Activation Page
 * @name GET /logout
 * @access public
 */
export const userAccountActivation = async (req, res) => {
    try {
        const { token } = req.params;

        const tokenVerify = jwt.verify(token, process.env.JWT_SECRET);

        if (!tokenVerify) {
            validate(req, res, `Invalid Activation Link, Resend Link`, "/login");
        } else {
            const activationUser = await User.findById(tokenVerify.id);

            if (activationUser.isActivate == true) {
                validate(req, res, `Account Already Activated`, "/login", "#4a930d");
            } else {
                await User.findByIdAndUpdate(tokenVerify.id, { isActivate: true });

                validate(req, res, `Account Activate Successfully.Please Login!`, "/login", "#4a930d");
            }
        }
    } catch (error) {
        console.log(error.message);
    }
};

/**
 * @desc user Account Activation resend link
 * @name GET /resend
 * @access public
 */
export const resendEmail = (req, res) => {
    const name = req.session.name;
    const email = req.session.email;
    const link = req.session.link;

    emailSend(email, { name, email, link });

    validate(req, res, "Email has been sent.please check and activate it!", "/login", "#4a930d");

    delete req.session.name;
    delete req.session.email;
    delete req.session.link;
};

/**
 * @desc Profile photo update page
 * @name GET /photo-update
 * @access public
 */
export const profilePhotoPage = (req, res) => {
    res.render("photo");
};

/**
 * @desc Profile photo update post
 * @name POST /photo-update
 * @access public
 */
export const profilePhotoUpdate = async (req, res) => {
    try {

        const storeDone = await User.findByIdAndUpdate(req.session.user._id, { photo: req.files.profile[0].filename });

        if (storeDone) {
            if (req.session.user.photo) {
                unlinkSync(`${__dirname}/public/media/user_profile/${req.session.user.photo}`);
            }

            req.session.user.photo  = req.files.profile[0].filename
            validate(req, res, "Photo Update Successfully.", "/photo-update", "#4a930d");
        
        } else {
            validate(req, res, "Photo not updated.please try again!", "/photo-update");
        }

    } catch (error) {
        validate(req, res, error.message, "/photo-update");
    }
};
/**
 * @desc Profile photo delete
 * @name GET /delete-photo
 * @access public
 */
export const deleteProfilePhoto = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.session.user._id, { photo: "" });
        unlinkSync(`${__dirname}/public/media/user_profile/${req.session.user.photo}`);
        delete req.session.user.photo;

        validate(req, res, "Photo Delete Successfully.", "/photo-update", "#4a930d");
    } catch (error) {
        validate(req, res, error.message, "/photo-update");
    }
};

/**
 * @desc Gallery Photo page
 * @name GET /gallery
 * @access public
 */
export const getGalleryPage = (req, res) => {
    res.render("gallery");
};

/**
 * @desc Gallery Photo Upload
 * @name POST /gallery
 * @access public
 */
export const uploadGalleryPhoto = async (req, res) => {
    try {
        for (let i = 0; i < req.files.length; i++) {
            await User.findByIdAndUpdate(req.session.user._id, { $push: { gallery: req.files[i].filename } });
            req.session.user.gallery.push(req.files[i].filename);
        }

        // req.session.user = await User.findById(req.session.user._id);

        validate(req, res, "Photo Upload Successfully.", "/gallery", "#4a930d");
    } catch (error) {
        validate(req, res, error.message, "/gallery");
    }
};

/**
 * @desc Gallery single Photo delete
 * @name GET /gallery/:id
 * @access public
 */
export const deleteGallerySinglePhoto = async (req, res) => {
    const { id } = req.params;

    try {
        await User.findByIdAndUpdate(req.session.user._id, { $pull: { gallery: req.session.user.gallery[id] } });

        unlinkSync(`${__dirname}/public/media/gallery/${req.session.user.gallery[id]}`);

        req.session.user = await User.findById(req.session.user._id);

        validate(req, res, "Photo has been deleted.", "/gallery", "#4a930d");
    } catch (error) {
        validate(req, res, error.message, "/gallery");
    }
};

/**
 * @desc password change page
 * @name GET /password
 * @access public
 */
export const passwordPage = (req, res) => {
    res.render("password");
};

/**
 * @desc profile Change Pass
 * @name POST /password
 * @access public
 */
 export const profileChangePass = async (req, res) => {
    
        const {oldPass,newPass,confirmPass} = req.body;

       try {

        if(!oldPass || !newPass || !confirmPass){
            
            validate(req, res, "All Fields are required!.", "/password");

        }else{

            const matchOldPass = bcryptjs.compareSync(oldPass,req.session.user.password);

            if(!matchOldPass){
                validate(req, res, "Old Password not match! Try Again.", "/password");

            }else{

                if(newPass != confirmPass){
                    validate(req, res, "Confirm Password not match! Try Again.", "/password");

                }else{

                    await User.findByIdAndUpdate(req.session.user._id,{password : makeHash(confirmPass)});

                    req.session.user = await User.findById(req.session.user._id);

                    validate(req, res, "Password Change Successful.", "/password", "#4a930d");

                }

            }
            
        }

       } catch (error) {
        validate(req, res, error.message, "/password");

       }
};

/**
 * @desc profile edit page
 * @name GET /profile-edit
 * @access public
 */
export const editPage = (req, res) => {
    res.render("edit");
};

/**
 * @desc profile edit data
 * @name POST /profile-edit
 * @access public
 */
export const editPageData = async (req, res) => {
    const { name, email, username, phone, age, gender } = req.body;

    try {
        if (!name || !email) {
            validate(req, res, "Name and Email required!.", "/profile-edit");
        } else {
            await User.findByIdAndUpdate(req.session.user._id, { name: name });
            await User.findByIdAndUpdate(req.session.user._id, { email: email });
            await User.findByIdAndUpdate(req.session.user._id, { username: username });
            await User.findByIdAndUpdate(req.session.user._id, { phone: phone });
            await User.findByIdAndUpdate(req.session.user._id, { age: age });
            await User.findByIdAndUpdate(req.session.user._id, { gender: gender });

            req.session.user = await User.findById(req.session.user._id);

            validate(req, res, "Profile Updated Successfully.", "/profile-edit", "#4a930d");
        }
    } catch (error) {
        validate(req, res, error.message, "/profile-edit");
    }
};


/**
 * @desc Request for email for reset
 * @name GET /forget-email-send
 * @access public
 */
export const forgetEmailRequest = async (req, res) => {
    res.render('forgetEmail');
};


/**
 * @desc Get email for reset
 * @name GET /forget-email-send
 * @access public
 */
export const forgetEmailRequestPost = async (req, res) => {

    const {email} = req.body;

  try {

    if(!email){
        validate(req, res, "This fields are required!.", "/forget-email-send");

    }else{

        const isEmail = await User.findOne({email :email});

        if(!isEmail){
            validate(req, res, "Email doest not exists!", "/forget-email-send");

        }else{
            const name = isEmail.name;

            const token = jwt.sign({id : isEmail._id},process.env.JWT_SECRET,{expiresIn : '60s'})

            const link = `${process.env.APP_URL}:${process.env.PORT}/forgetToken/${token}`;

            emailSend(email,{name,email,link});

            validate(req, res, "Email Sent Successfully.Check Inbox.", "/forget-email-send", "#4a930d");

        }
        

    }

  } catch (error) {
    validate(req, res, error.message, "/forget-email-send");

  }
};

/**
 * @desc forget token verify
 * @name GET /forgetToken/:token
 * @access public
 */
export const forgetTokenVerify = async (req,res)=>{

    const {token} = req.params

    try {

        const checkToken =  verifyToken(token);


        if(!checkToken){
            delete req.session.userId
            validate(req, res, 'Invalid Token! Try Again.', "/forget-email-send");

        }else{

                req.session.userId = checkToken.id;
                validate(req, res, "Please set your Password.", "/forget-password", "#4a930d");


        }

    } catch (error) {
        delete req.session.userId
        validate(req, res, "Token link has been expired! Try Again.", "/forget-email-send");
    }
}


/**
 * @desc Forget Password Page
 * @name GET /forget-password
 * @access public
 */
export const forgetPassPage = (req,res)=>{
    res.render('forgetPass');
}

/**
 * @desc Forget Password Post
 * @name POST /forget-password
 * @access public
 */
export const forgetPassPost = async (req,res)=>{

    const {forgetNewPass,forgetConfirmPass} = req.body;

   try {

    if(!forgetNewPass || !forgetConfirmPass){

        validate(req, res, "All Fields are required!", "/forget-password", "#4a930d");

    }else{
        if(forgetNewPass != forgetConfirmPass){
            validate(req, res, "Confirm Password not match!", "/forget-password");

        }else{

            await User.findByIdAndUpdate(req.session.userId,{password : makeHash(forgetConfirmPass)})
           
            delete req.session.userId
           
            validate(req, res, "Password Change Successfully.Now Login.", "/login", "#4a930d");

        }
    }

   } catch (error) {
    validate(req,res,error.message,'/forget-password');
   }


}

/**
 * @desc Find Friends Page
 * @name GET /find-friends
 * @access public
 */
export const fineFriendsPage = async (req,res)=>{

    try {

        const friends  = await User.find().where('email').ne(req.session.user.email);

        res.render('friends',{friends});

    } catch (error) {
        validate(req,res,error.message,'/find-friends')
    }
};

/**
 * @desc Find Friends profile Page
 * @name GET /:id
 * @access public
 */
export const userProfileData = async (req,res)=>{

    try {
        const {id} = req.params;

        const profile = await User.findById(id);

        res.render('friendProfile',{profile})


    } catch (error) {
        console.log(error.message);
    }

}

/**
 * @desc Follow a user
 * @name GET /follow/:id
 * @access public
 */
export const followUser = async (req,res)=>{

    try {
        
        const {id} = req.params;

        await User.findByIdAndUpdate(req.session.user._id,{$push : {following : id}});

        await User.findByIdAndUpdate(id,{$push : {follower : req.session.user._id}})

        req.session.user.following.push(id);

        validate(req,res,"Follow Done",'/find-friends','#4a930d');

    } catch (error) {
        console.log(error.message);
    }

}

/**
 * @desc Unfollow a user
 * @name GET /unfollow/:id
 * @access public
 */
export const unfollowUser = async (req,res)=>{

    try {
        
        const {id} = req.params;

        await User.findByIdAndUpdate(req.session.user._id,{$pull : {following : id}});
        await User.findByIdAndUpdate(id,{$pull : {follower : req.session.user._id}})


        let updateFollowingList = req.session.user.following.filter(data => data != id);

        req.session.user.following = updateFollowingList;

        validate(req,res,"Unfollow Done",'/find-friends');

    } catch (error) {
        console.log(error.message);
    }

}


/**
 * @desc my follower Page
 * @name GET /my-followers
 * @access public
 */
export const myFollowers = async (req,res)=>{
    try {

        const myFollowerPopulate = await User.findById(req.session.user._id).populate('follower');

        res.render('myFollowers',{myFollowerPopulate});

    } catch (error) {
        console.log(error.message);
    }
}

/**
 * @desc my follower Page
 * @name GET /my-following
 * @access public
 */
export const myFollowing = async (req,res)=>{
    try {

        const myFollowingPopulate = await User.findById(req.session.user._id).populate('following');

        res.render('myFollowing',{myFollowingPopulate});

    } catch (error) {
        console.log(error.message);
    }
}

/**
 * @desc friend follower page
 * @name GET /:id/friend-followers
 * @access public
 */
 export const friendFollowers = async (req,res)=>{
    try {

        const {id} = req.params

        const profile = await User.findById(id);
        console.log(profile);
        // const myFollowerPopulate = await User.findById(req.session.user._id).populate('follower');

        res.render('friendFollower',{profile});

    } catch (error) {
        console.log(error.message);
    }
}
