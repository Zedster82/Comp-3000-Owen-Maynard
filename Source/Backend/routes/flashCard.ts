import * as express from "express";
import mongoose from 'mongoose';
import * as bodyParser from "body-parser";
import verifyRequest from "../auth/verifyRequest.js";

import { 
createFlashCardFunctions, 
editFlashCardFunctions, 
deleteFlashCardFunctions, 
getAllFlashCardFunctions, 
getFlashCardByPlaylistIdFunctions,
updateFlashCardCountFunctions,
updateFlashCardPriorityFunctions
} from "./flashCardFunctions.js";
import { Flashcard } from "../models/flashcards.js";
//const { body, validationResult } = require("express-validator");

export const flashCardRouter = () => {
    const router = express.Router();

    //Create flashcard - Done
    router.post("/", verifyRequest, async (req, res) => {
        try {
            // Convert req.body to flashcard data
            // Check if flashcard already exists
            const flashcardData = req.body;
            const existingFlashcard = await Flashcard.findOne({userID: req.body.userID, question: flashcardData.question,answer:flashcardData.answer });
            
            // Ensure userID matches the authenticated user
            // Validate data (question/answer length, etc.)
            let result = await createFlashCardFunctions(req, res, existingFlashcard);
            console.log(`Existing Flashcard (null): ${existingFlashcard}`);

            // Create the flashcard after checks
            if (result?.status == 201){
                console.log("Flashcard created in database");
                const newFlashcard = new Flashcard(flashcardData);
                await newFlashcard.save();
                
            }
            
            res.status(result.status).json({ message: result.message, data: result.flashcard });
            
            
        } catch (error) {
            console.log(error);
            // Return 500 on error
            res.status(500).json({ message: "Internal server error" });
        }
    });

    //Edit flashcard (use PATCH instead of PUT) - Done
    router.patch("/:id", verifyRequest, async (req, res) => {
        try {
            const flashcardId = req.params._id;
            idCheck(res, flashcardId);
            const flashcardData = req.body;

            // Check if flashcard with this id exists
            const existingFlashcard = await Flashcard.findById(flashcardId);
            // Validate user ownership
            let result = await editFlashCardFunctions(req, res, existingFlashcard);
            
            // Update flashcard in DB
            if (result?.status == 200){
                await Flashcard.findOneAndUpdate({_id: flashcardId}, flashcardData);
            }
            // Return 200 on success
            res.status(result.status).json({ message: result.message });
            
            // return result;
        } catch (error) {
            console.log(error);
            // Return 500 on error
            res.status(500).json({ message: "Internal server error" });
        }
    });

    //Delete flashcard
    router.delete("/:id", verifyRequest, async (req, res) => {
        try {
            // Parse flashcard id
            const flashcardId = req.params._id;
            idCheck(res, flashcardId);
            // Check if it exists
            const existingFlashcard = await Flashcard.findById(flashcardId);
            // Validate user ownership
            let result = await deleteFlashCardFunctions(req, res, existingFlashcard);
            
            // Delete from database only if result status is 200 or 204
            if (result?.status === 200 || result?.status === 204) {
                await Flashcard.findOneAndDelete({_id: flashcardId});
            }
            
            res.status(result.status).json({ message: result.message });
        } catch (error) {
            console.log(error);
            // Return 500 on error
            res.status(500).json({ message: "Internal server error" });
        }
    });

    //Get all flashcards of user
    router.get("/:userID", verifyRequest, async (req, res) => {
        try {
            // Identify user from request
            const userID = req.params.userID;
            
            // Fetch all flashcards for user
            const returnObjects = await Flashcard.find({ userId: userID });
            //Checks
            const result = await getAllFlashCardFunctions(req, res, returnObjects);
            // Return list

            res.status(result.status).json({ message: result.message, data: result.data });

            
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    });


    // Update flashcard count
    router.patch("/updateCount/:id", verifyRequest, async (req, res) => {
        try {
            const flashcardId = req.params._id;
            idCheck(res, flashcardId);

            //Get current counts
            const flashcard = await Flashcard.findById(flashcardId);
            const failCount = flashcard?.failCount ?? 0;
            const correctCount = flashcard?.correctCount ?? 0;
            

            //Validation
            let result = await updateFlashCardCountFunctions(req, res, failCount, correctCount);

            
            
            // Only update database if status is 200
            if (result.status === 200) {
                if (flashcard?.correctCount) { //if correctCount exists
                    await Flashcard.findOneAndUpdate({_id: flashcardId}, { correctCount: req.body.correctCount });
                }
                else { //if failCount exists
                    await Flashcard.findOneAndUpdate({_id: flashcardId}, { failCount: req.body.failCount });
                }
                
            }
            
            res.status(result.status).json({ message: result.message });
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    // Update flashcard priority
    router.patch("/updatePriority/:id", verifyRequest, async (req, res) => {
        try {
            //Get id
            const flashcardId = req.params.id;
            idCheck(res, flashcardId);

            const flashcard = await Flashcard.findById(flashcardId);
            const currentPriority = flashcard?.priority ?? 0;

            let result = await updateFlashCardPriorityFunctions(req, res, currentPriority);

            if (result.status == 200){
                // Use flashcardId from params, not from body, and add await
                await Flashcard.findOneAndUpdate({_id: flashcardId}, { priority: req.body.priority });
            }

            res.status(result.status).json({ message: result.message });

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
        }
    });


    const idCheck = (res:any, flashcardId:string) => {
        // if (!mongoose.Types.ObjectId.isValid(flashcardId)) {
        //     res.status(400).json({ message: "Invalid ID format" });
        //   }
    }

    return { router };
}