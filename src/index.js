import dotenv from 'dotenv'
import { connectDB } from './db/connectDB.js'
import { app } from './app.js'

dotenv.config({path : './.env'})


connectDB()
.then(()=>{
    const port = process.env.PORT || 4000
    app.listen(port, () => {
        console.log(`app is listening on the port : ${port}`)
    })
})




