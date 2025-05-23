import * as express from "express";
import mongoose from 'mongoose';
import * as bodyParser from "body-parser";
import verifyRequest from "../auth/verifyRequest.js";
import {
    createPlaylistFunctions,
    editPlaylistFunctions,
    deletePlaylistFunctions,
    getAllPlaylistsFunctions,
    replaceCardListFunctions
} from "./playlistsFunctions.js"; // hypothetical import
//const { body, validationResult } = require("express-validator");
import { Playlist } from "../models/playlists.js";


export const playlistsRouter = () => {
    const router = express.Router();

    //Create playlist
    router.post("/", verifyRequest, async (req, res) => {
        try {
            // Parse request into playlist data
            const playlistData = req.body;
            console.log("Create Playlist Data: ", playlistData);

            const existingPlaylist = await Playlist.findOne({ title: playlistData.title, userId: playlistData.userID });

            // Call function in "functions" file to handle specific logic
            const result = await createPlaylistFunctions(req, res, existingPlaylist);

            

            // Create the playlist after checks
            // Return 200 or 201 on success
            if (result?.status === 201) {
                const newPlaylist = new Playlist(playlistData);
                await newPlaylist.save();
                res.status(201).json({ message: result.message, playlist: newPlaylist });
                return;
            }

            res.status(result.status).json({ message: result.message, playlist: result.playlist });
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    });

    //Edit playlist (use PATCH instead of PUT)
    router.patch("/:id", verifyRequest, async (req, res) => {
        try {
            // Parse request into updated data
            const playlistID = req.params.id;

            // Check if id is valid
            if (!mongoose.Types.ObjectId.isValid(playlistID)) {
                console.log("Invalid playlist ID:", playlistID);
                res.status(400).json({ message: "Invalid playlist ID" });
                return;
            }
            const playlistData = req.body;
            // Check if playlist with this id exists
            const existingPlaylist = await Playlist.findById(playlistID);
            
            
            // Call function in "functions" file to handle updates
            const result = await editPlaylistFunctions(req, res, existingPlaylist);
            // Return 200 or 201 on success

            if (result?.status === 200) {
                await Playlist.findByIdAndUpdate(playlistID, playlistData);
                res.status(200).json({ message: result.message, playlist: playlistData });
                return;
            }

            res.status(result.status).json({ message: result.message });
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    });

    //Delete playlist
    router.delete("/:id", verifyRequest, async (req, res) => {
        try {
            // Parse playlist id
            const playlistID = req.params.id;
            // Check if id is valid
            if (!mongoose.Types.ObjectId.isValid(playlistID)) {
                console.log("Invalid playlist ID:", playlistID);
                res.status(400).json({ message: "Invalid playlist ID" });
                return;
            }
            
            // Check if playlist exists
            const existingPlaylist = await Playlist.findById(playlistID);
            
            const result = await deletePlaylistFunctions(req, res, existingPlaylist);
            // Delete from database
            if (result?.status === 200) {
                await Playlist.findByIdAndDelete(playlistID);
                
            }
            
            // Return 200 on success
            res.status(result.status).json({ message: result.message });
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    //Get all playlists of user
    router.get("/:id", verifyRequest, async (req, res) => {
        try {
            // Parse user id
            const userID = req.params.id;

            console.log("Get Playlist User ID:", userID);

            
            // Find all playlists that match user
            const returnObjects = await Playlist.find({ userID: userID });

            console.log("Get Playlist Return Objects: ", returnObjects);
            
            // Return them in response
            const result = await getAllPlaylistsFunctions(req, res, returnObjects);

            res.status(result.status).json({ message: result.message, data: result.data });
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    });

    // Replace entire cardList
    router.put("/:id/cardList", verifyRequest, async (req, res) => {
        try {
            const playlistId = req.params.id;
            const cardList = req.body.cardList; // Assuming cardList is sent in the request body

            console.log("Replace CardList Playlist ID:", playlistId);
            console.log("Replace CardList Data:", req.body);
            
            // Check if playlist exists
            const existingPlaylist = await Playlist.findById(playlistId);
            

            const result = await replaceCardListFunctions(req, res, existingPlaylist);
            
            
            
            // Replace the entire cardList
            if (result?.status === 200 && existingPlaylist) {
                existingPlaylist.cardList = cardList;
                await existingPlaylist.save();
                
            }

            res.status(result.status).json({ message: result.message });
            return;
        } catch (error) {
            console.log(error);
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    });



    return { router };
}

