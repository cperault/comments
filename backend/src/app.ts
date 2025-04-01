import { config } from "./config";
import express from "express";
import cors from "cors";
import { Pool } from "pg";

import { CommentService } from "./service/CommentService.ts";
import { ApiRouter } from "./route/api/ApiRouter.ts";

export const createApp = () => {
  const app = express();

  const dbPool = new Pool({
    connectionString: config.databaseUrl
  });

  app.use(cors());
  app.use(express.json());

  const commentService = new CommentService();

  const apiRouter = new ApiRouter(commentService);
  app.use("/api", apiRouter.getRouter());

  return app;
};
