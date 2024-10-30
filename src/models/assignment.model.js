import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema({
    assignedto:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    title:{
        type:String,
        required:true,
    },
    department:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Dept",
    },
    description:{
        type:String,
        required:true,
    },
    duedate:{
        type:Date,
        required:true,
    },
    completed:{
        type:Boolean,
        default:false,
    },
    completeddate:{
        type:Date,
    },
    points:{
        type:Number,
        required:true,
        default: 0,
    },
    comments:{
        type:String,
    },
    attachment:{
        type:String,
    },
},
{timestamps: true})
export const Assignment = mongoose.model("Assignment", assignmentSchema);