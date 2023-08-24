const dotenv = require("dotenv");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const cors = require("cors");
dotenv.config({ path: "./config/config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

// DB CONNECT
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DB Connected.");
  })
  .catch((err) => {
    console.log(err);
  });

// IMPORT AND START APP
const app = require("./app");
let server = app.listen(process.env.PORT, () => {
  if (process.env.NODE_ENV == "dev") {
    console.log(`App Running In Dev Mode on port ${process.env.PORT}`);
  } else {
    console.log(`App Running on port ${process.env.PORT}`);
  }
});

const io = require("./socket")(server);
app.set("io", io);

module.exports = app;
