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
    date : {
        type : Date,
        default : Date.now,
    },
} );

const Idea = mongoose.model("ideas", IdeaSchema);

// module.exports = Idea;

export default Idea;