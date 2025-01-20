import { StatusBar } from 'expo-status-bar';
import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'; 
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

const FlashcardScreen = ({ flashcards, currentIndex, isFlipped, handlePress }) => {
  return (
    <View style={styles.mainFlex}>
      <Flashcard
        question={flashcards[currentIndex]?.question}
        answer={flashcards[currentIndex]?.answer}
        onPress={handlePress}
        isFlipped={isFlipped}
      />
    </View>
  );
};

export default function App() {


  const [flashcards, setFlashcards] = useState([
    { question: 'What is the capital of France?', answer: 'Paris' },
    { question: 'What is the largest planet in our solar system?', answer: 'Jupiter' },
    // Add more flashcards here...
  ]);

  const SPRING_CONFIG = {
    damping: 30, // Lower values make the bounce more pronounced
    stiffness: 1000, // Higher values make the spring return faster
    mass: 6, // Controls the "weight" of the spring
    overshootClamping: false, // Set to true to disable overshooting
    restDisplacementThreshold: 0.01, // Threshold for when animation stops
    restSpeedThreshold: 0.01, // Threshold for speed to stop the spring
  };
  

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);


  const isDragging = useRef(false); 
  const blockTap = useRef(false); 

  const SWIPE_THRESHOLD = 150; // Distance to trigger a swipe action

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);


  const handlePress = () => {
    if (!blockTap.current) {
      // Only flip the card if tapping is not blocked
      setIsFlipped((prev) => !prev);
    }
  };
  

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
  }));


  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      isDragging.current = true; // Drag started
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      translationX.value = prevTranslationX.value + event.translationX;
      translationY.value = prevTranslationY.value + event.translationY;
    })
    .onEnd(() => {
      isDragging.current = false; // Drag ended
      if (translationX.value > SWIPE_THRESHOLD) {
        // Swiped right
        console.log('Swiped Right');
        handleSwipe('right');
      } else if (translationX.value < -SWIPE_THRESHOLD) {
        // Swiped left
        console.log('Swiped Left');
        handleSwipe('left');
      } else {
        // Not enough swipe, return to center
        translationX.value = withSpring(0, SPRING_CONFIG);
        translationY.value = withSpring(0, SPRING_CONFIG);
      }
      blockTap.current = true;
      setTimeout(() => {
        blockTap.current = false;
      }, 200); // Adjust debounce duration if needed
    })
    



    const handleSwipe = (direction) => {
      if (direction === 'right') {
        console.log('Correct Answer');
        // Add custom logic for "Right" swipe (e.g., marking correct)
      } else if (direction === 'left') {
        console.log('Incorrect Answer');
        // Add custom logic for "Left" swipe (e.g., marking incorrect)
      }
    
      // Move to the next card
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
      setIsFlipped(false); // Reset the flip state for the next card
    
      // Reset card position
      translationX.value = withSpring(0);
      translationY.value = withSpring(0);
    };





  return (
    <View style={{ flex : 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'powderblue',  }}>

      <View style={{borderRadius: 10, height: 200, width: 200}}>
        <ImageBackground source={image} style={{ flex: 1, width: 200, height: 200, margin: 10 }}>
          <Text style={{ textAlign: 'center' }}>Wrong</Text>
        </ImageBackground>
      </View>

      <Animated.View>
        <GestureHandlerRootView >
          <GestureDetector gesture={pan}>
            <Animated.View style={[{ flexDirection: 'row', backgroundColor: 'plum', borderRadius: 10, padding: 20, width: 400, height: 400 } , animatedStyles,]}>
            <FlashcardScreen
              flashcards={flashcards}
              currentIndex={currentIndex}
              isFlipped={isFlipped}
              handlePress={handlePress} // Pass as a prop
            />
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