import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FeedBackProps } from '@/types'
import Animated from 'react-native-reanimated'
import Typo from './Typo'

const Feedback = (
    {
        feedbackVisible = false,
        feedbackType,
        fadeAnim, 
        scaleAnim
    }: FeedBackProps
) => {

    



  return (
    feedbackVisible && (
        <Animated.View
          style={[
            styles.feedbackContainer,
            feedbackType === "correct"
              ? styles.correctFeedback
              : styles.incorrectFeedback,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Typo style={styles.feedbackText}>
            {feedbackType === "correct" ? "Correct!" : "Incorrect!"}
          </Typo>

          {/* Simple particle effect */}
          {/* {[...Array(10)].map((_, i) => (
            <View
              key={i}
              style={[
                styles.particle,
                {
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  backgroundColor:
                    feedbackType === "correct" ? "#4CAF50" : "#F44336",
                },
              ]}
            />
          ))} */}
        </Animated.View>
      )
  )
}

export default Feedback

const styles = StyleSheet.create({


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
})