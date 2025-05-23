import { useEffect, useState } from "react";
import { usePlaylists } from "./usePlaylists";
import { useUserID } from "./useUserID";

export function useFlashcardsForSelectedPlaylist() {
  const { selectedPlaylist } = usePlaylists();
  const {userID, setUserID} = useUserID(); // Custom hook to manage user ID
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  

  useEffect(() => {
    let isMounted = true;
    setFlashcards([]);
    setLoading(true);

    const fetchFlashcards = async () => {

        console.log("Selected Playlist:", selectedPlaylist);
      if (
        selectedPlaylist &&
        selectedPlaylist.cardList &&
        selectedPlaylist.cardList.length > 0
      ) {
        try {
          const requestBody = {
            list: selectedPlaylist.cardList.map(card => ({ id: card.id }))
          };

          const response = await fetch(
            "http://localhost:8282/api/flashcards/flashcardList/list",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(requestBody)
            }
          );

          const data = await response.json();
          if (isMounted) {
            setFlashcards(data.flashcards || []);
          }

          console.log("Flashcards fetched:", data.flashcards || []);
        } catch (error) {
          if (isMounted) setFlashcards([]);
          console.error("Error fetching flashcards:", error);
        }
      } else {
        if (isMounted) setFlashcards([]);
      }
      if (isMounted) setLoading(false);
    };

    fetchFlashcards();

    return () => {
      isMounted = false;
    };
  }, [selectedPlaylist, userID]);


  

  return { flashcards, setFlashcards, loading };
}
