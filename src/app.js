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


export {app}
