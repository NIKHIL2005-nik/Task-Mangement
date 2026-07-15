import { Folder } from "../models/folder.model.js";
import { Todo } from "../models/todo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";




const addTodo = asyncHandler(async (req,res) => {

    const user_id = req.user?._id

    const {folder_id,todo,expiry,priority} = req.body

    if(
        [folder_id,todo,expiry].some((field) => field.trim() === "")
    ){
        throw new ApiError(401,"all fields are required !!")
    }

    const folder = await Folder.findById(folder_id)

    if(!folder){
        throw new ApiError(401,"no such folder exists !!")
    }

    const existing_todo = await Todo.findOne({
        $and : [{user_id},{folder_id},{todo}]
    })

    if(existing_todo){
        throw new ApiError(401,"todo already exists !!")
    }

    const createdTodo = await Todo.create({
        user_id,folder_id,todo,expiry,priority
    })

    if(!todo){
        throw new ApiError(401,"unable to add todo !!")
    }


    return res.status(200)
    .json(
        new ApiResponse(200,
            createdTodo,
            "todo added successfully"
        )
    )
})

const deleteTodo = asyncHandler(async (req,res) => {
    const todo_id = req.params?.todo_id

    if(!todo_id){
        throw new ApiError(401,"todo id is required !!")
    }

    const deletedTodo = await Todo.findByIdAndDelete(todo_id)

    if(!deletedTodo){
        throw new ApiError(401,"no such todo exists !!")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,
            deletedTodo,
            "todo deleted successfully"
        )
    )
})

// change todo info
const markAsCompleted = asyncHandler(async (req,res) => {
    const todo_id = req.params?.todo_id

    if(!todo_id){
        throw new ApiError(401,"todo id is required !!")
    }

    const todo = await Todo.findByIdAndUpdate(
        todo_id,
        {
            $set: {
                completed: true
            }
        },
        {
            new: true
        }
    )

    if(!todo){
        throw new ApiError(401,"invalid todo id !!")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,{},"todo marked as completed successfully")
    )

})

const changeTodoPriority = asyncHandler(async (req,res) => {
    const {todo_id,new_priority} = req.body

    if(!todo_id || todo_id?.trim() == ""){
        throw new ApiError(401,"todo id is required !!")
    }

    // findByIdAndUpdate does not by default run the field validators in the schema.
    const todo = await Todo.findByIdAndUpdate(
        todo_id,
        {
            $set: {
                priority: new_priority
            }
        },
        {
            new: true,
            runValidators: true
        }
    )

    if(!todo){
        throw new ApiError(401,"invalid todo id !!")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,{},"priority of todo changed successfully")
    )

})



export {
    addTodo,
    deleteTodo,
    markAsCompleted,
    changeTodoPriority
}