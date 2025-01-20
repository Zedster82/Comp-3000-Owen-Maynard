import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native'
import React from 'react'

const Input = ({
    style,
    children,
    onChangeText,
    value,
    placeholder,
    secureTextEntry,

}: TextInputProps) => {
  return (
    <TextInput onChangeText={onChangeText} value={value} placeholder={placeholder} secureTextEntry={secureTextEntry} style={[style, styles.inputStyle]}>
      {children}
    </TextInput>
  )
}

export default Input

const styles = StyleSheet.create({

    inputStyle:{
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        padding: 10,
        margin: 5,
    }
})