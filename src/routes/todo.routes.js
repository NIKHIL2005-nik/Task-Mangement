import {Router} from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { addTodo, changeTodoPriority, deleteTodo, markAsCompleted } from '../controllers/todo.controller.js'


const router = Router()

router.route('/addTodo').post(verifyJWT,addTodo)

router.route('/deleteTodo/:todo_id').get(verifyJWT,deleteTodo)

router.route('/update/markAsCompleted/:todo_id').get(verifyJWT,markAsCompleted)

router.route('/update/changePriority').post(verifyJWT,changeTodoPriority)

export default router