import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import verifyRequest from "../auth/verifyRequest";
//const { body, validationResult } = require("express-validator");




export const playlistsRouter = () => {
    const router = express.Router();

    //Create playlist
    router.post("/", verifyRequest,  async (req, res) => {

    });

    //Edit playlist
    router.put("/:id", verifyRequest, async (req, res) => {

    });

    //Delete playlist
    router.delete("/:id", verifyRequest, async (req, res) => {

    });

    //Get all playlists of user
    router.get("/:id", verifyRequest, async (req, res) => {

    });







    return { router };
}

