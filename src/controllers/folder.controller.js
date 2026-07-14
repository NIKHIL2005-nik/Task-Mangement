import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Folder } from "../models/folder.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";




const createNewFolder = asyncHandler(async (req,res) => {
    const user_id = req.user?._id    

    const {folder_name,note} = req.body

    if(!folder_name || folder_name.trim() === ""){
        throw new ApiError(401,"folder name is required")
    }

    const existingFolder = await Folder.findOne({
        $and : [{user_id},{folder_name}]
    })

    if(existingFolder){
        throw new ApiError(401,"Folder with this name already exists !!")
    }

    const folder = await Folder.create({
        user_id,folder_name,note
    })

    if(!folder){
        throw new ApiError(401,"unable to create new folder !!")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,
            folder,
            "new folder created successfully"
        )
    )
})

const changeFolderNote = asyncHandler(async (req,res) => {

    const {folder_id,note} = req.body

    const folder = await Folder.findById(folder_id)

    if(!folder){
        throw new ApiError(401,"Folder does not exists !!")
    }

    folder.note = note
    folder.save({validateBeforeSave: false})

    return res.status(200)
    .json(
        new ApiResponse(200,
            folder,
            "folder note changed successfully"
        )
    )
})

const deleteFolder = asyncHandler(async (req,res) => {
    //later
})

export {
    createNewFolder,
    changeFolderNote
}