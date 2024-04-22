// create model according to mongoose structure
// create schema object with props.

import mongoose from "mongoose";
const {Schema} = mongoose;

const IdeaSchema = new Schema( { 
    title: {
        type : String,
        required : true,
    },
    details : {
        type : String,
        required : true,
    },
    /** 1. */
    userID : {
        // set type to be _id in mongoDB
        type : mongoose.Types.ObjectId,
        
        /** 7. */
        required : true,
        /** end of 7. */
    },
    /** end of 1. */
    date : {
        type : Date,
        default : Date.now,
    },
} );

const Idea = mongoose.model("ideas", IdeaSchema);

// module.exports = Idea;

export default Idea;