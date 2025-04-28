import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text, Input } from '@rneui/themed'
import { Plus, Trash, Pencil } from 'phosphor-react-native'
import Button from '@/components/Button'
import Typo from '@/components/Typo'
import Modal from '@/components/Modal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { colors } from '@/constants/theme'

const Flashcards = () => {
  const [cards, setCards] = useState<any[]>([])
  const [userID, setUserID] = useState<string | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editCard, setEditCard] = useState<any>(null)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  // Fetch all cards for the user
  const getUserIDAndFetchCards = async () => {
    let id = await AsyncStorage.getItem('userID')
    setUserID(id)
    setUserID('2') // For testing purposes, remove this line in production
    id = '2' // For testing purposes, remove this line in production
    console.log("User ID:", id)
    if (id) {
      try {
        const response = await fetch(
          `http://localhost:8282/api/flashcards/${id}`,
        )
        const data = await response.json()
        setCards(data.flashcards || [])
      } catch (error) {
        console.error("Error fetching cards:", error)
      }
    }
  }

  useEffect(() => {
    getUserIDAndFetchCards()
  }, [])

  // Open modal for new or edit
  const openModal = (card: any = null) => {
    setEditCard(card)
    setQuestion(card ? card.question : '')
    setAnswer(card ? card.answer : '')
    setModalVisible(true)
  }

  // Create or update card
  const handleSave = async () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert('Error', 'Both question and answer are required.')
      return
    }
    try {
      if (editCard) {
        // Edit existing card
        await fetch(`http://localhost:8282/api/flashcards/${editCard._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, answer }),
        })
      } else {
        // Create new card
        await fetch(`http://localhost:8282/api/flashcards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, answer, userID }),
        })
      }
      setModalVisible(false)
      setQuestion('')
      setAnswer('')
      setEditCard(null)
      getUserIDAndFetchCards()
    } catch (error) {
      Alert.alert('Error', 'Failed to save card.')
    }
  }

  // Delete card
  const handleDelete = async (cardId: string) => {
    try {
      await fetch(`http://localhost:8282/api/flashcards/${cardId}`, {
        method: 'DELETE',
      })
      getUserIDAndFetchCards()
    } catch (error) {
      Alert.alert('Error', 'Failed to delete card.')
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Typo size={24} fontWeight="600">Your Flashcards</Typo>
        <TouchableOpacity onPress={() => openModal()} style={styles.iconButton}>
          <Plus size={28} color={colors.main} />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ width: '100%' }}>
        {cards.length === 0 && (
          <Typo style={{ padding: 16 }}>No flashcards found.</Typo>
        )}
        {cards.map((card, idx) => (
          <View key={card._id || idx} style={styles.cardItem}>
            <View style={{ flex: 1 }}>
              <Typo fontWeight="500">{card.question}</Typo>
              <Typo color={colors.neutral400}>{card.answer}</Typo>
            </View>
            <TouchableOpacity onPress={() => openModal(card)} style={styles.iconButton}>
              <Pencil size={22} color={colors.main} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(card._id)} style={styles.iconButton}>
              <Trash size={22} color={colors.errorcolor || 'red'} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Modal visible={modalVisible} setVisible={setModalVisible}>
        <View style={styles.modalContent}>
          <Typo size={18} fontWeight="600">{editCard ? 'Edit Card' : 'New Card'}</Typo>
          <Input
            placeholder="Question"
            value={question}
            onChangeText={setQuestion}
          />
          <Input
            placeholder="Answer"
            value={answer}
            onChangeText={setAnswer}
          />
          <Button style={{ width: '80%' }} onPress={handleSave}>
            <Typo>{editCard ? 'Save Changes' : 'Create Card'}</Typo>
          </Button>
        </View>
      </Modal>
    </View>
  )
}

export default Flashcards

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    width: '100%',
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral700,
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  iconButton: {
    marginLeft: 12,
    padding: 4,
  },
  modalContent: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
  },
})