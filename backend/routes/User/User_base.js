const userRoutes = require('./User');
const oAuthRouter = require('./oauth');
const AuthReqRouter = require('./authReq');

module.exports = (app) => {
    app.use('/api/users', userRoutes);
    app.use('/oauth', oAuthRouter);
    app.use('/auth-req', AuthReqRouter);
};
