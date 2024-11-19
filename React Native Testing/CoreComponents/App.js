import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated'; 
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import { PanGestureHandler, State} from 'react-native-gesture-handler';
import {Gesture, GestureDetector, GestureHandlerRootView,} from 'react-native-gesture-handler';
import { ImageBackground } from 'react-native-web';

const image = require('./assets/cat photo.jpeg');



function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

const { width, height } = Dimensions.get('screen');


const Flashcard = ({ question, answer, onPress, isFlipped }) => {

  

  

  return (

    <Animated.View style={{ flex: 1 }}>
      <TouchableOpacity onPress={onPress} style={styles.mainFlex}>
        <Animated.View  >
          {isFlipped ? (
            <Text style={{ textAlign: "center" }}>{answer}</Text>
          ) : (
            <Text style={{ textAlign: "center" }}>{question}</Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>

  );

  
};

const FlashcardScreen = () => {
  const [flashcards, setFlashcards] = useState([
    { question: 'What is the capital of France?', answer: 'Paris' },
    { question: 'What is the largest planet in our solar system?', answer: 'Jupiter' },
    // Add more flashcards here...
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handlePress = () => {
    setIsFlipped(!isFlipped);
  };



  return (
    <View style={styles.mainFlex}>
      <Flashcard style={styles.mainFlex}
        question={flashcards[currentIndex].question}
        answer={flashcards[currentIndex].answer}
        onPress={handlePress}
        isFlipped={isFlipped}
      />
    </View>
  );
};

export default function App() {

  const SWIPE_THRESHOLD = 150; // Distance to trigger a swipe action

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
  }));


  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      const maxTranslateX = width / 2 - 50; // Half screen width minus card width
      const maxTranslateY = height / 2 - 50; // Half screen height minus card height

      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY
      );
    })
    .runOnJS(true);


  return (
    <View style={{ flex : 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'powderblue',  }}>

      <View style={{borderRadius: 10, height: 200, width: 200}}>
        <ImageBackground source={image} style={{ flex: 1, width: 200, height: 200, margin: 10 }}>
          <Text style={{ textAlign: 'center' }}>Wrong</Text>
        </ImageBackground>
      </View>

      <Animated.View>
        <GestureHandlerRootView style={styles.container}>
          <GestureDetector gesture={pan}>
            <Animated.View style={[{ flexDirection: 'row', backgroundColor: 'plum', borderRadius: 10, padding: 20, width: 400, height: 400 } , animatedStyles,]}>
              <FlashcardScreen />
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>
      </Animated.View>

      <View style={{borderRadius: 10, height: 200, width: 200}}>
        <ImageBackground source={image} style={{ flex: 1}}>
          <Text style={{ textAlign: 'center' }}>Right</Text>
        </ImageBackground>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  mainFlex: {
    flex: 1,
  },
});