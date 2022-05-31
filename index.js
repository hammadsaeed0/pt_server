const express = require('express')
const config = require('./config')
const connectDB = require('./config/db')
const cors = require('cors')
const useRouter = require('./route')
const morgan = require('morgan')

//express instance
const app = express()

//allowing cors
app.use(cors())

//to access request body we used express.json() middleware. It is available in Express v4.160 onwards.
app.use(express.json())




//to access url-encoded request body we used express.urlencoded()
app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))
//app instance is passing in useRouter
// so that we can call routes moule based 
// and pass it to app.use 
useRouter(app)


// request logger 
app.use(morgan('dev'))


connectDB()
app.listen(process.env.PORT || config.PORT, () =>  console.log('Server is running'))

