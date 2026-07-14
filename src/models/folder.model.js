import mongoose,{Schema,model} from "mongoose";


const folderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    folder_name: {
        type: String,
        lowercase: true,
        trim: true,
        required: true
    },
    note: {
        type: String,
        lowercase: true,
        trim: true,
        default: ""
    }
},{timestamps: true})



export const Folder = model('Folder',folderSchema)