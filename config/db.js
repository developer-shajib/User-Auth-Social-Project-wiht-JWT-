import mongoose from "mongoose";

//mongoose connection
export const mongoDBConnect = async ()=>{

    try {
        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MONGODB Connected Successful`.bgBlue);
        
    } catch (error) {
        console.log(error.message);
    }
}





