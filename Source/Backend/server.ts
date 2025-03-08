import mongoose from 'mongoose';
import dotenv from "dotenv";
import buildApp from "./app";
const app = buildApp();

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 82;

// Connect to MongoDB Atlas
const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
    console.error("MONGO_URL is not defined in environment variables.");
    process.exit(1);
}

mongoose
  .connect(mongoUrl)
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

export default app;
