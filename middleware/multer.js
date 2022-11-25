import multer from 'multer';
import path, { resolve } from 'path';
const __dirname = resolve();


//multer config
const storage = multer.diskStorage({

    destination : (req,file,cb)=>{

        if(file.fieldname == 'profile'){

            cb(null,path.join(__dirname,'/public/media/user_profile'))
        }

        try {
            if(file.fieldname == 'gallery'){
                cb("You can Upload maximum 3 Photo!",path.join(__dirname,'/public/media/gallery'))
            }

        } catch (error) {
            console.log(error.message);
        }

    

    },
    filename : (req,file,cb) => {
        cb(null, Date.now() +'_' + file.originalname);
    }
});

export const profilePhotoMulter = multer({
    storage
}).fields([
    {
        name : "profile",
        maxCount : 1
    }
])

export const galleryPhotoMulter = multer({
    storage
}).array('gallery',3)


