const dotenv = require("dotenv");
const mongoose = require("mongoose");
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
app.listen(process.env.PORT, () => {
  if (process.env.NODE_ENV == "dev") {
    console.log(`App Running In Dev Mode on port ${process.env.PORT}`);
  } else {
    console.log(`App Running on port ${process.env.PORT}`);
  }
});
