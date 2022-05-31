const redis = require('redis')

const client = redis.createClient({
    port: 6379,
    host: "127.0.0.1"
})

client.on('connect', () => {
    console.log("client connected to redis")
})

client.on('error', (err) => {
    console.log(`Redis Error: \n Reason: ${err.message}`)
})

client.on('ready', () => {
    console.log("client connected to redis and ready to use")
})

client.on('end', () => {
    console.log("client connection has disconnected from redis")
})

// quit redis when we terminate or stop server
process.on('SIGINT', () =>{
    client.quit()
})

module.exports = client