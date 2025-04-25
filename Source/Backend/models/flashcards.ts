import mongoose from 'mongoose';

// Interface for TypeScript type checking
export interface IFlashcard {
    _id?: mongoose.Types.ObjectId;
    userID: string;
    question: string;
    answer: string;
    correctCount: number;
    failCount: number;
    priority: number;
}

const flashcardSchema = new mongoose.Schema({
    userID: {
        type: String,
        maxlength: 50
    },
    question: {
        type: String,
        required: true,
        maxlength: 200
    },
    answer: {
        type: String,
        required: true,
        maxlength: 200
    },
    correctCount: {
        type: Number,
        default: 0
    },
    failCount: {
        type: Number,
        default: 0
    },
    priority: {
        type: Number,
        default: 1
    }
});

export const Flashcard = mongoose.model<IFlashcard>('Flashcard', flashcardSchema);

