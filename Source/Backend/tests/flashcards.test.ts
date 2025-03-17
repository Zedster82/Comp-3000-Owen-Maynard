import axios from 'axios';
import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:8282';

describe('Flashcards API Integration Tests', () => {
  // Store created flashcard ID for later tests
  let flashcardId: string;
  
  // Test data
  const testFlashcard = {
    userID: "1",
    question: "What is the capital of France?",
    answer: "Paris",
  };

  const updatedFlashcard = {
    userID: "1",
    question: "What is the capital of Spain?",
    answer: "Madrid",
  };

  // Test creation of a flashcard
  it('should create a new flashcard', async () => {
    const response = await axios.post(`${BASE_URL}/api/flashcards`, testFlashcard);
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('_id');
    expect(response.data.question).toBe(testFlashcard.question);
    expect(response.data.answer).toBe(testFlashcard.answer);
    
    // Save the ID for subsequent tests
    flashcardId = response.data._id;
  });

  // Test getting all flashcards
  it('should retrieve all flashcards', async () => {
    const response = await axios.get(`${BASE_URL}/api/flashcards`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data.length).toBeGreaterThanOrEqual(1);
    
    // Check if our created flashcard is in the list
    const foundFlashcard = response.data.find((card: any) => card._id === flashcardId);
    expect(foundFlashcard).toBeDefined();
  });

  // Test getting a specific flashcard
  it('should retrieve a specific flashcard by ID', async () => {
    const response = await axios.get(`${BASE_URL}/api/flashcards/${flashcardId}`);
    
    expect(response.status).toBe(200);
    expect(response.data._id).toBe(flashcardId);
    expect(response.data.question).toBe(testFlashcard.question);
    expect(response.data.answer).toBe(testFlashcard.answer);
  });

  // Test updating a flashcard
  it('should update an existing flashcard', async () => {
    const response = await axios.put(
      `${BASE_URL}/api/flashcards/${flashcardId}`, 
      updatedFlashcard
    );
    
    expect(response.status).toBe(200);
    expect(response.data._id).toBe(flashcardId);
  });

  // Test deleting a flashcard
  it('should delete an existing flashcard', async () => {
    const response = await axios.delete(`${BASE_URL}/api/flashcards/${flashcardId}`);
    
    expect(response.status).toBe(200);
    
    // Verify the flashcard is truly deleted
    try {
      await axios.get(`${BASE_URL}/api/flashcards/${flashcardId}`);
      // If we reach here, the test failed as the flashcard still exists
      throw new Error('Flashcard was not deleted');
    } catch (error: any) {
      expect(error.response.status).toBe(404);
    }
  });
});
