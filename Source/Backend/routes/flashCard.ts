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
import { Flashcard } from "../models/flashcards";
//const { body, validationResult } = require("express-validator");

export const flashCardRouter = () => {
    const router = express.Router();

    //Create flashcard - Done
    router.post("/", verifyRequest, async (req, res) => {
        try {
            // Convert req.body to flashcard data
            // Check if flashcard already exists
            const flashcardData = req.body;
            const existingFlashcard = await Flashcard.findOne({ question: flashcardData.question, userId: req.user.id });
            
            

            
            
            // Ensure userID matches the authenticated user
            // Validate data (question/answer length, etc.)
            let result = createFlashCardFunctions(req, res, existingFlashcard);

            //Create the flashcard after checks
            const newFlashcard = new Flashcard(flashcardData);
            await newFlashcard.save();
            
            // Return 201 on success
            return result;
            
        } catch (error) {
            // Return 500 on error
            return res.status(500).json({ message: "Internal server error" });
        }
    });

    //Edit flashcard (use PATCH instead of PUT) - Done
    router.patch("/:_id", verifyRequest, async (req, res) => {
        try {
            const flashcardId = req.params._id;
            idCheck(res, flashcardId);
            const flashcardData = req.body;

            // Check if flashcard with this id exists
            const existingFlashcard = await Flashcard.findById(flashcardId);
            // Validate user ownership
            let result = editFlashCardFunctions(req, res, existingFlashcard);
            
            // Update flashcard in DB
            Flashcard.findOneAndUpdate(flashcardId, flashcardData);
            
            // Return 200 on success
            return result;
        } catch (error) {
            // Return 500 on error
            return res.status(500).json({ message: "Internal server error" });
        }
    });

    //Delete flashcard
    router.delete("/:_id", verifyRequest, async (req, res) => {
        try {
            // Parse flashcard id
            const flashcardId = req.params._id;
            idCheck(res, flashcardId);
            // Check if it exists
            const existingFlashcard = await Flashcard.findById(flashcardId);
            // Validate user ownership
            let result = deleteFlashCardFunctions(req, res, existingFlashcard);
            // Delete from database
            Flashcard.findOneAndDelete(flashcardId);
            // Return 200 on success
            return result;
        } catch (error) {
            // Return 500 on error
            return res.status(500).json({ message: "Internal server error" });
        }
    });

    //Get all flashcards of user
    router.get("/:userID", verifyRequest, async (req, res) => {
        try {
            // Identify user from request
            const userID = req.params.userID;
            
            // Fetch all flashcards for user
            const returnObjects = Flashcard.find({ userId: userID });
            //Checks
            const response = getAllFlashCardFunctions(req, res, returnObjects);
            // Return list
            return response;
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    });


    // Update flashcard count
    router.patch("/updateCount/:_id", verifyRequest, async (req, res) => {
        try {
            const flashcardId = req.params._id;
            idCheck(res, flashcardId);

            //Get current counts
            const flashcard = await Flashcard.findById(flashcardId);
            const failCount = flashcard?.failCount;
            const correctCount = flashcard?.correctCount;

            //Validation
            let result = await updateFlashCardCountFunctions(req, res, failCount, correctCount);

            if (result.status == 400){
                return result;
            }

            if (flashcard?.correctCount)//if correctCount exists
            {
                Flashcard.findOneAndUpdate(flashcardId, { correctCount: req.body.correctCount });
            }
            else //if failCount exists
            {
                Flashcard.findOneAndUpdate(flashcardId, { failCount: req.body.failCount });
            }
            
            return result;
            
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    });

    // Update flashcard priority
    router.patch("/updatePriority/:id", verifyRequest, async (req, res) => {
        try {
            //Get id
            const flashcardId = req.params.id;
            idCheck(res, flashcardId);

            const flashcard = await Flashcard.findById(flashcardId);
            const currentPriority = flashcard?.priority;

            let result = await updateFlashCardPriorityFunctions(req, res, currentPriority);

            if (result.status == 200){
                Flashcard.findOneAndUpdate(req.body._id, { priority: req.body.priority });
            }

            return result;

        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    });


    const idCheck = (res, flashcardId) => {
        if (!mongoose.Types.ObjectId.isValid(flashcardId)) {
            return res.status(400).json({ message: "Invalid ID format" });
          }
        
    }

    return { router };
}