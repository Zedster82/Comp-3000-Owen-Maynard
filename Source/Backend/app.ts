import  { urlencoded, json } from "express";
import * as express from "express";
import * as cors from "cors";
import helmet from "helmet";
import { flashCardRouter } from "./routes/flashCard";
import { playlistsRouter } from "./routes/playlists";

const swStats = require('swagger-stats');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

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