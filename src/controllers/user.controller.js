import { User } from "../models/user.model.js";
import express from "express"
import { asyncHandler } from "../utils/asyncHandler.js"; 
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const registerUser = asyncHandler(async (req,res) => {
    const {username,email,password} = req.body

    if(
        [username,email,password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(401,"All fields are required to register !!")
    }

    const existedUser = await User.findOne({email})

    if(existedUser){
        throw new ApiError(401,"user with given credentials already exists !!")
    }


    const user = await User.create({
        username,email,password
    })

    if(!user){
        throw new ApiError(401,"User registration failure !!")
    }

    const createdUser = await User.findById(user?._id)

    if(!createdUser){
         throw new ApiError(401,"registered user not found !!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
})



export {
    registerUser
}