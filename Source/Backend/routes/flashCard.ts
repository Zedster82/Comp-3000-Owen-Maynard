import * as express from "express";
import mongoose from 'mongoose';
import * as bodyParser from "body-parser";
import verifyRequest from "../auth/verifyRequest.js";

import { 
createFlashCardFunctions, 
editFlashCardFunctions, 
deleteFlashCardFunctions, 
getAllFlashCardFunctions, 
getFlashCardByArrayFunctions,
updateFlashCardCountFunctions,
updateFlashCardPriorityFunctions
} from "./flashCardFunctions.js";
import { Flashcard } from "../models/flashcards.js";
import { Console } from "console";
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
                res.status(201).json({ message: result.message, flashcard: newFlashcard });
                return;
            }
            
            res.status(result.status).json({ message: result.message, data: result.flashcard });
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    });

    //Edit flashcard (use PATCH instead of PUT) - Done
    router.patch("/:id", verifyRequest, async (req, res) => {
        try {
            const flashcardID = req.params.id;
            idCheck(res, flashcardID);
            const flashcardData = req.body;

            console.log("Edit Flashcard,  ID: ", flashcardID);

            // Check if flashcard with this id exists
            const existingFlashcard = await Flashcard.findById(flashcardID);
            // Validate user ownership
            let result = await editFlashCardFunctions(req, res, existingFlashcard);
            
            // Update flashcard in DB if code is 200
            if (result?.status == 200){
                await Flashcard.findOneAndUpdate({_id: flashcardID}, flashcardData);
            }
            // Return status and message
            res.status(result.status).json({ message: result.message, flashcard: flashcardData });
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    });

    //Delete flashcard
    router.delete("/:id", verifyRequest, async (req, res) => {
        try {
            // Parse flashcard id
            const flashcardId = req.params.id;
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
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    });

    //Get all flashcards of user
    router.get("/:userID", verifyRequest, async (req, res) => {
        try {
            // Identify user from request
            const userID = req.params.userID;

            console.log("Get Flashcards User ID: ", userID);
            
            // Fetch all flashcards for user - FIXED: changed userId to userID to match schema
            const returnObjects = await Flashcard.find({ userID: userID });
            
            // Debug the query results
            // console.log("Query results:", returnObjects);
            
            //Checks
            const result = await getAllFlashCardFunctions(req, res, returnObjects);
            // Return list

            res.status(result.status).json({ message: result.message, flashcards: result.data });
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    });

    //Get flashcards by a array of IDs
    router.post("/flashcardList/list", verifyRequest, async (req, res) => {
        try {
            // Get the list of flashcard IDs from request body
            const flashcardIDList = req.body.list;

            console.log("Get Flashcard List: ID ", flashcardIDList);

            // Validate that it's a non-empty array
            if (!Array.isArray(flashcardIDList) || flashcardIDList.length === 0) {
                res.status(400).json({ message: "Invalid flashcard ID list" });
                return;
            }

            // Map to extract only the id strings if array contains objects
            const idList = flashcardIDList.map(item => typeof item === 'string' ? item : item.id);

            // Fetch all flashcards by their IDs in a single database query
            const flashCards = await Flashcard.find({ 
                _id: { $in: idList } 
            });

            // Check if we found any cards
            if (flashCards.length === 0) {
                res.status(404).json({ message: "No flashcards found with the provided IDs" });
                return;
            }

            // Result
            let result = await getFlashCardByArrayFunctions(req, res, flashCards);

            // Return status and message
            res.status(result.status).json({ message: result.message, flashcards: result.flashCards });
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            return;
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
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            return;
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
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal server error" });
            return;
        }
    });


    const idCheck = (res:any, flashcardId:string) => {
        // if (!mongoose.Types.ObjectId.isValid(flashcardId)) {
        //     res.status(400).json({ message: "Invalid ID format" });
        //   }
    }

    return { router };
}