import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import verifyRequest from "../auth/verifyRequest";
import {
    createPlaylistFunctions,
    editPlaylistFunctions,
    deletePlaylistFunctions,
    getAllPlaylistsFunctions,
    replaceCardListFunctions
} from "./playlistsFunctions"; // hypothetical import
//const { body, validationResult } = require("express-validator");
import { Playlist } from "../models/playlists";


export const playlistsRouter = () => {
    const router = express.Router();

    //Create playlist
    router.post("/", verifyRequest, async (req, res) => {
        try {
            // Parse request into playlist data
            const playlistData = req.body;

            const existingPlaylist = await Playlist.findOne({ title: playlistData.title, userId: playlistData.userId });

            // Call function in "functions" file to handle specific logic
            const result = await createPlaylistFunctions(req, res, existingPlaylist);

            // Create the playlist after checks
            // Return 200 or 201 on success
            if (result?.statusCode === 201) {
                const newPlaylist = new Playlist(playlistData);
                await newPlaylist.save();
            }
            return result;
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });

    //Edit playlist (use PATCH instead of PUT)
    router.patch("/:id", verifyRequest, async (req, res) => {
        try {
            // Parse request into updated data
            const playlistID = req.params.id;
            const playlistData = req.body;
            // Check if playlist with this id exists
            const existingPlaylist = await Playlist.findById(playlistID);
            
            
            // Call function in "functions" file to handle updates
            const result = await editPlaylistFunctions(req, res, existingPlaylist);
            // Return 200 or 201 on success

            if (result?.statusCode === 200) {
                await Playlist.findByIdAndUpdate(playlistID, playlistData);
            }

            return result;
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });

    //Delete playlist
    router.delete("/:id", verifyRequest, async (req, res) => {
        try {
            // Parse playlist id
            const playlistID = req.params.id;
            
            // Check if playlist exists
            const existingPlaylist = await Playlist.findById(playlistID);
            
            const result = await deletePlaylistFunctions(req, res, existingPlaylist);
            // Delete from database
            if (result?.statusCode === 200) {
                await Playlist.findByIdAndDelete(playlistID);
            }
            
            // Return 200 on success
            return result;
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });

    //Get all playlists of user
    router.get("/:id", verifyRequest, async (req, res) => {
        try {
            // Parse user id
            const userID = req.params.id;

            
            // Find all playlists that match user
            const returnObjects = await Playlist.find({ userId: userID });
            
            // Return them in response
            const response = await getAllPlaylistsFunctions(req, res, returnObjects);

            if (response?.statusCode === 200) {
                return response;
            }

            //Unathorized
            return res.status(401).json({ message: "Unauthorized" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });

    // Replace entire cardList
    router.put("/:id/cardList", verifyRequest, async (req, res) => {
        try {
            const playlistId = req.params.id;
            const { cardList } = req.body;
            
            // Check if playlist exists
            const existingPlaylist = await Playlist.findById(playlistId);
            

            const result = await replaceCardListFunctions(req, res, existingPlaylist);
            
            if(!existingPlaylist) {
                return res.status(404).json({ message: "Playlist not found" });
            }
            
            // Replace the entire cardList
            if (result?.statusCode === 200) {
                existingPlaylist.cardList = cardList;
                await existingPlaylist.save();
            }

            return result;
        } catch (error) {
            console.log(error);
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });

    return { router };
}

