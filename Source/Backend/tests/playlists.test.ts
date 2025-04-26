import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { IPlaylist } from '../models/playlists.js'; // Adjust the import path as needed

const BASE_URL = 'http://localhost:8282'; 

describe('Playlist Endpoints', () => {
    let playlistId: string | null = null;
    
    // Create sample playlist data using the IPlaylist interface
    const newPlaylist: Partial<IPlaylist> = {
        title: 'My Playlist',
        userID: '1', // Assuming userId is a string, adjust as necessary
        
        // Add any other required fields from IPlaylist
    };
    
    const updatedPlaylist: Partial<IPlaylist> = {
        title: 'Updated Playlist', // Changed from 'name' to 'title' to match interface
        userID: '1', // Assuming userId is a string, adjust as necessary
        // Add any other required fields from IPlaylist
    };
    
    it('should create a new playlist', async () => {
        const res = await request(BASE_URL)
            .post('/api/playlists')
            .send(newPlaylist);
        
        expect(res.statusCode).toEqual(201);
        // expect(res.body).toHaveProperty('_id');
        playlistId = res.body._id;
        console.log("Playlist ID: ", playlistId);
        
        // Verify the response contains the expected playlist properties
        expect(res.body).toHaveProperty('title', newPlaylist.title);
        
    });

    it('should fetch all playlists', async () => {
        const res = await request(BASE_URL).get(`/api/playlists/${newPlaylist.userID}`);
        
        expect(res.statusCode).toEqual(200);
        // expect(res.body.returnObjects).toBeInstanceOf(Array);
    });

    // it('should fetch a single playlist by ID', async () => {
        
    //     const res = await request(BASE_URL).get(`/api/playlists/${playlistId}`);
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body).toHaveProperty('id', playlistId);
    // });

    it('should update a playlist', async () => {
        const res = await request(BASE_URL)
            .put(`/api/playlists/${playlistId}`)
            .send(updatedPlaylist);
            
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('title', updatedPlaylist.title); // Changed from 'name' to 'title'
        
    });

    it('should delete a playlist', async () => {
        
        const res = await request(BASE_URL).delete(`/api/playlists/${playlistId}`);
        expect(res.statusCode).toEqual(204);
    });
});