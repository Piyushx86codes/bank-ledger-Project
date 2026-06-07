const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.route");
const accountRouter = require("./routes/account.routes");
const transactionRoutes = require("./routes/transaction.routes");

app.use(express.json());
app.use(cookieParser());



app.use("/api/auth",authRouter);
app.use("/api/accounts",accountRouter);
app.use("/api/transactions",transactionRoutes);

module.exports = app;