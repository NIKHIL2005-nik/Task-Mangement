import { User } from "../models/user.model.js";
import express from "express"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Folder } from "../models/folder.model.js";
import { Todo } from "../models/todo.model.js";

const generateAccessAndRefreshToken = async (user_id) => {
    const user = await User.findById(user_id)

    if (!user) {
        throw new ApiError(401, "user not found !!")
    }

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if (
        [username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(401, "All fields are required to register !!")
    }

    const existedUser = await User.findOne({ email })

    if (existedUser) {
        throw new ApiError(401, "user with given credentials already exists !!")
    }


    const user = await User.create({
        username, email, password
    })

    if (!user) {
        throw new ApiError(401, "User registration failure !!")
    }

    const createdUser = await User.findById(user?._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(401, "registered user not found !!")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, createdUser, "user registered successfully")
        )
})

const loginUser = asyncHandler(async (req, res) => {

    const { email, password } = req?.body

    if (
        [email, password].some((field) => field.trim() === "") || (!email || !password)
    ) {
        throw new ApiError(401, "email and password are required !!")
    }

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
        throw new ApiError(401, "User with given credentials does not exists !!")
    }

    const isPasswordCorrect = await existingUser.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "invalid password !!")
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshToken(existingUser._id)

    const loggedInUser = await User.findById(existingUser._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: Number(process.env.COOKIES_EXPIRY)
    }

    return res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
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

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: ""
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: Number(process.env.COOKIES_EXPIRY)
    }

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("accessToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        )
})

const changePassword = asyncHandler(async (req, res) => {

    const user_id = req.user?._id

    const { old_password, new_password } = req.body

    const user = await User.findById(user_id)

    if (
        [old_password, new_password].some((field) => field.trim() === "")
    ) {
        throw new ApiError(401, "both old and new passwords are required !!")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(old_password)

    if (!isPasswordCorrect) {
        throw new ApiError(402, "invalid old password !!")
    }

    user.password = new_password
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(
            new ApiResponse(200,
                {},
                "user password changed successfully"
            )
        )
})

const getUserProfile = asyncHandler(async (req, res) => {
    // NOTE: mongoose do not let the fields not in the schema to be added to any of it's instance so we need to create the another object here to send the response.
    const user_data = req.user
    const response = {
        username: user_data.username,
        email: user_data.email,
        createdAt: user_data.createdAt,
        updatedAt: user_data.updatedAt
    }

    const folders_count = await Folder.countDocuments({ user_id: user_data?._id })
    const todos_count = await Todo.countDocuments({ user_id: user_data?._id })
    const pendingTodos_count = await Todo.countDocuments({
        $and: [{ user_id: user_data?._id }, { completed: false }]
    })

    response.folders_count = folders_count
    response.todos = {
        total: todos_count,
        pending: pendingTodos_count,
        completed: todos_count - pendingTodos_count
    }

    return res.status(200)
        .json(
            new ApiResponse(200,
                response,
                "user profile fetched successfully"
            )
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const cookie_refreshToken = req.cookies?.refreshToken    

    if (!cookie_refreshToken) {
        throw new ApiError(401,
            "invalid refresh token !!"
        )
    }

    try {
        const decoded_refreshToken = await jwt.verify(cookie_refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decoded_refreshToken?._id)

        // HTTP status codes below 400 are not considered errors by Express.
        if (!user) {
            throw new ApiError(401,
                "invalid refresh token !!"
            )
        }

        if (!(cookie_refreshToken === user.refreshToken)) {
            throw new ApiError(401, "invalid refresh token !!")
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: Number(process.env.COOKIES_EXPIRY)
        }

        const { refreshToken, accessToken } = await generateAccessAndRefreshToken(user?._id)

        return res.status(200)
            .cookie("refreshToken", refreshToken, options)
            .cookie("accessToken", accessToken, options)
            .json(
                new ApiResponse(200,
                    {refreshToken,accessToken},
                    "access and refresh token refreshed successfully"
                )
            )

    } catch (error) {
        throw new ApiError(401,error.message || "something went wrong !!")
    }

})





export {
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    getUserProfile,
    refreshAccessToken
}