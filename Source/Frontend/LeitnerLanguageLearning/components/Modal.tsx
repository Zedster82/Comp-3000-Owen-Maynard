import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ModalProps } from '@/types'
import Button from './Button'
import Typo from './Typo'

const Modal = ({
    children,
    visible = false,
    setVisible
}: ModalProps) => {
    

    




  return (
    <View style={{ position: 'absolute',  display: visible ? 'flex' : 'none', width: '100%', height: '80%', alignContent:'center', justifyContent:'center'}}>
        <View style={{flex: 10, width: '80%', height: '60%', backgroundColor: 'white', borderRadius: 10, padding: 10, alignSelf: 'center' }}>
            <View style={[{flex: 9}, styles.container]}>
                {children}
            </View>
            <View style={[{flex: 1}, styles.container]}>
                <Button style={{flex: 1}} onPress={() => {setVisible(false)}}> <Typo>Close</Typo></Button>
            </View>
        </View>
      
    </View>
  )
}

export default Modal

const styles = StyleSheet.create({
    container: {
        width: '100%', 
        justifyContent: 'center', 
        alignItems: 'center'
    }
})