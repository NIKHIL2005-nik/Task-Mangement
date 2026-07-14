import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { addTodo, deleteTodo } from '../controllers/todo.controller.js'


const router = Router()

router.route('/addTodo').post(verifyJWT,addTodo)

router.route('/deleteTodo/:todo_id').get(deleteTodo)

export default router