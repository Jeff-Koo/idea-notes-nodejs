// create model according to mogoose structure

import mongoose from "mongoose";
const {Schema} = mongoose;

const UserSchema = new Schema( { 
    name: {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    }, 
    password : {
        type : String,
        required : true,
    },
    avatar : {
        data: {
            type : Buffer,  // user Buffer to store the data of image in Base64
        }, 
        contentType: {
            type : String,
        }
    },
});

const User = mongoose.model("users", UserSchema);


export default User;