const { message, errorHandler } = require('../helper');
const { verifyAccessToken } = require('../helper/jwt_helper');
const { notFound } = message

const useRouter = app => {
    
    //calling routes
    app.use('/auth', require('./auth'))
    app.use('/user',  require('./user'));
    app.use('/packageType',verifyAccessToken, require('./packageType'))
    app.use('/package', verifyAccessToken,  require('./package'))
    app.use('/workout', verifyAccessToken,  require('./workout'))
    app.use('/trainer',  require('./trainer'))
    app.use('/timeslot',  require('./timeslot'))
    app.use('/payment', verifyAccessToken,  require('./payment'))
    
    app.use('/media', verifyAccessToken, require('./media'))
    //handle unknown routes
    app.use((req, res) => errorHandler(notFound, res));
}
module.exports = useRouter