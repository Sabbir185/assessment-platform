// internal import
const app = require("./app");

// external import
const mongoose = require("mongoose");


mongoose.connect(process.env.DATABASE)
.then(()=> console.log('Database connection successful!'))
.catch(err => console.log(err))


// server
const port = process.env.PORT || 8080;
app.listen(port, ()=> {
    console.log(`Port is listening ${port}`)
})
