
import mongoose from 'mongoose';

// Interface for TypeScript type checking
export interface IPlaylist {
    _id?: mongoose.Types.ObjectId;
    userID: string;
    title: string;
    
    cardList: mongoose.Types.ObjectId[] | string[];
}

const playlistsSchema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        maxlength: 50,
    },
    title: {
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

export const Playlist = mongoose.model<IPlaylist>('Playlist', playlistsSchema);

