import mongoose,{Schema,model} from "mongoose"
import bcrypt from 'bcrypt'

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


export const User = model("User",userSchema)