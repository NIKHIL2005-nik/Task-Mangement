import mongoose,{Schema,model} from "mongoose";


const folderSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    folder_name: {
        type: String,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        lowercase: true,
        trim: true
    }
},{timestamps: true})



export default Folder = model('Folder',folderSchema)