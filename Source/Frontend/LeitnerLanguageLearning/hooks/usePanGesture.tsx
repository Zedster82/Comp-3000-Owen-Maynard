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
  

  const translationX = useSharedValue<number>(0);
  const translationY = useSharedValue<number>(0);
  const prevTranslationX = useSharedValue<number>(0);
  const prevTranslationY = useSharedValue<number>(0);

  const animatedStyles = useAnimatedStyle(() => {
    // console.log("Animated Style Updated:", translationX.value, translationY.value); // Style debugging
    const transformProperties = {
      transform: [
        { translateX: translationX.value },
        { translateY: translationY.value },
      ],
    };
    //console.log("Animated Style Updated:", transformProperties); // Style debugging
    return transformProperties;
  });

  

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      isDragging.current = true;
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
      console.log("Gesture started:", isDragging.current);
    })
    .onUpdate((event) => {
      translationX.value = prevTranslationX.value + event.translationX;
      translationY.value = prevTranslationY.value + event.translationY;
      console.log("Gesture updated:", translationX.value, translationY.value);
    })
    .onEnd(() => {
      isDragging.current = false;
      console.log("Gesture finished:", isDragging.current);
      if (translationX.value > SWIPE_THRESHOLD) {
        handleSwipe('right');
      } else if (translationX.value < -SWIPE_THRESHOLD) {
        handleSwipe('left');
      } else {
        
      }
      translationX.value = withSpring(0, SPRING_CONFIG);
      translationY.value = withSpring(0, SPRING_CONFIG);
    }).runOnJS(true);

  return { pan, animatedStyles };
};