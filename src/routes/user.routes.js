import { Router } from "express";
import { changePassword, getUserProfile, loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

router.route('/logout').post(verifyJWT,logoutUser)

router.route('/refreshTokens').get(refreshAccessToken)

router.route('/changePassword').post(verifyJWT,changePassword)

router.route('/getUserProfile').get(verifyJWT,getUserProfile)

export default router