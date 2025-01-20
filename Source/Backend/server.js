const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const {authRouter} = require("./routes/auth");
const {workoutRouter} = require("./routes/workout");
const dotenv = require("dotenv");
const { startWebSocketServer } = require("./websocket");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Load environment variables
dotenv.config();

// Routes
app.use("/auth", authRouter);
app.use("/workouts", workoutRouter);


const PORT = process.env.PORT || 82;

// Connect to MongoDB Atlas
mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB Server successfully.");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1); // Exit the process if DB connection fails
    });



app.get('/', (req, res) => {
    res.send('Server is running!');
});

module.exports = app;
