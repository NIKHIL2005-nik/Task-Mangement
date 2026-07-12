import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Folder } from "../models/folder.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";




const createNewFolder = asyncHandler(async (req,res) => {
    const user_id = req.user?._id    

    const {folder_name,description} = req.body

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
        user_id,folder_name,description
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

export {
    createNewFolder
}