import app from "./src/app.js";
import connectDB from "./src/db/index.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
})

const Port = process.env.PORT || 5000;

connectDB()
.then(() =>{
   app.listen(Port, () => {
      console.log(`Server is Listening on PORT http://localhost:${Port}`);
   })
})
.catch(() => {
    console.log(`DB Error ${console.error()}`);
});