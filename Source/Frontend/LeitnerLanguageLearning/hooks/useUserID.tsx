import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useUserID() {
  const [userID, setUserID] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserID = async () => {
      const id = await AsyncStorage.getItem('userID');
      setUserID(id);
    };
    fetchUserID();
  }, []);

  // Optionally, provide a setter that updates both state and AsyncStorage
  const saveUserID = async (id: string) => {
    await AsyncStorage.setItem('userID', id);
    setUserID(id);
  };

  return { userID, setUserID: saveUserID };
}
