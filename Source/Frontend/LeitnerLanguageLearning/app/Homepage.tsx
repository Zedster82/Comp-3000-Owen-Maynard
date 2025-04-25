import { StyleSheet, Text, View, Animated } from "react-native";
import React, { useRef, useState, useEffect } from "react";
import FlashCard from "@/components/FlashCard";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { usePanGesture } from "@/hooks/usePanGesture";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Audio } from "expo-av";
import Button from "@/components/Button";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";
import Feedback from "@/components/Feedback";

const Homepage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [flashcards, setFlashcards] = useState([
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is 2 + 2?", answer: "4" },
  ]);

  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"correct" | "incorrect">(
    "correct"
  );
  const [results, setResults] = useState({ correct: 0, incorrect: 0 });

  const fadeAnim = useRef(new Animated.Value(10)).current;
  const scaleAnim = useRef(new Animated.Value(2)).current;

  const [correctSound, setCorrectSound] = useState<Audio.Sound | undefined>();
  const [incorrectSound, setIncorrectSound] = useState<Audio.Sound | undefined>();

  useEffect(() => {
    const loadSounds = async () => {
      const { sound: correctSfx } = await Audio.Sound.createAsync(
        require("@/assets/sounds/correct.mp3")
      );
      const { sound: incorrectSfx } = await Audio.Sound.createAsync(
        require("@/assets/sounds/incorrect.mp3")
      );

      setCorrectSound(correctSfx);
      setIncorrectSound(incorrectSfx);
    };

    loadSounds();

    return () => {
      // Unload sounds when component unmounts
      if (correctSound) correctSound.unloadAsync();
      if (incorrectSound) incorrectSound.unloadAsync();
    };
  }, []);

  const handleSwipe = (direction: string) => {
    if (direction === "right") {
      setFeedbackType("correct");
      setResults((prev) => ({ ...prev, correct: prev.correct + 1 }));
      showFeedback();
      if (correctSound) correctSound.replayAsync();
    } else if (direction === "left") {
      setFeedbackType("incorrect");
      setResults((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
      showFeedback();
      if (incorrectSound) incorrectSound.replayAsync();
    }
    
    setTimeout(() => {
      
      setIsFlipped(false);
    }, 450);
    
    // Reset card position
    setTimeout(() => {
      
      setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    }, 600);
    
    
  };

  const { pan, animatedStyles } = usePanGesture(handleSwipe);

  const showFeedback = () => {
    setFeedbackVisible(true);

    // Animate feedback appearance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Hide feedback after delay
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.5,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start(() => setFeedbackVisible(false));
    }, 50);
  };

  return (
    <ScreenWrapper style={styles.fullDisplay}>
      <GestureHandlerRootView style={styles.fullDisplay}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.handlerCard, animatedStyles]}>
            <FlashCard content={flashcards[currentIndex]}  isFlipped={isFlipped} setFlipped={setIsFlipped}  />
            {/* <FlashCard content={flashcards[1]} /> */}
          </Animated.View>
        </GestureDetector>
        <Feedback
          feedbackVisible={feedbackVisible}
          feedbackType={feedbackType}
          fadeAnim={fadeAnim}
          scaleAnim={scaleAnim}/>
      </GestureHandlerRootView>
      <View style={styles.resultsContainer}>
        <Typo>Correct: {results.correct}</Typo>
        <Typo>Incorrect: {results.incorrect}</Typo>
      </View>
    </ScreenWrapper>
  );
};





export default Homepage;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  handlerCard: {
    position: "relative",
    borderRadius: 10,
    width: "70%",
    height: "60%",
  },
  fullDisplay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  animatedTest: {
    transform: [{ translateX: 300 }, { translateY: 200 }],
  },
  feedbackContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  correctFeedback: {
    backgroundColor: "rgba(76, 175, 80, 0.3)", // Green with transparency
  },
  incorrectFeedback: {
    backgroundColor: "rgba(244, 67, 54, 0.3)", // Red with transparency
  },
  feedbackText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  particle: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  resultsContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
  },
});
