import express, { urlencoded, json } from "express";
import cors from "cors";
import helmet from "helmet";

import { flashCardRouter } from "./routes/flashCard";
import { playlistsRouter } from "./routes/playlists";

function buildApp(): express.Application {
    const app = express();

    app.use(urlencoded({ extended: true }));
    app.use(json());
    app.use(cors());
    app.use(helmet());

    app.set("trust proxy", 1);

    // app.use(contextMiddleware);

    // Routes
    app.use("/auth", flashCardRouter);
    app.use("/workouts", playlistsRouter);

    //addApiRoutes(app);

    //app.use(errorHandlingMiddleware);

    return app;
}

export default buildApp;