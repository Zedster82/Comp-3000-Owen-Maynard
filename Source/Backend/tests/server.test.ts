import axios from 'axios';
import { describe, it, expect } from 'vitest';
import request from 'supertest';

// Define the base URL for your server
const BASE_URL = 'http://localhost:8282';

describe('Server Tests', () => {
  it('GET / - should return 200 OK to verify server is running', async () => {
    try {
      const response = await axios.get(BASE_URL);
      expect(response.status).toBe(200);
    } catch (error: any) {
      // Fail the test if there's a connection error
      throw new Error('Could not connect to server: ' + error.message);
    }
  });



  it("Flashcard manual", async () => {
    const res = await request(BASE_URL)
      .post('/api/flashcards')
      .send({
        userID: "1",
        question: "What is the capital of France?",
        answer: "Paris",
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    const flashcardId = res.body.id;

    const res2 = await request(BASE_URL).get('/api/flashcards');
    expect(res2.statusCode).toEqual(200);
    expect(res2.body).toBeInstanceOf(Array);
    expect(res2.body.length).toBeGreaterThanOrEqual(1);
    const foundFlashcard = res2.body.find((card: any) => card._id === flashcardId);
    expect(foundFlashcard).toBeDefined();

    const res3 = await request(BASE_URL).get(`/api/flashcards/${flashcardId}`);
    expect(res3.statusCode).toEqual(200);
    expect(res3.body._id).toBe(flashcardId);
    expect(res3.body.question).toBe("What is the capital of France?");
    expect(res3.body.answer).toBe("Paris");

    const res4 = await request(BASE_URL)
      .put(`/api/flashcards/${flashcardId}`)
      .send({
        userID: "1",
        question: "What is the capital of Spain?",
        answer: "Madrid",
      });
    expect(res4.statusCode).toEqual(200);
    expect(res4.body).toHaveProperty('question', 'What is the capital of Spain?');
    expect(res4.body).toHaveProperty('answer', 'Madrid');

    const res5 = await request(BASE_URL).delete(`/api/flashcards/${flashcardId}`);
    expect(res5.statusCode).toEqual(204);
  });
});

