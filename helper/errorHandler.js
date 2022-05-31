const errorHandler =( error, res, next )=>{
    res.status(200).json(error)
    next && next()
}
module.exports = errorHandler