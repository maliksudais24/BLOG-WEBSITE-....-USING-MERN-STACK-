import express from "express"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

// Define __dirname FIRST (required for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// NOW load dotenv
dotenv.config({ path: path.join(__dirname, '.env') })

import { connectdb } from "./dbconnection.js"
import cors from "cors"
import cookieParser from "cookie-parser";

import userrouter from "./routes/userroute.js"
import blogrouter from "./routes/blogroute.js"
import categoryrouter from "./routes/categoryroute.js"
import commentrouter from "./routes/commentroute.js"
import likerouter from "./routes/likeroute.js"


const app = express()
const port = process.env.PORT || 3000

app.use(cors({
    origin : "http://localhost:5173" ,
    credentials:true
}))
app.use(express.json({limit:"20kb"}))
app.use(express.urlencoded({extended :true,limit:"20kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/user",userrouter)
app.use("/blog",blogrouter)
app.use("/category",categoryrouter)
app.use("/comment",commentrouter)
app.use("/like",likerouter)

connectdb()
  .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });
