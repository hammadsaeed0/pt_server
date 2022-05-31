const mongoose = require('mongoose')
const { mongoDB_URI } = require('./index')

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(mongoDB_URI, {
            useUnifiedTopology: true,
            useNewURLParser: true
        })
        if (connection) {
            console.log('Mongo DB is connected')
        }

    } catch (error) {
        console.log('Mongo DB connection failed')
    }

}
mongoose.connection.on('connected', () => {
    console.log('Mongoose conencted to db')
})

mongoose.connection.on('error', (err) => {
    console.log("Mongo db connection Failed: \n Reason:", err.message)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected')
})

// this function triggers when we press ctrl+Z to stop the server
// so it will await to stop the db connection and then close the server
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('application close');
    process.exit(0);
})
module.exports = connectDB