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
            const existingFlashcard = await Flashcard.findOne({ question: flashcardData.question, userID: req.body.userID });
            
            // Ensure userID matches the authenticated user
            // Validate data (question/answer length, etc.)
            let result = await createFlashCardFunctions(req, res, existingFlashcard);
            console.log(`Status code: ${result.statusCode}`);

            // Create the flashcard after checks
            if (result?.statusCode == 201){
                console.log("Flashcard created in database");
                const newFlashcard = new Flashcard(flashcardData);
                await newFlashcard.save();
            }
            
            // Return 201 on success
            return result;
            
        } catch (error) {
            console.log(error);
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
            let result = await editFlashCardFunctions(req, res, existingFlashcard);
            
            // Update flashcard in DB
            if (result?.statusCode == 200){
                await Flashcard.findOneAndUpdate({_id: flashcardId}, flashcardData);
            }
            // Return 200 on success
            return result;
        } catch (error) {
            console.log(error);
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
            let result = await deleteFlashCardFunctions(req, res, existingFlashcard);
            
            // Delete from database only if result status is 200 or 204
            if (result?.statusCode === 200 || result?.statusCode === 204) {
                await Flashcard.findOneAndDelete({_id: flashcardId});
            }
            
            // Return 200 on success
            return result;
        } catch (error) {
            console.log(error);
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
            const response = await getAllFlashCardFunctions(req, res, returnObjects);
            // Return list

            if (response.statusCode === 200){
                return response;
            }

            //Return authorization error
            return res.status(403).json({ message: "Unauthorized" });
        } catch (error) {
            console.log(error);
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

            if (result.statusCode == 400){
                return result;
            }
            
            // Only update database if status is 200
            if (result.statusCode === 200) {
                if (flashcard?.correctCount) { //if correctCount exists
                    await Flashcard.findOneAndUpdate({_id: flashcardId}, { correctCount: req.body.correctCount });
                }
                else { //if failCount exists
                    await Flashcard.findOneAndUpdate({_id: flashcardId}, { failCount: req.body.failCount });
                }
            }
            
            return result;
            
        } catch (error) {
            console.log(error);
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

            if (result.statusCode == 200){
                // Use flashcardId from params, not from body, and add await
                await Flashcard.findOneAndUpdate({_id: flashcardId}, { priority: req.body.priority });
            }

            return result;

        } catch (error) {
            console.log(error);
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