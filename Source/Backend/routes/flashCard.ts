import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import bodyParser from "body-parser";
import verifyRequest from "../auth/verifyRequest";
//const { body, validationResult } = require("express-validator");




export const flashCardRouter = () => {
    const router = express.Router();



    //Create flashcard
    router.post("/", verifyRequest, async (req, res) => {
        
    });

    //Edit flashcard
    router.put("/:id", verifyRequest, async (req, res) => {

    });

    //Delete flashcard
    router.delete("/:id", verifyRequest, async (req, res) => {

    });

    //Get all flashcards of user

    router.get("/", verifyRequest, async (req, res) => {

    });

    //Get flashcard by playlist id
    router.get("/playlist/:id", verifyRequest, async (req, res) => {

    });





    return { router };
}