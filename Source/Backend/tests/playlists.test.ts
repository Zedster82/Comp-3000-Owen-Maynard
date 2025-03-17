import { describe, it, expect } from 'vitest';
import request from 'supertest';
// Remove app import
const BASE_URL = 'http://localhost:8282'; 

describe('Playlist Endpoints', () => {

    let playlistId = null; 
    it('should create a new playlist', async () => {
        const res = await request(BASE_URL)
            .post('/api/playlists')
            .send({
                name: 'My Playlist',
                description: 'A cool playlist',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        playlistId = res.body.id;
    });

    

    it('should fetch all playlists', async () => {
        const res = await request(BASE_URL).get('/api/playlists');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
    });

    it('should fetch a single playlist by ID', async () => {
        
        const res = await request(BASE_URL).get(`/api/playlists/${playlistId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id', playlistId);
    });

    it('should update a playlist', async () => {
        
        const res = await request(BASE_URL)
            .put(`/api/playlists/${playlistId}`)
            .send({
                name: 'Updated Playlist',
                description: 'An updated description',
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('name', 'Updated Playlist');
    });

    it('should delete a playlist', async () => {
        
        const res = await request(BASE_URL).delete(`/api/playlists/${playlistId}`);
        expect(res.statusCode).toEqual(204);
    });
});