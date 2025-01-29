import mongoose from 'mongoose';
import { Flashcard } from './flashcards';

export const playlistsSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    cardList: [Flashcard]
});

export const Playlist = mongoose.model('Playlist', playlistsSchema);