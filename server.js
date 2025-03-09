const express = require("express");
const errorHandler = require("./middleWare/errorHandler");
const connectDB = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require('cors');

const authRouter = require("./routes/authRoutes");


connectDB(); // ! Connect to the Database

const app = express(); // ! Initialize the express app
app.use(cors());

const port = process.env.PORT || 3000; // ! Set the port

app.use(express.json()); // ! Middleware to parse the request body


app.use(errorHandler); // ! Error Handler Middleware
app.use(authRouter);


// ! Start the server on port 3000  (npm run dev *to start the server)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
