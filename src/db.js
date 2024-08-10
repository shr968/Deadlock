const mongoose = require('mongoose');
const MONGODB_URL='mongodb+srv://shreyanayakb26:shreyamongodb%4026@cluster0.ecrwf.mongodb.net/';
mongoose.connect(MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
const db=mongoose.connection;
db.on('connected',()=>{
    console.log('Database is connected');
});
db.on('disconnected',()=>{
    console.log('Database disconnected');
});
db.on('error',(err)=>{
    console.log(err);
});
module.exports=db;