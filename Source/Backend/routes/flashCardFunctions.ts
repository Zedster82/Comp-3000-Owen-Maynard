//Create flashcard

import { response } from "express";

export const createFlashCardFunctions = async (req, res, existingFlashcard) => {
    
    if (existingFlashcard) {
        return res.status(400).json({ message: "Flashcard already exists" });
    }

    // if (req.body.userId !== req.user.id) {
    //     return res.status(403).json({ message: "Unauthorized" });
    // }
    
    console.log("Data: ")
    console.log(req.body)

    if (req.body.question > 200 || req.body.answer > 200) {
        return res.status(400).json({ message: "Question and answer must be less than 200 characters" });
    }


    
    return res.status(201).json({ message: "Flashcard created successfully", flashcard: req.body });
}
//Edit flashcard
export const editFlashCardFunctions = async (req, res, existingFlashcard) => {

    if (!existingFlashcard) {
        return res.status(404).json({ message: "Flashcard not found" });
    }

    if (existingFlashcard.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    return res.status(200).json({ message: "Flashcard updated" });

}
//Delete flashcard
export const deleteFlashCardFunctions = async (req, res, existingFlashcard) => {

    if (!existingFlashcard) {
        return res.status(404).json({ message: "Flashcard not found" });
    }

    if (existingFlashcard.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    return res.status(200).json({ message: "Flashcard Deleted" });
}
//Get all flashcards of user
export const getAllFlashCardFunctions = async (req, res, returnObjects) => {
    return res.status(200).json(returnObjects);
}
//Get flashcard by playlist id
export const getFlashCardByPlaylistIdFunctions = async (req, res) => {

}

//Update flashcard priority
export const updateFlashCardPriorityFunctions = async (req, res, currentPriority) => {

    if(Math.abs(req.body.priority - currentPriority) != 1)
    {
        //Data manipulation, not allowed to update correct count
        return res.status(400).json({ message: "Invalid request" });
    }
    return res.status(200).json({ message: "Flashcard priority updated" });
}

//Update flashcard count
export const updateFlashCardCountFunctions = async (req, res, failCount, correctCount) => {
    if(Math.abs(req.body.correctCount - correctCount) != 1)
    {
        //Data manipulation, not allowed to update correct count
        return res.status(400).json({ message: "Invalid request" });
    }
    return res.status(200).json({ message: "Flashcard count updated" });
}