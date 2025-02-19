import { StyleSheet, Text, TextStyle, View } from 'react-native'
import React from 'react'
import { colors } from '@/constants/theme'
import { TypoProps } from '@/types'
import { verticalScale } from '@/utils/styling'

const Typo = ({
    size,
    color = colors.subcolor, 
    fontWeight = "200", 
    children, 
    style, 
    textProps,
    bold
}: TypoProps) => {
    
        const textStyle: TextStyle = {
            fontSize: size? verticalScale(size) : verticalScale(18),
            color: color,
            fontWeight: fontWeight,
            fontFamily: bold ? 'Arial' : 'Arial'
        }
  return <Text style={[textStyle, style]} {...textProps}>{children}</Text>
}

export default Typo;

const styles = StyleSheet.create({})