import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        maxlength: 50
    },
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

export const  Flashcard = mongoose.model('Flashcard', flashcardSchema);

