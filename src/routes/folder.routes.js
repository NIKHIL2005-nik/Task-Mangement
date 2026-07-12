import { Router } from "express";
import { createNewFolder } from "../controllers/folder.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route('/newFolder').post(verifyJWT,createNewFolder)


export default router