import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { addTodo } from '../controllers/todo.controller.js'


const router = Router()

router.route('/addTodo').post(verifyJWT,addTodo)

export default router