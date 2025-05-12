import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Input } from "@rneui/themed";
import Button from "../Button";
import { AddCardProps, ModalReturnProps } from "@/types";
import { colors } from "@/constants/theme";
import Typo from "../Typo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Scroll } from "phosphor-react-native";
import { useUserID } from "@/hooks/useUserID";
import { get } from "http";

const AddCard = ({
  visible = false,
  setVisible,
  returnHandler,
}: AddCardProps) => {
  const [cardID, setCardID] = useState("");
  const [cards, setCards] = useState<any[]>([]);
  const { userID, setUserID } = useUserID(); // Custom hook to manage user ID

  const getUserIDAndFetchCards = async () => {
    console.log("User ID:", userID);
    if (userID) {
      try {
        const response = await fetch(
          `http://localhost:8282/api/flashcards/${userID}`
        );
        const data = await response.json();
        setCards(data.flashcards || []);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    }
  };

  useEffect(() => {
    getUserIDAndFetchCards();
    console.log("Visibility updated");
  }, [visible]);

  const handleAddCard = () => {};

  const handleSubmit = (cardID: string) => {
    returnHandler(cardID);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={getUserIDAndFetchCards}>
        <Typo>Refresh</Typo>
      </TouchableOpacity>
      <Typo color={colors.main}>Add Card</Typo>

      <Typo style={{ marginTop: 16, marginBottom: 8 }}>Cards:</Typo>

      <ScrollView>
        {cards.map((card, index) => (
          <TouchableOpacity onPress={() => handleSubmit(card._id)} key={index}>
            <View key={index} style={styles.cardItem}>
              <Typo>{card.question}</Typo>
              <Typo>{card.answer}</Typo>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default AddCard;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  mainColour: {
    color: colors.main,
  },
  cardItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "100%",
  },
});
