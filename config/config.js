const config = {
    port: process.env.PORT || 3000,
    mongoUrl: process.env.MONGO_URI,
    secret: process.env.SECRET
};

module.exports = config;
