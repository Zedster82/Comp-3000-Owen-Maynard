import { useRef } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

const SPRING_CONFIG = {
  damping: 30,
  stiffness: 1000,
  mass: 6,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

const SWIPE_THRESHOLD = 150;

export const usePanGesture = (handleSwipe: (direction: string) => void) => {
  const isDragging = useRef(false);
  const blockTap = useRef(false);

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
      isDragging.current = true;
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      translationX.value = prevTranslationX.value + event.translationX;
      translationY.value = prevTranslationY.value + event.translationY;
    })
    .onEnd(() => {
      isDragging.current = false;
      if (translationX.value > SWIPE_THRESHOLD) {
        handleSwipe('right');
      } else if (translationX.value < -SWIPE_THRESHOLD) {
        handleSwipe('left');
      } else {
        translationX.value = withSpring(0, SPRING_CONFIG);
        translationY.value = withSpring(0, SPRING_CONFIG);
      }
      blockTap.current = true;
      setTimeout(() => {
        blockTap.current = false;
      }, 200);
    });

  return { pan, animatedStyles, blockTap };
};