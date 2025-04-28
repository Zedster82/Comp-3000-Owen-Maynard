import { RouteParameters } from "express-serve-static-core";
import { Request, Response } from 'express';

// Define interfaces for your data models
import { IPlaylist } from '../models/playlists.js'; // Adjust the import path as needed

// Define type for the request with user property (which comes from authentication middleware)
interface AuthRequest extends Request {
  user: {
    id: string;
    // Add other user properties as needed
  }
}

// Create playlist
export const createPlaylistFunctions = async (
  req: Request, 
  res: Response, 
  existingPlaylist: IPlaylist | null
) => {
    // Check if playlist already exists
    // Validate user ownership (req.user?)
    // Validate data (title length, etc.)
    if (existingPlaylist) {
        console.log("Existing Playlist: ")
        console.log(existingPlaylist);
        return { status: 400, message: "Playlist already exists", playlist: existingPlaylist };
    }
    

    // if (req.body.userId.toString() !== req.params.userID) {
    //     return res.status(403).json({ message: "Unauthorized" });
    // }

    if (req.body.title.length > 200) {
        return { status: 400, message: "Title must be less than 200 characters" };
    }

    return { status: 201, message: "Playlist created successfully", playlist: req.body };
};

// Edit playlist
export const editPlaylistFunctions = async (
  req: Request, 
  res: Response, 
  existingPlaylist: IPlaylist | null
) => {
    //Check if playlist exists
    // Validate user ownership
    // Validate data (title length, etc.)
    if (!existingPlaylist) {
        return { status: 404, message: "Playlist not found" };
    }
    // if (existingPlaylist.userID.toString() !== req.params.userID) {
    //     return res.status(403).json({ message: "Unauthorized" });
    // }
    if (req.body.title.length > 200) {
        return { status: 400, message: "Title must be less than 200 characters" };
    }
    return { status: 200, message: "Playlist updated successfully" };
};

// Delete playlist
export const deletePlaylistFunctions = async (
  req: Request, 
  res: Response, 
  existingPlaylist: IPlaylist | null
) => {
    // Validate user ownership
    // Check if playlist exists
    if (!existingPlaylist) {
        return { status: 404, message: "Playlist not found" };
    }
    // if (existingPlaylist.userID.toString() !== req.user.id) {
    //     return res.status(403).json({ message: "Unauthorized" });
    // }
    return { status: 200, message: "Playlist deleted successfully" }; // Added a proper return that was missing
};

// Get all playlists
export const getAllPlaylistsFunctions = async (
  req: Request, 
  res: Response, 
  returnObjects: IPlaylist[]
) => {
    return { status: 200, message:"Returned all Playlists", data: returnObjects };
};

// Replace entire cardList
export const replaceCardListFunctions = async (
  req: Request, 
  res: Response, 
  existingPlaylist: IPlaylist | null
) => {
    // Check if playlist exists
    // Validate user ownership
    if (!existingPlaylist) {
        return { status: 404, message: "Playlist not found" };
    }
    
    // Validate user ownership
    // if (existingPlaylist.userID.toString() !== req.user.id) {
    //     return res.status(403).json({ message: "Not authorized to modify this playlist" });
    // }
    return { status: 200, message: "Card list replaced successfully" };
};
