// Create playlist
export const createPlaylistFunctions = async (req, res, existingPlaylist) => {
    // Check if playlist already exists
    // Validate user ownership (req.user?)
    // Validate data (title length, etc.)
    if (existingPlaylist) {
        return res.status(400).json({ message: "Playlist already exists" });
    }

    if (req.body.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    if (req.body.title.length > 200) {
        return res.status(400).json({ message: "Title must be less than 200 characters" });
    }

    return res.status(201).json({ message: "Playlist created successfully", playlist: req.body });
};

// Edit playlist
export const editPlaylistFunctions = async (req, res, existingPlaylist) => {
    //Check if playlist exists
    // Validate user ownership
    // Validate data (title length, etc.)
    if (!existingPlaylist) {
        return res.status(404).json({ message: "Playlist not found" });
    }
    if (existingPlaylist.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    if (req.body.title.length > 200) {
        return res.status(400).json({ message: "Title must be less than 200 characters" });
    }
    return res.status(200).json({ message: "Playlist updated" });
};

// Delete playlist
export const deletePlaylistFunctions = async (req, res, existingPlaylist) => {
    // Validate user ownership
    // Check if playlist exists
    if (!existingPlaylist) {
        return res.status(404).json({ message: "Playlist not found" });
    }
    if (existingPlaylist.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }
};

// Get all playlists
export const getAllPlaylistsFunctions = async (req, res, returnObjects) => {
    

    return res.status(200).json(returnObjects);
};


// Replace entire cardList
export const replaceCardListFunctions = async (req, res, existingPlaylist) => {
    // Check if playlist exists
    // Validate user ownership
    if (!existingPlaylist) {
        return res.status(404).json({ message: "Playlist not found" });
    }
    
    // Validate user ownership
    if (existingPlaylist.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized to modify this playlist" });
    }
    return res.status(200).json({ message: "Card list replaced" });
};
