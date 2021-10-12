require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const signupRouter = require("./routers/signupRouter");
const loginRouter = require("./routers/loginRouter");
const logoutRouter = require("./routers/logoutRouter");
const deviceRouter = require("./routers/devicesRouter")

const app = express();
app.set("port", process.env.PORT || 5000);

const corsOptions = {
  credentials: true,
  // origin: "domainname"
};

app
  .use(cookieParser())
  .use(cors(corsOptions))
  .use(express.urlencoded({ extended: true }))
  .use(express.json())
  .use("/signup", signupRouter)
  .use("/login", loginRouter)
  .use("/logout", logoutRouter)
  .use("/devices",deviceRouter)
  .listen(app.get("port"),
    console.log("Listening to port",process.env.PORT || 5000)
  );

  
