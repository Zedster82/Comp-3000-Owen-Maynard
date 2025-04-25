import { StyleSheet, View, ScrollView, Alert, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import Button from '@/components/Button'
import { PlaylistType } from '@/types'
import { colors } from '@/constants/theme'
import { useMutation, useQuery } from 'react-query'
import axios from 'axios'
import { Input } from '@rneui/themed'

const PlaylistDetailScreen = () => {
    const { id } = useLocalSearchParams()
    const router = useRouter()
    const [editMode, setEditMode] = useState(false)
    const [playlistData, setPlaylistData] = useState<PlaylistType | null>(null)
    const [title, setTitle] = useState('')
    
    // Fetch playlist data
    const { data, isLoading, error } = useQuery(
      ['playlist', id],
      async () => {
        // For development, you can use fake data
        // In production, replace with actual API call:
        // const response = await axios.get(`/api/playlists/${id}`)
        // return response.data
        
        // Simulated data for development
        return { _id: id as string, title: 'Playlist ' + title, user: 'testuser', cardList: ['1', '2'] }
      }
    )
    
    // Update playlist mutation
    const updatePlaylist = useMutation(
      async (updatedData: Partial<PlaylistType>) => {
        // For production:
        // const response = await axios.put(`/api/playlists/${id}`, updatedData)
        // return response.data
        
        // Simulated update for development
        return { ...playlistData, ...updatedData }
      },
      {
        onSuccess: (data) => {
          setPlaylistData(data as PlaylistType)
          setEditMode(false)
          Alert.alert('Success', 'Playlist updated successfully')
        },
        onError: () => {
          Alert.alert('Error', 'Failed to update playlist')
        }
      }
    )
    
    useEffect(() => {
      if (data) {
        setPlaylistData(data as PlaylistType)
        setTitle(data.title)
      }
    }, [data])
    
    const handleSave = () => {
      updatePlaylist.mutate({ title })
    }
    
    if (isLoading) return (
      <ScreenWrapper>
        <Typo>Loading playlist...</Typo>
      </ScreenWrapper>
    )
    
    if (error || playlistData?.cardList == null) return (
      <ScreenWrapper>
        <Typo>Error loading playlist</Typo>
        <Button onPress={() => router.back()}>
          <Typo>Go Back</Typo>
        </Button>
      </ScreenWrapper>
    )
    
    return (
      <ScreenWrapper>
        <View style={styles.header}>
          <Button style={styles.backButton} onPress={() => router.back()}>
            <Typo>← Back</Typo>
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
            <Typo size={24} fontWeight="600">{playlistData?.title}</Typo>
          )}
          
          <View style={styles.cardsContainer}>
            <Typo size={18} fontWeight="500">Cards ({playlistData?.cardList.length || 0})</Typo>
            <ScrollView style={styles.cardsList}>
              {playlistData?.cardList.map((cardId, index) => (
                <View key={index} style={styles.cardItem}>
                  <Typo>Card {cardId}</Typo>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
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
    }
  })