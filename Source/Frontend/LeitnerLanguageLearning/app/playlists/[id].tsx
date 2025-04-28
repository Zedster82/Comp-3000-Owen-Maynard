import { StyleSheet, View, ScrollView, Alert } from 'react-native'
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


const PlaylistDetailScreen = () => {
    const { id: playlistID } = useLocalSearchParams()
    const router = useRouter()
    const { playlists, setPlaylists, selectedPlaylist, setSelectedPlaylist } = usePlaylists()
    const { modalContent, setModalContent, modalVisible, setModalVisible } = useModalView()
    const [editMode, setEditMode] = useState(false)
    const [title, setTitle] = useState('')
    const [playlistData, setPlaylistData] = useState<PlaylistType | null>(null)
    const [cardList, setCardList] = useState<any[]>([])

    useEffect(() =>  {
      setCardList([]);
      setPlaylistData(playlists.find(p => p._id === playlistID) || null);
      setTitle(playlists.find(p => p._id === playlistID)?.title || '');
    }, [playlistID, playlists])

    useEffect(() => {
      let isMounted = true;
      const fetchCardList = async () => {
        if (playlistData && playlistData.cardList && playlistData.cardList.length > 0) {
          try {
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
            if (isMounted) {
              setCardList(data.flashcards || []);
            }
          } catch (error) {
            console.error('Error fetching card list:', error);
          }
        }
      };
      fetchCardList();
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

      // PUT to replace the flashcard list for this playlist
      try {
        await axios.put(
          `http://localhost:8282/api/playlists/${playlistID}/cardList`,
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );
        // Optionally, refresh the card list after update
      } catch (error) {
        console.error('Error updating playlist card list:', error);
        Alert.alert('Error', 'Failed to update card list');
      }

      setModalVisible(false)

      //Force refresh page

      //Refresh the card list
      // const updatedPlaylist = playlists.find(p => p._id === playlistID)
      // if (updatedPlaylist) {
      //   setCardList(updatedPlaylist.cardList || [])
      // }
      // setPlaylistData(updatedPlaylist || null)


    }

    const handleAddCard = () => {
      openModal();
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
})