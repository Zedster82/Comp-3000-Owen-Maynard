import { StyleSheet, Text, TextInput, View} from 'react-native'
import React, { useEffect, useState } from 'react'
import { colors } from '@/constants/theme'
import { useRouter } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import Button from '@/components/Button'
import { horizontalScale } from '@/utils/styling'
import Animated, { FadeIn } from 'react-native-reanimated'
import { Input } from '@rneui/themed'
import Auth from '@/components/Auth'
// import { Session } from '@supabase/supabase-js'
// import { supabase } from '@/utils/supabase'


const Login = () => {
  const router = useRouter();
  

  const loginButton = () => {
    console.log('Login Button Pressed');
    router.push('/Homepage');
  };

  // const [session, setSession] = useState<Session | null>(null)

  // useEffect(() => {
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session)
  //   })

  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session)
  //   })
  // }, [])



  



  return (
    <ScreenWrapper style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={[styles.container, { height: '80%', width: '90%', borderRadius: 20, padding: 20, justifyContent: 'space-around', backgroundColor: colors.neutral800 }]}>
        <Typo color='aqua'>Login Page</Typo>
        <Typo size={12}>Please Login, or register if you do not have an account</Typo>
        <Animated.View
          entering={FadeIn.duration(1000)}
          style={{ height: 100, width: 100, backgroundColor: 'red' }}
        />

        {/* <Auth /> */}
        {/* <Typo>{session && session.user && <Text>{session.user.id}</Text>}</Typo> */}

        <Button onPress={() => loginButton}>
          <Typo fontWeight={'400'}>Login</Typo>
        </Button>
        <Button onPress={() => router.push('/Playlists')}>
          <Typo fontWeight={'400'}>Register</Typo>
        </Button>
      </View>
    </ScreenWrapper>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral900,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
