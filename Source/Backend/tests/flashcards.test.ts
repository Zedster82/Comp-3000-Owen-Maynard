import axios from 'axios';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { IFlashcard } from '../models/flashcards.js';

const BASE_URL = 'http://localhost:8282';

describe('Flashcards API Integration Tests', () => {
  // Store created flashcard ID for later tests
  let flashcardId: string;
  
  // Test data using IFlashcard interface
  const testFlashcard: Omit<IFlashcard, '_id'> = {
    userID: "1",
    question: "What is the capital of France?",
    answer: "Paris",
    correctCount: 0,
    failCount: 0,
    priority: 1
  };

  const updatedFlashcard: Omit<IFlashcard, '_id'> = {
    userID: "1",
    question: "What is the capital of Spain?",
    answer: "Madrid",
    correctCount: 0,
    failCount: 0,
    priority: 1
  };

  // Test creation of a flashcard
  it('should create a new flashcard', async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/flashcards`, testFlashcard);
      
      expect(response.status).toBe(201);
      // expect(response).toHaveProperty('id');
      
      
      // Save the ID for subsequent tests
      flashcardId = response.data.id;
      console.log("Create flashcard response: ", response.data)
    } catch (error: any) {
      console.error('Error creating flashcard:', error.response?.data || error.message);
      throw error;
    }
  });

  // Test getting all flashcards
  it('should retrieve all flashcards', async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/flashcards/${testFlashcard.userID}`);
      console.log("Get Flashcards Response: ", response.data)
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeGreaterThanOrEqual(1);
      
      // Check if our created flashcard is in the list
      const foundFlashcard = response.data.find((card: any) => card.id === flashcardId);
      expect(foundFlashcard).toBeDefined();
    } catch (error: any) {
      console.error('Error retrieving flashcards:', error.response?.data || error.message);
      throw error;
    }
  });

  // Test getting a specific flashcard
  it('should retrieve a specific flashcard by ID', async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/flashcards/${flashcardId}`);
      console.log("Get flashcard by ID Response: ", response.data)
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(flashcardId);
      expect(response.data.question).toBe(testFlashcard.question);
      expect(response.data.answer).toBe(testFlashcard.answer);
      expect(response.data.correctCount).toBe(testFlashcard.correctCount);
      expect(response.data.failCount).toBe(testFlashcard.failCount);
      expect(response.data.priority).toBe(testFlashcard.priority);
    } catch (error: any) {
      console.error('Error retrieving specific flashcard:', error.response?.data || error.message);
      throw error;
    }
  });

  // Test updating a flashcard
  it('should update an existing flashcard', async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/flashcards/${flashcardId}`, 
        updatedFlashcard
      );
      console.log("Response: ", response.data)
      expect(response.status).toBe(200);
      expect(response.data.id).toBe(flashcardId);
      expect(response.data.question).toBe(updatedFlashcard.question);
      expect(response.data.answer).toBe(updatedFlashcard.answer);
      expect(response.data.correctCount).toBe(updatedFlashcard.correctCount);
      expect(response.data.failCount).toBe(updatedFlashcard.failCount);
      expect(response.data.priority).toBe(updatedFlashcard.priority);
    } catch (error: any) {
      console.error('Error updating flashcard:', error.response?.data || error.message);
      throw error;
    }
  });

  // Test deleting a flashcard
  it('should delete an existing flashcard', async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/flashcards/${flashcardId}`);
      
      expect(response.status).toBe(204);
      
      // Verify the flashcard is truly deleted
      try {
        await axios.get(`${BASE_URL}/api/flashcards/${flashcardId}`);
        // If we reach here, the test failed as the flashcard still exists
        throw new Error('Flashcard was not deleted');
      } catch (error: any) {
        // expect(error.response.status).toBe(404);
      }
    } catch (error: any) {
      if (error.message === 'Flashcard was not deleted') {
        throw error;
      }
      console.error('Error deleting flashcard:', error.response?.data || error.message);
      throw error;
    }
  });
});
