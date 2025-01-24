import { StyleSheet, Text, View, Animated } from 'react-native'
import React, { useRef, useState } from 'react'
import FlashCard from '@/components/FlashCard'
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView, } from 'react-native-gesture-handler';
import { usePanGesture } from '@/hooks/usePanGesture';
import ScreenWrapper from '@/components/ScreenWrapper';
import Button from '@/components/Button';
import Typo from '@/components/Typo';


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

  const { pan, animatedStyles } = usePanGesture(handleSwipe);

  const translationXTest = useSharedValue<number>(0);
  const translationYTest = useSharedValue<number>(0);


  const animatedStylesTest = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationXTest.value },
      { translateY: translationYTest.value },
    ],
  }));

  const testPress = () => {
    translationXTest.value += 50;
    translationYTest.value += 50;
  };





  return (
    <ScreenWrapper style={styles.fullDisplay}>

      <GestureHandlerRootView style={styles.fullDisplay}>
        <GestureDetector gesture={pan}>

          <Animated.View style={[styles.handlerCard, styles.animatedTest]}>
            {/* <FlashCard content={flashcards[0]} /> */}
            {/* <FlashCard content={flashcards[1]} /> */}
          </Animated.View>

        </GestureDetector>
      </GestureHandlerRootView>


      <Typo>X Value: {translationXTest.value}</Typo>
      <Typo>Y Value: {translationYTest.value}</Typo>
      <Button onPress={testPress}>
        <Typo>Test Button</Typo>
      </Button>
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
  handlerCard: {
    position: 'relative',
    backgroundColor: 'plum',
    borderRadius: 10,
    width: '70%',
    height: '60%',
  },
  fullDisplay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  animatedTest:
  {
    transform: [
      { translateX: 300 },
      { translateY: 200 },
    ]
  }

})