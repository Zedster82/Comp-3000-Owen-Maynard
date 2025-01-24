import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect } from 'react'
import { colors } from '@/constants/theme'
import { useRouter } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import Button from '@/components/Button'
import { horizontalScale } from '@/utils/styling'
import Animated, { FadeIn } from 'react-native-reanimated'

const index = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push('/(auth)/Login');
    }, 2000);
  }, [])

  return (
    <ScreenWrapper style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={[styles.container, { height: '80%', width: '90%', borderRadius: 20, padding: 20, justifyContent: 'space-around', backgroundColor: colors.neutral800}]}>
        <Typo color='aqua'>Welcome</Typo>
      </View>
    </ScreenWrapper>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

