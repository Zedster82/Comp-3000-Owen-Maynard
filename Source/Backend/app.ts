import  { urlencoded, json } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { flashCardRouter } from "./routes/flashCard.js";
import { playlistsRouter } from "./routes/playlists.js";


import swStats from 'swagger-stats';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json' with { type: 'json' };

// const swStats = require('swagger-stats');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

function buildApp(): express.Application {
    const app = express();

    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(cors());
    app.use(helmet());

    app.set("trust proxy", 1);

    // app.use(contextMiddleware);

    // Routes
    app.use("/api/flashcards", flashCardRouter().router);
    app.use("/api/playlists", playlistsRouter().router);
    console.log("Routes added");

    

    //app.use(errorHandlingMiddleware);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    app.use(swStats.getMiddleware({swaggerSpec:swaggerDocument}));

    return app;
}

export default buildApp;