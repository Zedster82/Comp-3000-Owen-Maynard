import axios from 'axios';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

import { IFlashcard } from '../models/flashcards.js';

const BASE_URL = 'http://localhost:8282';

describe('Flashcards API Integration Tests', () => {
  // Store created flashcard ID for later tests
  let flashcardID: string;
  
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
      if (response.data.message == 'Flashcard created successfully') {
        console.log(response.data.flashcard)
        flashcardID = response.data.flashcard._id; // Assuming the response contains the created flashcard
      }
      
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
      console.log("Get Flashcards, Flashcard ID: ", flashcardID)
      console.log("Get Flashcards, Body Flashcard ID: ", response.data.flashcards[0]._id)
      console.log("Get Flashcards Response: ", response.data)
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data.flashcards)).toBe(true);
      expect(response.data.flashcards[0]._id).toBe(flashcardID);
      
      // flashcardID = response.data.flashcards[0]._id; // Assuming the first flashcard is the one we just created
      // Check if our created flashcard is in the list
      // expect(response.data.flashcard).contains(testFlashcard)
    } catch (error: any) {
      console.error('Error retrieving flashcards:', error.response?.data || error.message);
      throw error;
    }
  });

  // Test getting a specific flashcard
  // it('should retrieve a specific flashcard by ID', async () => {
  //   try {
  //     const response = await axios.get(`${BASE_URL}/api/flashcards/${flashcardID}`);
  //     console.log("Get flashcard by ID Response: ", response.data)
  //     expect(response.status).toBe(200);
  //     expect(response.data.id).toBe(flashcardID);
  //     expect(response.data.question).toBe(testFlashcard.question);
  //     expect(response.data.answer).toBe(testFlashcard.answer);
  //     expect(response.data.correctCount).toBe(testFlashcard.correctCount);
  //     expect(response.data.failCount).toBe(testFlashcard.failCount);
  //     expect(response.data.priority).toBe(testFlashcard.priority);
  //   } catch (error: any) {
  //     console.error('Error retrieving specific flashcard:', error.response?.data || error.message);
  //     throw error;
  //   }
  // });

  // Test updating a flashcard
  it('should update an existing flashcard', async () => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/api/flashcards/${flashcardID}`, 
        updatedFlashcard
      );
      console.log("Response: ", response.data)
      expect(response.status).toBe(200);
      
      expect(response.data.flashcard.question).toBe(updatedFlashcard.question);
      expect(response.data.flashcard.answer).toBe(updatedFlashcard.answer);
      // expect(response.data.flashcard.correctCount).toBe(updatedFlashcard.correctCount);
      // expect(response.data.flashcard.failCount).toBe(updatedFlashcard.failCount);
      // expect(response.data.flashcard.priority).toBe(updatedFlashcard.priority);
    } catch (error: any) {
      console.error('Error updating flashcard:', error.response?.data || error.message);
      throw error;
    }
  });

  // Test deleting a flashcard
  it('should delete an existing flashcard', async () => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/flashcards/${flashcardID}`);
      
      expect(response.status).toBe(200);
      
      // Verify the flashcard is truly deleted
      try {
        await axios.get(`${BASE_URL}/api/flashcards/${flashcardID}`);
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
