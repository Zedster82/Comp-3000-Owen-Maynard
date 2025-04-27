import { describe, it, expect } from 'vitest';
import request from 'supertest';

import { IPlaylist } from '../models/playlists.js'; // Adjust the import path as needed

const BASE_URL = 'http://localhost:8282'; 

describe('Playlist Endpoints', () => {
    let playlistID: string | null = null;
    
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
        console.log("Create Playlist, Body: ", res.body);
        expect(res.body.playlist).toHaveProperty('_id');
        playlistID = res.body.playlist._id; // Save the ID for later tests
        
        
        
        // Verify the response contains the expected playlist properties
        expect(res.body.playlist).toHaveProperty('title', newPlaylist.title);
        
    });

    it('should fetch all playlists', async () => {
        const res = await request(BASE_URL).get(`/api/playlists/${newPlaylist.userID}`);
        
        // Find the playlist that matches our created playlist
        // const foundPlaylist = res.body.data.find(
        //     (playlist: any) => playlist.title === newPlaylist.title && playlist.userID === newPlaylist.userID
        // );
        // playlistID = foundPlaylist ? foundPlaylist._id : null;
        console.log("Fetch Playlist, ID: ", playlistID);
        console.log("Fetch Playlist, Body: ", res.body);
        

        expect(res.statusCode).toEqual(200);
        // expect(res.body.returnObjects).toBeInstanceOf(Array);
    });

    // it('should fetch a single playlist by ID', async () => {
        
    //     const res = await request(BASE_URL).get(`/api/playlists/${playlistId}`);
    //     expect(res.statusCode).toEqual(200);
    //     expect(res.body).toHaveProperty('id', playlistId);
    // });

    it('should update a playlist', async () => {
        console.log("Update Playlist, ID: ", playlistID);
        const res = await request(BASE_URL)
            .patch(`/api/playlists/${playlistID}`)
            .send(updatedPlaylist);
            
        console.log("Update Playlist, Body: ", res.body);
        expect(res.statusCode).toEqual(200);
        // expect(res.body).toHaveProperty('title', updatedPlaylist.title); // Changed from 'name' to 'title'
        
    });

    it('should delete a playlist', async () => {
        
        const res = await request(BASE_URL).delete(`/api/playlists/${playlistID}`);
        expect(res.statusCode).toEqual(200);
        console.log("Delete Playlist, Body: ", res.body);
    });
});