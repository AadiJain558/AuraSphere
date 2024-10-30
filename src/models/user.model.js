import mongoose from "mongoose"
import bcrypt from "bcryptjs"
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    studyGroups: [
        { type: mongoose.Schema.Types.ObjectId, ref: "StudyGroup" }
    ],
    virtualRooms: [
        { type: mongoose.Schema.Types.ObjectId, ref: "VirtualRoom" }
    ],
    password: {
        type: String,
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    profilePicture: {
        type: String,
        default: "www.lobstertube.com"
    },
    aurapoints: {
        type: Number,
        default: 0
    },
    department: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Dept"
    },
    year: {
        type: Number,
        default: 2000
    },
    badges: {
        type: Array,
        default: []
    },
    dueassignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment"
    }],
    completedassignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment"
    }],
    attendance: {
        type: Array,
        default: []
    },
    rank: {
        type: Number,
        default: 10000
    },

})
// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
export const User = mongoose.model("User", userSchema)