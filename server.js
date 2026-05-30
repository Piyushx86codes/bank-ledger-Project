const app = require("./src/app");
const connectToDb = require("./src/config/db.js");


require("dotenv").config();
const PORT = process.env.PORT;
connectToDb();

app.listen(PORT,()=>{
    console.log(`App is Active and Running on PORT No:${PORT}`);
})