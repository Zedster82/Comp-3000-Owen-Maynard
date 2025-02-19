import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Input } from '@rneui/themed'
import Button from '../Button'
import { ModalProps, ModalReturnProps } from '@/types'
import { colors } from '@/constants/theme'
import Typo from '../Typo'

const AddPlaylist = (
  {
    visible = false,
    setVisible,
    returnHandler,
  }: ModalReturnProps
) => {

  const [playlistName, setPlaylistName] = useState('')
  const [description, setDescription] = useState('')
  const [cards, setCards] = useState<string[]>([])

  const handleAddPlaylist = () => {
    
    returnHandler(playlistName, description, cards)

    
  }



  return (


    <View style={[styles.container]}>
      <Typo color={colors.main}>Add Playlist</Typo>
      <Input
        style={styles.mainColour}
        placeholder="Enter Playlist Name"
        value={playlistName}
        onChangeText={(text) => setPlaylistName(text)}
      />
      <Input
        placeholder="Enter Description"
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <Input
        placeholder="Add Cards"
        
        onChangeText={(text) => setCards(cards.concat(text))}
      />
      <Button onPress={handleAddPlaylist}>
        <Typo>Add Playlist</Typo>
      </Button>
    </View>
  )
}

export default AddPlaylist

const styles = StyleSheet.create({

  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainColour: {
    color: colors.main
  }
})