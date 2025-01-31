import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import verifyRequest from "../auth/verifyRequest";
import { 
  createPlaylistFunctions, 
  editPlaylistFunctions,
  deletePlaylistFunctions,
  getAllPlaylistsFunctions
} from "./playlistsFunctions"; // hypothetical import
//const { body, validationResult } = require("express-validator");




export const playlistsRouter = () => {
    const router = express.Router();

    //Create playlist
    router.post("/", verifyRequest,  async (req, res) => {
        try {
            // Parse request into playlist data
            // Check if playlist already exists
            // Validate user ownership (req.user?)
            // Validate data (title length, etc.)
            // Call function in "functions" file to handle specific logic
            createPlaylistFunctions(req, res);
            // Create playlist in database
            // Return 200 or 201 on success
        } catch (error) {
            // Return 500 on error
        }
    });

    //Edit playlist (use PATCH instead of PUT)
    router.patch("/:id", verifyRequest, async (req, res) => {
        try {
            // Parse request into updated data
            // Check if playlist with this id exists
            // Validate user ownership
            // Validate data (title length, etc.)
            // Call function in "functions" file to handle updates
            editPlaylistFunctions(req, res);
            // Return 200 or 201 on success
        } catch (error) {
            // Return 500 on error
        }
    });

    //Delete playlist
    router.delete("/:id", verifyRequest, async (req, res) => {
        try {
            // Parse playlist id
            // Check if playlist exists
            // Validate user ownership
            // Delete from database
            deletePlaylistFunctions(req, res);
            // Return 200 on success
        } catch (error) {
            // Return 500 on error
        }
    });

    //Get all playlists of user
    router.get("/:id", verifyRequest, async (req, res) => {
        try {
            // Parse user id
            // Find all playlists that match user
            // Return them in response
            getAllPlaylistsFunctions(req, res);
        } catch (error) {
            // Return 500 on error
        }
    });

    // Edit cardList
    router.patch("/:id/cardList", verifyRequest, async (req, res) => {
        try {
            // Parse request into updated cardList data
            // Check if playlist with this id exists
            // Validate user ownership
            // Validate data (cardList length, etc.)
            // Call function in "functions" file to handle updates
            // (Implement function if desired, e.g. editPlaylistCardListFunctions(req, res))
        } catch (error) {
            // Return 500 on error
        }
    });

    return { router };
}

