import { StyleSheet, Text, View, Animated} from 'react-native'
import React, { useRef, useState } from 'react'
import FlashCard from '@/components/FlashCard'
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import {Gesture, GestureDetector, GestureHandlerRootView,} from 'react-native-gesture-handler';
import { usePanGesture } from '@/hooks/usePanGesture';


const Homepage = () => {
  
  
  
  
  

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  

  

  

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

  const { pan, animatedStyles, blockTap } = usePanGesture(handleSwipe);

  
  const handlePress = () => {
    if (!blockTap.current) {
      setIsFlipped((prev) => !prev);
    }
  };
    

  return (
    <GestureHandlerRootView style={styles.cardContainer}>
      <Animated.View style={[styles.cardContainer]}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[{ backgroundColor: 'plum', borderRadius: 10, width: '70%', height: '60%' }, animatedStyles,]}>
            <FlashCard content={flashcards[0]} />
            <FlashCard content={flashcards[1]} />
          </Animated.View>
        </GestureDetector>
      </Animated.View>
    </GestureHandlerRootView>
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
  }
})