import {
  Animated,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { colors } from "@/constants/theme";
import { SCREEN_HEIGHT, SCREEN_WIDTH, verticalScale } from "@/utils/styling";
import { FlashCardProps } from "@/types";
import Typo from "./Typo";
import * as ReAnimated from "react-native-reanimated";

const FlashCard = ({
  content,
  isFlipped = false,
  setFlipped = () => {},
}: FlashCardProps) => {
  const flipAnimation = useRef(new Animated.Value(0)).current;

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const flipToFrontStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const flipToBackStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  useEffect(() => {
    Animated.spring(flipAnimation, {
      toValue: isFlipped ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [isFlipped]);

  const flipCard = () => {
    setFlipped(!isFlipped);
  };

  return (
    <View style={[styles.container, { width: "100%", height: "100%" }]}>
      <View style={styles.flippedContainer}>
        <View
          style={[
            styles.flipped,
            isFlipped
              ? { backgroundColor: colors.neutral350 }
              : { backgroundColor: colors.neutral500 },
          ]}
        ></View>
        <View
          style={[
            styles.flipped,
            !isFlipped
              ? { backgroundColor: colors.neutral350 }
              : { backgroundColor: colors.neutral500 },
          ]}
        ></View>
      </View>

      <Animated.View style={styles.cardContainer}>
        <TouchableWithoutFeedback onPress={flipCard}>
          <View style={styles.cardContainer}>
            <Animated.View
              style={[styles.frontCard, styles.card, flipToFrontStyle]}
            >
              <View style={styles.box}>
                <Typo size={20} color={colors.neutral900}>
                  {content.question}
                </Typo>
              </View>
            </Animated.View>

            <Animated.View
              style={[styles.backCard, styles.card, flipToBackStyle]}
            >
              <View style={styles.box}>
                <Typo size={20} color={colors.textLight} bold={true}>
                  {content.answer}
                </Typo>
              </View>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </View>
  );
};

export default FlashCard;

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    borderColor: colors.neutral700,
    borderWidth: verticalScale(1),
    backfaceVisibility: "hidden",
    top: 0,
  },
  container: {
    position: "absolute",
  },
  box: {
    width: "90%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    width: "100%",
    height: "100%",
  },
  flipped: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: colors.neutral500,
    borderWidth: verticalScale(0.5),
    width: "45%",
    height: "100%",
    bottom: 0,
    margin: 5,
  },
  flippedContainer: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    height: "1%",
    bottom: 0,
    margin: 5,
  },
  frontCard: {
    backgroundColor: colors.secondary,
  },
  backCard: {
    backgroundColor: colors.mainLight,
  },
});
