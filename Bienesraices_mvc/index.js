import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'
import propertyRoutes from './routes/propertyRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import db from './config/db.js'

//Create the app
const app = express()

//Enable form data reader
app.use( express.urlencoded({extended: true}) )

//Enable Cookie Parser
app.use( cookieParser() )

//Enable CSRF
app.use( csrf({cookie: true}))

//Database connection
try {
    await db.authenticate();
    db.sync()
    console.log('Success connection to the database')

} catch (error) {
    console.log(error)
}

//Routing
app.use('/', appRoutes)
app.use('/', propertyRoutes)
app.use('/api', apiRoutes)
app.use('/auth', userRoutes)

//Enable pug
app.set('view engine', 'pug')
app.set('views', './views')

//public folder
app.use( express.static('public'))

//Define a port and start the project
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`The server is working in the port ${port}`)
});