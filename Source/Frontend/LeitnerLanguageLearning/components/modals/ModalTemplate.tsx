import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Input } from '@rneui/themed'
import Button from '../Button'
import { ModalProps, ModalReturnProps } from '@/types'

const ModalTemplate = (
    {
        visible = false,
        setVisible,
        returnHandler,
    }: ModalReturnProps
) => {

    const closeHandler = () => {
        setVisible(false)
        returnHandler()
    }



  return (

    
    <View>
      <Text>Add Playlist</Text>
      <Input placeholder="Enter Playlist Name" />
      <Input placeholder="Enter Description" />
      <Input placeholder="Add Cards" />
      <Button onPress={() => {closeHandler}}>Add Playlist</Button>
    </View>
  )
}

export default ModalTemplate

const styles = StyleSheet.create({})