import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { colors } from '@/constants/theme'
import { useRouter } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import Button from '@/components/Button'
import { horizontalScale } from '@/utils/styling'
import Toast from 'react-native-toast-message'
import { Input } from '@rneui/themed'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const Login = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const loginButton = async () => {
    try {
      const response = await axios.post('http://localhost:8282/api/auth/login', {
        username,
        password,
      });
      if (response.status === 200 && response.data.token) {
        await AsyncStorage.setItem('jwt', response.data.token);
        router.push('/Homepage');
        return;
      }
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: response.data.message || 'Incorrect username or password',
        position: 'bottom',
        visibilityTime: 1000,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error?.response?.data?.message || 'Incorrect username or password',
        position: 'bottom',
        visibilityTime: 1000,
      });
    }
  };

  return (
    <ScreenWrapper style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={[styles.container, { height: '80%', width: '90%', borderRadius: 20, padding: 20, justifyContent: 'space-around', backgroundColor: colors.neutral800 }]}>
        <Typo color='aqua'>Login Page</Typo>
        <Typo size={12}>Please Login, or register if you do not have an account</Typo>
        
        <View style={styles.inputContainer}>
          <Input
            placeholder="Username"
            leftIcon={{ type: 'font-awesome', name: 'user', color: colors.neutral400 }}
            onChangeText={value => setUsername(value)}
            value={username}
            inputStyle={{ color: colors.neutral100 }}
            containerStyle={styles.inputField}
            placeholderTextColor={colors.neutral400}
          />
          <Input
            placeholder="Password"
            leftIcon={{ type: 'font-awesome', name: 'lock', color: colors.neutral400 }}
            onChangeText={value => setPassword(value)}
            value={password}
            secureTextEntry
            inputStyle={{ color: colors.neutral100 }}
            containerStyle={styles.inputField}
            placeholderTextColor={colors.neutral400}
          />
        </View>

        <Button onPress={loginButton} loading={loading}>
          <Typo fontWeight={'400'}>Login</Typo>
        </Button>
        <Button onPress={() => router.push('/Register')}>
          <Typo fontWeight={'400'}>Register</Typo>
        </Button>
        <Toast />
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
  },
  inputField: {
    width: '100%',
    backgroundColor: colors.neutral900,
    borderWidth: horizontalScale(1),
    borderColor: colors.neutral400,
    borderRadius: 10,
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
