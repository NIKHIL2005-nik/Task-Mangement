import mongoose,{Schema,model} from "mongoose"

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


export const User = model("User",userSchema)