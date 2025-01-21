import { StyleSheet, Text, View, Animated} from 'react-native'
import React, { useRef, useState } from 'react'
import FlashCard from '@/components/FlashCard'
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import {Gesture, GestureDetector, GestureHandlerRootView,} from 'react-native-gesture-handler';
import { usePanGesture } from '@/hooks/usePanGesture';
import ScreenWrapper from '@/components/ScreenWrapper';


const Homepage = () => {
  
  
  
  
  

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [flashcards, setFlashcards] = useState([
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is 2 + 2?", answer: "4" }
  ]);
  

  

  const handleSwipe = (direction: string) => {
    if (direction === 'right') {
      console.log('Correct Answer');
      // Add custom logic for "Right" swipe (e.g., marking correct)
    } else if (direction === 'left') {
      console.log('Incorrect Answer');
      // Add custom logic for "Left" swipe (e.g., marking incorrect)
    }
  
    // Move to the next card
    // setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    // setIsFlipped(false); // Reset the flip state for the next card
  
    // Reset card position
    setCurrentIndex((prevIndex) => (prevIndex + 1) % 2);
    setIsFlipped(false);
  };

  const { pan, animatedStyles} = usePanGesture(handleSwipe);

  
  
    

  return (
    <ScreenWrapper style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Animated.View style={[styles.cardContainer,]}>
        <GestureHandlerRootView style={styles.cardContainer}>
          <GestureDetector gesture={pan}>
            
            <Animated.View style={[styles.handlerCard, animatedStyles]}>
              {/* <FlashCard content={flashcards[0]} /> */}
              {/* <FlashCard content={flashcards[1]} /> */}
            </Animated.View>
            
          </GestureDetector>
        </GestureHandlerRootView>
      </Animated.View>
    </ScreenWrapper>
  )
}

export default Homepage

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  handlerCard:{
    backgroundColor: 'plum',
    borderRadius: 10,
    width: '70%',
    height: '60%',
  },
  fullDisplay:{
    width: '100%',
    height: '100%',
  },
  animatedTest:
  {
    transform: [{translateX: 0}, {translateY: 0}]
  }
  
})