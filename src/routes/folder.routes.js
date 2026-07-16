import { Router } from "express";
import { changeFolderNote, createNewFolder, deleteFolder, getFolderTodos, getUserFolders } from "../controllers/folder.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()


router.route('/newFolder').post(verifyJWT,createNewFolder)

router.route('/changeNote').post(verifyJWT,changeFolderNote)

router.route('/deleteFolder/:folder_id').get(verifyJWT,deleteFolder)

router.route('/userFolders').get(verifyJWT,getUserFolders)

router.route('/:folder_id/todos').get(verifyJWT,getFolderTodos)


export default router