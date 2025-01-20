import { StyleSheet, Text, View, Platform, Dimensions, StatusBar } from 'react-native'
import React from 'react'
import { colors } from '@/constants/theme';
import { ScreenWrapperProps } from '@/types';


const height= Dimensions.get('window').height; 

const ScreenWrapper = ({style, children}: ScreenWrapperProps) => {
    let paddingTop = Platform.OS == 'ios' ? height * 0.06 : 50;
  return (
    <View style={[{paddingTop: paddingTop, flex: 1, backgroundColor: colors.neutral900}, style]}>
      <StatusBar barStyle={'light-content'} />

      {children}

    </View>
  )
}

export default ScreenWrapper;

const styles = StyleSheet.create({})