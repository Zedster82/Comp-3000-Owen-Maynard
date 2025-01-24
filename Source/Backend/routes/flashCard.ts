import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import bodyParser from "body-parser";
//const { body, validationResult } = require("express-validator");




export const flashCardRouter = () => {
    const router = express.Router();



    //Create flashcard
    router.post("/flashCards", async (req, res) => {



    });

    return { router };
}