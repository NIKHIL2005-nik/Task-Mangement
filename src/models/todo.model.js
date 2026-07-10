import mongoose,{Schema,model} from "mongoose";

const todoSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    folder_id: {
        type: Schema.Types.ObjectId,
        ref: "Folder"
    },
    todo: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    expiry: {
        type: Date,
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['high','medium','low'],
        default: 'medium'
    }
},{timestamps: true})



export const Todo = model("Todo",todoSchema)