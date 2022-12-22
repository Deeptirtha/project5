const express = require("express");
const route = require("./route/route");
const mongoose = require("mongoose");
 const app = express();
 app.use(express.json());
 const multer = require("multer")
app.use(multer().any())
mongoose.set('strictQuery', true);
 mongoose
  .connect(
    "mongodb+srv://DeeptirthaMukherjee:QYKI3k8QSKC4I7FZ@cluster1.khatgm1.mongodb.net/project5-db?retryWrites=true&w=majority",
    { UseNewUrlParser: true }
  )
  .then(() => console.log("Mongo-Db is connected"))
  .catch((err) => console.log(err.message))

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("listening at " + (process.env.PORT || 3000))})