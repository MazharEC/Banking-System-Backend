const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")



const userSchema = mongoose.Schema({
    email:{
        type:String,
        require: [true, "Email is required for creating a user"],
        trim: true,
        lowercase: true,
        match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid Email address" ],
        unique: [true, "Email already exist."]
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        minlength: [2, "Name should contain at least 2 characters"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password should contain at least 6 characters"],
        select: false
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function (){

    if(!this.isModified("password")){
        return next()
    }
    const hash  = await bcrypt.hash(this.password, 10)
    this.password = hash

    return
})

userSchema.methods.comparePassword = async function (password){
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user", userSchema)

module.exports = userModel