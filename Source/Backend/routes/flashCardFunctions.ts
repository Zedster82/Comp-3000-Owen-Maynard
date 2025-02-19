//Create flashcard

export const createFlashCardFunctions = async (req, res, existingFlashcard) => {
    
    if (existingFlashcard) {
        return res.status(400).json({ message: "Flashcard already exists" });
    }



    return res.status(201).json({ message: "Flashcard created successfully" });
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
export const deleteFlashCardFunctions = async (req, res) => {

}
//Get all flashcards of user
export const getAllFlashCardFunctions = async (req, res) => {

}
//Get flashcard by playlist id
export const getFlashCardByPlaylistIdFunctions = async (req, res) => {

}

//Update flashcard priority
export const updateFlashCardPriorityFunctions = async (req, res) => {

}

//Update flashcard count
export const updateFlashCardCountFunctions = async (req, res) => {

}