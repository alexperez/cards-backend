require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");

const PORT = process.env.PORT;

const app = express();

app.use(helmet()).use(morgan("tiny"));

app.get("/", (req, res) => res.send("Index page"));

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
