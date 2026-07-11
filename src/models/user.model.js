import mongoose,{Schema,model} from "mongoose"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "password is required"]
    },
    todo_history: [
        {
            type: Schema.Types.ObjectId,
            ref: "Todo"
        }
    ],
    refreshToken: {
        type: String,
    }
},{timestamps: true})

userSchema.pre('save', async function() {
    if(!this.isModified('password')) return 
    this.password = await bcrypt.hash(this.password,10)
})


userSchema.methods.isPasswordCorrect = async function(password) {
    const flag = await bcrypt.compare(password,this.password)
    return flag
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = model("User",userSchema)