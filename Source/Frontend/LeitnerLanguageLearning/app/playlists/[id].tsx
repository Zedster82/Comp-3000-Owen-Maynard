import { StyleSheet, View, ScrollView, Alert, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import Button from '@/components/Button'
import { PlaylistType } from '@/types'
import { colors } from '@/constants/theme'
import { Input } from '@rneui/themed'
import { usePlaylists } from '@/hooks/usePlaylists'
import Modal from '@/components/Modal'
import { useModalView } from '@/hooks/useModalView'
import AddCard from '@/components/modals/AddCard'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Trash } from 'phosphor-react-native' // or wherever your Trash icon comes from
import { useFlashcardsForSelectedPlaylist } from '@/hooks/useFlashcards'


const PlaylistDetailScreen = () => {
    const { id: playlistID } = useLocalSearchParams()
    const router = useRouter()
    const { playlists, setPlaylists, selectedPlaylist, setSelectedPlaylist } = usePlaylists()
    const { modalContent, setModalContent, modalVisible, setModalVisible } = useModalView()
    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState('')
    const [playlistData, setPlaylistData] = useState<PlaylistType | null>(null)
    const [cardList, setCardList] = useState<any[]>([])
    const {flashcards, setFlashcards} = useFlashcardsForSelectedPlaylist()

    useEffect(() =>  {
      setPlaylistData(playlists.find(p => p._id === playlistID) || null);
      setTitle(playlists.find(p => p._id === playlistID)?.title || '');
      setCardList([]); // Clear cardList when playlist changes
    }, [playlistID, playlists])

    const updateCardList = async () => {
      if (playlistData && playlistData.cardList && playlistData.cardList.length > 0) {
        try {
          console.log("Getting list:", playlistData)
          const requestBody = {
            list: playlistData.cardList.map(card => ({ id: card.id }))
          };
          const response = await fetch(`http://localhost:8282/api/flashcards/flashcardList/list`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });
          const data = await response.json();
          setCardList(data.flashcards || []);
        } catch (error) {
          console.error('Error fetching card list:', error);
        }
      }
    };

    useEffect(() => {
      let isMounted = true;
      
      const fetchData = async () => {
        if (isMounted) {
          await updateCardList();
        }
      };
      
      fetchData();
      
      return () => {
        isMounted = false;
      };
    }, [playlistData])

    const handleSave = () => {
      setEditMode(false)
      Alert.alert('Success', 'Playlist updated successfully')
    }

    const handleSelect = () => {
      if (playlistData) {
        setSelectedPlaylist(playlistData as any);
        router.push('/Homepage');
        Alert.alert('Success', `Selected playlist: ${playlistData.title}`);
      }
    }

    const openModal = () => { 
      setModalContent(<AddCard returnHandler={addNewCard} setVisible={setModalVisible}></AddCard>)
    }

    const addNewCard = async (cardID: string) => {
      const userID = await AsyncStorage.getItem('userID')
      const combinedCardList = [
        ...cardList.map(card => ({ id: card.id || card._id })),
        { id: cardID }
      ]
      const payload = { cardList: combinedCardList }

      try {
        await axios.put(
          `http://localhost:8282/api/playlists/${playlistID}/cardList`,
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );
        // Fetch updated playlist from backend
        const updatedPlaylistRes = await axios.get(`http://localhost:8282/api/playlists/${playlistID}`);
        setPlaylistData(updatedPlaylistRes.data);
      } catch (error) {
        console.error('Error updating playlist card list:', error);
        Alert.alert('Error', 'Failed to update card list');
      }

      setModalVisible(false)
    }

    const handleAddCard = () => {
      openModal();
    };

    // Add this function to handle card deletion
    const handleDeleteCard = async (cardIdToDelete: string) => {
      const updatedCardList = cardList
        .filter(card => (card.id || card._id) !== cardIdToDelete)
        .map(card => ({ id: card.id || card._id }));

      const payload = { cardList: updatedCardList };

      try {
        await axios.put(
          `http://localhost:8282/api/playlists/${playlistID}/cardList`,
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );
        // Update local state after successful delete
        setCardList(cardList.filter(card => (card.id || card._id) !== cardIdToDelete));
        setFlashcards(updatedCardList);
      } catch (error) {
        console.error('Error deleting card from playlist:', error);
        Alert.alert('Error', 'Failed to delete card');
      }
    };

    if (!playlistData) return (
      <ScreenWrapper>
        <Typo>Loading playlist...</Typo>
      </ScreenWrapper>
    )

    return (
      <ScreenWrapper>
        <View style={styles.header}>
          <Button style={styles.backButton} onPress={() => router.push('/Playlists')}>
            <Typo>← Back</Typo>
          </Button>
          <Button 
            style={styles.backButton} 
            onPress={handleSelect}
            disabled={!playlistData}
          >
            <Typo>Select</Typo>
          </Button>
          <Button style={styles.editButton} onPress={() => setEditMode(!editMode)}>
            <Typo>{editMode ? 'Cancel' : 'Edit'}</Typo>
          </Button>
        </View>
        <View style={styles.container}>
          {editMode ? (
            <>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder="Playlist Title"
                style={styles.titleInput}
              />
              <Button onPress={handleSave} style={styles.saveButton}>
                <Typo>Save Changes</Typo>
              </Button>
            </>
          ) : (
            <>
              <Typo size={24} fontWeight="600">{playlistData?.title}</Typo>
              <Button
                style={styles.addCardButton}
                onPress={handleAddCard}
              >
                <Typo>Add Card</Typo>
              </Button>
            </>
          )}
          <View style={styles.cardsContainer}>
            <Typo size={18} fontWeight="500">Cards ({playlistData?.cardList?.length || 0})</Typo>
            <ScrollView style={styles.cardsList}>
              {cardList.length > 0 ? (
                cardList.map((card, index) => (
                  <View key={card._id || card.id || index} style={styles.cardItem}>
                    <Typo>Question: {card.question}</Typo>
                    <Typo>Answer: {card.answer}</Typo>
                    <TouchableOpacity onPress={() => handleDeleteCard(card.id || card._id)} style={styles.iconButton}>
                      <Trash size={22} color={colors.errorcolor || 'red'} />
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Typo style={{padding: 10}}>
                  {playlistData?.cardList?.length ? "Loading cards..." : "No cards in this playlist"}
                </Typo>
              )}
              
            </ScrollView>
          </View>
        </View>
        <Modal visible={modalVisible} setVisible={setModalVisible}>{modalContent}</Modal>
      </ScreenWrapper>
    )
}

export default PlaylistDetailScreen

const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
    },
    backButton: {
      width: 'auto',
      paddingHorizontal: 10,
    },
    editButton: {
      width: 'auto',
      paddingHorizontal: 10,
    },
    container: {
      flex: 1,
      width: '100%',
    },
    titleInput: {
      fontSize: 20,
    },
    saveButton: {
      marginVertical: 10,
    },
    cardsContainer: {
      marginTop: 20,
      flex: 1,
    },
    cardsList: {
      marginTop: 10,
      flex: 1,
    },
    cardItem: {
      padding: 15,
      backgroundColor: colors.neutral700,
      marginVertical: 5,
      borderRadius: 8,
    },
    addCardButton: {
      marginVertical: 10,
      alignSelf: 'flex-start',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.main,
      borderRadius: 8,
    },
    iconButton: {
      marginTop: 8,
      alignSelf: 'flex-end',
      padding: 4,
      borderRadius: 6,
    },
})