/**
 * Creates and configures the flashCardRouter.
 * 
 * @returns {express.Router} Configured router for flashcard routes.
 */
import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import verifyRequest from "../auth/verifyRequest";
import { create } from "domain";

import { 
createFlashCardFunctions, 
editFlashCardFunctions, 
deleteFlashCardFunctions, 
getAllFlashCardFunctions, 
getFlashCardByPlaylistIdFunctions,
updateFlashCardCountFunctions,
updateFlashCardPriorityFunctions
} from "./flashCardFunctions";
//const { body, validationResult } = require("express-validator");




export const flashCardRouter = () => {
    const router = express.Router();



    //Create flashcard
    router.post("/", verifyRequest, async (req, res) => {
        try {
            // Convert req.body to flashcard data
            // Check if flashcard already exists
            // Ensure userID matches the authenticated user
            // Validate data (question/answer length, etc.)
            createFlashCardFunctions(req, res);
            // Return 200 or 201 on success
        } catch (error) {
            // Return 500 on error
        }
    });

    //Edit flashcard (use PATCH instead of PUT)
    router.patch("/:id", verifyRequest, async (req, res) => {
        try {
            // Parse flashcard id
            // Check if flashcard with this id exists
            // Validate user ownership
            editFlashCardFunctions(req, res);
            // Update flashcard in DB
            // Return 201 on success
        } catch (error) {
            // Return 500 on error
        }
    });

    //Delete flashcard
    router.delete("/:id", verifyRequest, async (req, res) => {
        try {
            // Parse flashcard id
            // Check if it exists
            // Validate user ownership
            deleteFlashCardFunctions(req, res);
            // Delete from database
            // Return 200 on success
        } catch (error) {
            // Return 500 on error
        }
    });

    //Get all flashcards of user

    router.get("/", verifyRequest, async (req, res) => {
        try {
            // Identify user from request
            // Fetch all flashcards for user
            getAllFlashCardFunctions(req, res);
            // Return list
        } catch (error) {
            // Return 500 on error
        }
    });

    //Get flashcard by playlist id
    router.get("/playlist/:id", verifyRequest, async (req, res) => {
        try {
            // Parse playlist id
            // Fetch flashcards attached to that playlist
            getFlashCardByPlaylistIdFunctions(req, res);
            // Return them
        } catch (error) {
            // Return 500 on error
        }
    });

    // Update flashcard count
    router.patch("/updateCount/:id", verifyRequest, async (req, res) => {
        try {
            updateFlashCardCountFunctions(req, res);
        } catch (error) {
            // Return 500 on error
        }
    });

    // Update flashcard priority
    router.patch("/updatePriority/:id", verifyRequest, async (req, res) => {
        try {
            updateFlashCardPriorityFunctions(req, res)
        } catch (error) {
            // Return 500 on error
        }
    });





    return { router };
}