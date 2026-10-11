const config = require('./config/config');
const app = require('./app');
const connectDB = require('./config/db');
const { verifySmtpConnection } = require('./config/nodeMailer');

connectDB().then(()=>{
    app.listen(config.port, ()=>{
        console.log(`Server is running on port ${config.port} in ${config.nodeEnv} mode`);
    });

    verifySmtpConnection();
}).catch((error)=> {
    console.error('Error starting the server:', error);
    process.exit(1);
});

