//Create flashcard

import { Request, Response } from 'express';

// Define interface for FlashCard
import { IFlashcard } from '../models/flashcards.js'; // Adjust the import path as needed

// Define AuthRequest interface same as in playlists
interface AuthRequest extends Request {
  user: {
    id: string;
    // Add other user properties as needed
  }
}

export const createFlashCardFunctions = async (
  req: Request, 
  res: Response, 
  existingFlashcard: IFlashcard | null
) => {
    
    if (existingFlashcard) {
        return { status: 400, message: "Flashcard already exists" };
    }

    // if (req.body.userId !== req.user.id) {
    //     return res.status(403).json({ message: "Unauthorized" });
    // }
    
    console.log("Data: ")
    console.log(req.body)

    if (req.body.question > 200 || req.body.answer > 200) {
        return { status: 400, message: "Question and answer must be less than 200 characters" };
    }
    
    return { status: 201, message: "Flashcard created successfully", flashcard: req.body };
}
//Edit flashcard
export const editFlashCardFunctions = async (
  req: Request, 
  res: Response, 
  existingFlashcard: IFlashcard | null
) => {

    if (!existingFlashcard) {
        return { status: 404, message: "Flashcard not found" };
    }

    if (existingFlashcard.userID.toString() !== req.params._id) {
        return { status: 403, message: "Unauthorized" };
    }

    return { status: 200, message: "Flashcard updated" };

}
//Delete flashcard
export const deleteFlashCardFunctions = async (
  req: Request, 
  res: Response, 
  existingFlashcard: IFlashcard | null
) => {

    if (!existingFlashcard) {
        return { status: 404, message: "Flashcard not found" };
    }

    // if (existingFlashcard.userID.toString() !== req.params._id) {
    //     return { status: 403, message: "Unauthorized" };
    // }

    return { status: 200, message: "Flashcard Deleted Successfully" };
}
//Get all flashcards of user
export const getAllFlashCardFunctions = async (
  req: Request, 
  res: Response, 
  returnObjects: IFlashcard[]
) => {
    // Check if data exists

    if (returnObjects.length === 0) {
        return { status: 404, message: "No flashcards found" };
    }

    return { status: 200,message: "Flashcard returned", data: returnObjects };
}
//Get flashcard by playlist id
export const getFlashCardByPlaylistIdFunctions = async (
  req: AuthRequest, 
  res: Response
) => {
    // No implementation, adding a return
    return { status: 200, message: "Function not implemented" };
}

//Update flashcard priority
export const updateFlashCardPriorityFunctions = async (
  req: Request, 
  res: Response, 
  currentPriority: number
) => {

    if(Math.abs(req.body.priority - currentPriority) != 1)
    {
        //Data manipulation, not allowed to update correct count
        return { status: 400, message: "Invalid request" };
    }
    return { status: 200, message: "Flashcard priority updated" };
}

//Update flashcard count
export const updateFlashCardCountFunctions = async (
  req: Request, 
  res: Response, 
  failCount: number, 
  correctCount: number
) => {
    if(Math.abs(req.body.correctCount - correctCount) != 1)
    {
        //Data manipulation, not allowed to update correct count
        return { status: 400, message: "Invalid request" };
    }
    return { status: 200, message: "Flashcard count updated successfully" };
}