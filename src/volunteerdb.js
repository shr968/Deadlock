const mongoose = require('mongoose');
// const mongourl = 'mongodb://127.0.0.1:27017/volunteer';
const mongourl = 'mongodb+srv://shreyanayakb26:shreyamongodb%4026@cluster0.ecrwf.mongodb.net/volunteer?retryWrites=true&w=majority'
mongoose.connect(mongourl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db1 = mongoose.connection;

db1.on('connected', () => {
    console.log('Database connected');
});

db1.on('disconnected', () => {
    console.log('Database disconnected');
});

db1.on('error', (err) => {
    console.error('Database connection error:', err);
});

module.exports = db1;
