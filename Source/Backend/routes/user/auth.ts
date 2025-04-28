import * as express from "express";
import { Request, Response } from 'express';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import verifyRequest from "../../auth/verifyRequest.js";

// Import User model (assuming it follows similar pattern to other models)
// Create a User interface that matches the schema
interface IUser {
  _id?: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
}

// Create the User schema (if not imported from another file)
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100
  },
  password: {
    type: String,
    required: true
  }
});

export const User = mongoose.model<IUser>('User', userSchema);

// Load environment variables
dotenv.config();

export const authRouter = () => {
  const router = express.Router();

  // POST /auth/login
  router.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    console.log("Username: ", username, " Password: ", password);

    try {
      // Check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        res.status(400).json({ message: "Incorrect username or password" });
        return;
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("IsMatch: ", isMatch);
      if (!isMatch) {
        res.status(400).json({ message: "Incorrect username or password" });
        return;
      }

      // Generate JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'default_secret', { expiresIn: "1h" });

      console.log("User: ", user.username, " Token: ", token);
      res.status(200).json({ message: "Successfully logged in", token });
      return;
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ message: "Server error" });
      return;
    }
  });

  // POST /auth/register
  router.post("/register", async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(400).json({ message: "Username already taken" });
        return;
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      // Save the new user to the database
      await newUser.save();

      res.status(200).json({ message: "User successfully registered" });
      return;
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ message: "Server error" });
      return;
    }
  });

  // GET /auth/:username
  router.get("/:username", verifyRequest, async (req: Request, res: Response) => {
    try {
      const userData = await User.findOne({ username: req.params.username });
      if (!userData) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({ email: userData.email });
      return;
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
      return;
    }
  });

  // PUT /auth/update
  router.put("/update", verifyRequest, async (req: Request, res: Response) => {
    const { username, password, newUsername, newEmail, newPassword } = req.body;

    try {
      // Check if username is taken
      if (newUsername) {
        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser) {
          res.status(401).json({ message: "Username already taken" });
          return;
        }
      }
      if (newEmail) {
        const existingEmail = await User.findOne({ email: newEmail });
        if (existingEmail) {
          res.status(401).json({ message: "Email already registered" });
          return;
        }
      }

      //Get user data
      const user = await User.findOne({ username });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Incorrect password, try again" });
        return;
      }

      // Update user data
      if (newUsername) user.username = newUsername;
      if (newEmail) user.email = newEmail;
      if (newPassword) user.password = await bcrypt.hash(newPassword, 10);

      // Save updated user to the database
      await user.save();

      res.status(200).json({ message: "User data successfully updated" });
      return;
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ message: "Server error" });
      return;
    }
  });

  // DELETE /auth/delete
  router.delete("/delete", verifyRequest, async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
      // Check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        res.status(400).json({ message: "Incorrect username or password" });
        return;
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ message: "Incorrect password" });
        return;
      }

      // Delete user from the database
      await User.deleteOne({ username });

      res.status(200).json({ message: "User successfully deleted" });
      return;
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ message: "Server error" });
      return;
    }
  });

  return { router };
};