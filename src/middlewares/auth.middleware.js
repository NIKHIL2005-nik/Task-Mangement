import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";


const verifyJWT = asyncHandler(async (req,res,next) => {
    const accessToken = req.cookies?.accessToken

    if(!accessToken){
        throw new ApiError(401,"unauthorised request !!")
    }

    try {
        const decodedToken = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET) 

        const user = await User.findById(decodedToken._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401,"invalid access token !!")
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401,error.message || "invalid access token !!")
    }
})

export {verifyJWT}