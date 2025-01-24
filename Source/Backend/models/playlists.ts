import mongoose from 'mongoose';
import { flashcardSchema } from './flashcards';



export const playlistsSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    cardList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flashcard'
    }]
});
