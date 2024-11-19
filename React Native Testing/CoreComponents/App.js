import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native';

import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { Animated, useSharedValue, useAnimatedStyle } from 'react-native-reanimated'; 

import { PanGestureHandler, State} from 'react-native-gesture-handler';
import React, { useState } from 'react';


import { ImageBackground } from 'react-native-web';

const image = require('./assets/cat photo.jpeg');





const Flashcard = ({ question, answer, onPress, isFlipped }) => {

  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);


  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translationX.value,
        },
        {
          translateY: translationY.value,
        },
      ],
    };
  });

  const panGestureEvent = (event) => {
    translationX.value = event.nativeEvent.translationX;
    translationY.value = event.nativeEvent.translationY;
  };

  return (
    <PanGestureHandler
      onGestureEvent={panGestureEvent}
      onHandlerStateChange={(event) => {}}
    >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={onPress}>
          <Animated.View style={[animatedStyle]}>
            {isFlipped ? (
              <Text style={{ textAlign: 'center' }}>{answer}</Text>
            ) : (
              <Text style={{ textAlign: 'center' }}>{question}</Text>
            )}
          </Animated.View>
        </TouchableOpacity>
      </View>
    </PanGestureHandler>
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

  const handleSwipe = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  };

  return (
    <View>
      <Flashcard
        question={flashcards[currentIndex].question}
        answer={flashcards[currentIndex].answer}
        onPress={handlePress}
        isFlipped={isFlipped}
      />
    </View>
  );
};

export default function App() {
  return (
    <View style={{ flex : 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'powderblue',  }}>

      <View style={{borderRadius: 10, height: 200, width: 200}}>
        <ImageBackground source={image} style={{ flex: 1, width: 200, height: 200, margin: 10 }}>
          <Text style={{ textAlign: 'center' }}>Wrong</Text>
        </ImageBackground>
      </View>

      <View style={{ flexDirection: 'row', backgroundColor: 'plum', borderRadius: 10, padding: 20, width: 400}}>
        <FlashcardScreen />
      </View>

      <View style={{borderRadius: 10, height: 200, width: 200}}>
        <ImageBackground source={image} style={{ flex: 1}}>
          <Text style={{ textAlign: 'center' }}>Right</Text>
        </ImageBackground>
      </View>

    </View>
  );
}