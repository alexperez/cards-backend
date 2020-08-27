if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

const dbConnection = require("./database")();
const session = require("./config/session")(dbConnection);

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session);

require("./routes")(app);

app.listen(process.env.PORT);
