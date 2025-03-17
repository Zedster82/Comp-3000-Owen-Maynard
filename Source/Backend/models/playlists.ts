import { kMaxLength } from 'buffer';
import mongoose from 'mongoose';

const playlistsSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        maxlength: 50,
    },
    playlistName: {
        type: String,
        required: true,
        maxlength: 50
    },
    cardList: {
        type: Array,
        required: true,
        default: []
    }
});

export const Playlist = mongoose.model('Playlist', playlistsSchema);

