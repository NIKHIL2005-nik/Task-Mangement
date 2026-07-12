import { User } from "../models/user.model.js";
import express from "express"
import { asyncHandler } from "../utils/asyncHandler.js"; 
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (user_id) => {
    const user = await User.findById(user_id)

    if(!user){
        throw new ApiError(401,"user not found !!")
    }

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken,refreshToken}
}

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

    const createdUser = await User.findById(user?._id).select("-password -refreshToken")

    if(!createdUser){
         throw new ApiError(401,"registered user not found !!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
})

const loginUser = asyncHandler(async (req,res) => {

    const {email,password} = req?.body

    if(
        [email,password].some((field) => field.trim() === "") || (!email || !password)
    ){
        throw new ApiError(401,"email and password are required !!")
    }

    const existingUser = await User.findOne({email})

    if(!existingUser){
        throw new ApiError(401,"User with given credentials does not exists !!")
    }

    const isPasswordCorrect = await existingUser.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        throw new ApiError(401,"invalid password !!")
    }
    
    const {refreshToken,accessToken} = await generateAccessAndRefreshToken(existingUser._id)

    const loggedInUser = await User.findById(existingUser._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure: true,
        sameSite: 'strict',
        maxAge: Number(process.env.COOKIES_EXPIRY)
    }

    return res.status(200)
    .cookie("refreshToken",refreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
            },
            "User login success"
        )
    )
})

const logoutUser = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
           $unset: {
                refreshToken : ""
           }
        },
        {
            new : true
        }
    )

    const options = {
        httpOnly : true,
        secure: true,
        sameSite: 'strict',
        maxAge: Number(process.env.COOKIES_EXPIRY)
    }

    return res
    .status(200)
    .clearCookie("refreshToken",options)
    .clearCookie("accessToken",options)
    .json(
        new ApiResponse(200,{},"User logged out successfully")
    )
})



export {
    registerUser,
    loginUser,
    logoutUser
}