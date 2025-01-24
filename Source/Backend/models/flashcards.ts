import mongoose from 'mongoose';

export const flashcardSchema = new mongoose.Schema({
    userID: {
        type: String,
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
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

