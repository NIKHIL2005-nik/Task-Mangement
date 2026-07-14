import { Router } from "express";
import { changeFolderNote, createNewFolder } from "../controllers/folder.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route('/newFolder').post(verifyJWT,createNewFolder)

router.route('/changeNote').post(verifyJWT,changeFolderNote)


export default router