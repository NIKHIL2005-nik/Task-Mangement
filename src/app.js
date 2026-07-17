import express from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true // to allow cookies and the authorisation headers.
}))
app.use(cookieParser())

app.use(express.json({limit: '16kb'})) // for the data in the express we send in json format and to parse it in the req.body, without this middleware the data is not parsed in the req.body
app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}))
app.use(express.static('public'))



// user router and routes
import userRoutes from '../src/routes/user.routes.js'
app.use('/api/v1/user',userRoutes)


// folder routes
import folderRoutes from '../src/routes/folder.routes.js'
app.use('/api/v1/folder',folderRoutes)


// todo routes
import todoRoutes from '../src/routes/todo.routes.js'
app.use('/api/v1/todo',todoRoutes)

app.use((err,req,res,next) => {
    res.status(err.statuscode || 500).json(
        {
            statusCode: err.statuscode || 500,
            message: err.message || "something went wrong !!",
            success: err.success || false
        }
    )
})

export {app}
