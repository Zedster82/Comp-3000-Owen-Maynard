import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
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

  const closeHandler = () => {
    returnHandler()
    setVisible(false)
    console.log('Close Handler')

  }



  return (


    <View style={[styles.container, ]}>
      <Typo color={colors.main}>Add Playlist</Typo>
      <Input placeholder="Enter Playlist Name" />
      <Input placeholder="Enter Description" />
      <Input placeholder="Add Cards" />
      <Button onPress={() => { closeHandler }}><Typo>Add Playlist</Typo></Button>
    </View>
  )
}

export default AddPlaylist

const styles = StyleSheet.create({

  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})