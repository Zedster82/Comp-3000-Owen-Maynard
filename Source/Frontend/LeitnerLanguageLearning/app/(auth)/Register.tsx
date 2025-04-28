import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import Button from '@/components/Button'
import { Input } from '@rneui/themed'
import { colors } from '@/constants/theme'
import { horizontalScale } from '@/utils/styling'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const Register = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:8282/api/auth/register', {
        username,
        email,
        password,
      });
      if (response.status === 200) {
        // If your backend returns a token on register, store it:
        if (response.data.token) {
          await AsyncStorage.setItem('jwt', response.data.token);
          router.push('/Homepage');
        } else {
          Toast.show({
            type: 'success',
            text1: 'Registration Successful',
            text2: 'Redirecting to login...',
            position: 'bottom',
            visibilityTime: 1000,
          });
          setTimeout(() => {
            router.push('/Login');
          }, 1000);
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: response.data.message || 'Please try again',
          position: 'bottom',
          visibilityTime: 1000,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error?.response?.data?.message || 'Please try again',
        position: 'bottom',
        visibilityTime: 1000,
      });
    }
  }

  return (
    <ScreenWrapper style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={[styles.container, { height: '80%', width: '90%', borderRadius: 20, padding: 20, justifyContent: 'space-around', backgroundColor: colors.neutral800 }]}>
        <Typo color='aqua' size={24} fontWeight={'600'}>Create Account</Typo>
        <Typo size={12}>Please fill in your details to register</Typo>

        <View style={styles.inputContainer}>
          <Input
            placeholder="Email"
            leftIcon={{ type: 'font-awesome', name: 'envelope', color: colors.neutral400 }}
            onChangeText={value => setEmail(value)}
            value={email}
            inputStyle={{ color: colors.neutral100 }}
            containerStyle={styles.inputField}
            placeholderTextColor={colors.neutral400}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            placeholder="Username"
            leftIcon={{ type: 'font-awesome', name: 'user', color: colors.neutral400 }}
            onChangeText={value => setUsername(value)}
            value={username}
            inputStyle={{ color: colors.neutral100 }}
            containerStyle={styles.inputField}
            placeholderTextColor={colors.neutral400}
            autoCapitalize="none"
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

        <Button onPress={handleRegister} loading={loading}>
          <Typo fontWeight={'400'}>Register</Typo>
        </Button>
        
        <Button onPress={() => router.push('/Login')}>
          <Typo fontWeight={'400'}>Back to Login</Typo>
        </Button>
        
        <Toast />
      </View>
    </ScreenWrapper>
  )
}

export default Register

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