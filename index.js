import express from "express";
import connectToMongo from "./db.js";
import eventsapi from "./routes/eventsapi.js";
import workshopsapi from "./routes/workshopsapi.js";
import competitionsapi from "./routes/competitionsapi.js"
import storesapi from "./routes/storesapi.js"
import bodyParser from "body-parser";
import auth from "./routes/auth.js";
import speakersapi from "./routes/speakersapi.js";
import cors from "cors";
import path from "path";
const app = express();
const port = process.env.PORT||5000;

app.use(cors())
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "build"))); 
connectToMongo();

app.use("/events", eventsapi);
app.use("/workshops", workshopsapi);
app.use("/competitions",competitionsapi);
app.use("/stores",storesapi);
app.use("/admin",auth);
app.use("/speaker",speakersapi);
app.listen(port, () => {
    console.log(`Techfest backend listening from port ${port}`);
})