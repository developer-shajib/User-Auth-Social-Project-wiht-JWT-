import mongoose from "mongoose";


// //create schema
const userSchema = mongoose.Schema({
    name : {
        type : String,
        trim : true,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    username :{
        type : String,
        trim : true

    },
    phone : {
        type : String,
        trim : true
    },
    skill : {
        type : String,
        trim : true,
        enum : ["MERN Stack", "PHP","Python","C#","C++","ML"]
    },
    age : {
        type : Number,
        trim : true
    },
    gender : {
        type : String,
        trim : true,
        enum : ["Male","Female"]
    },
    photo : {
        type : String,
        trim : true
    },
    gallery : {
        type : Array,
        trim : true
    },
    follower : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "User",
    },
    following : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "User",
    },
    password : {
        type : String,
        required : true,
        trim : true

    },
    accessToken : {
        type : String,
        trim : true
    },
    isActivate : {
        type : Boolean,
        trim : true,
        default : false
    },
    isAdmin : {
        type : Boolean,
        default : true
    }
},{
    timestamps : true
})


//create Collection
export default mongoose.model('User',userSchema);



