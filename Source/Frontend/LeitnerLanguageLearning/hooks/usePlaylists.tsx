import React, { createContext, useContext, useState, useEffect } from "react";
import { PlaylistType } from "@/types";
import axios from "axios";

type PlaylistsContextType = {
  playlists: PlaylistType[];
  setPlaylists: React.Dispatch<React.SetStateAction<PlaylistType[]>>;
  refreshPlaylists: () => Promise<void>;
  selectedPlaylist: PlaylistType | null;
  setSelectedPlaylist: React.Dispatch<React.SetStateAction<PlaylistType | null>>;
};

const PlaylistsContext = createContext<PlaylistsContextType | undefined>(undefined);

export const PlaylistsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(null);
  const userId = 2; // Replace with actual user ID logic

  const refreshPlaylists = async () => {
    const response = await axios.get(`http://localhost:8282/api/playlists/${userId}`);
    setPlaylists(response.data.data);
  };

  useEffect(() => {
    refreshPlaylists();
  }, []);

  // Optionally auto-select the first playlist if none is selected
  

  return (
    <PlaylistsContext.Provider value={{ playlists, setPlaylists, refreshPlaylists, selectedPlaylist, setSelectedPlaylist }}>
      {children}
    </PlaylistsContext.Provider>
  );
};

export function usePlaylists() {
  const ctx = useContext(PlaylistsContext);
  if (!ctx) throw new Error("usePlaylists must be used within a PlaylistsProvider");
  return ctx;
}
