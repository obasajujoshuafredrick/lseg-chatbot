import express from "express";
import cors from "cors";
import { MyBroker } from "./events";
import { handleSelectOption, handleSSE } from "./controller";
import { LocalDataSource } from "./datasource/local";

const app = express();

const port = 7272;

async function startApp(app: express.Application) {
  app.use(express.json());

  // To allow client request from different hosts
  app.use(cors());

  // Initialize the broker instance
  const broker = MyBroker.getInstance();

  // Initialize the local datasource instance to provide logic for getting data
  const datasource = await LocalDataSource.getSource();

  // POST /Select endpoint
  app.post("/select", handleSelectOption(broker));

  // GET /sse endpoint
  app.get("/sse", handleSSE(broker, datasource));

  // Listen at port 7272
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

startApp(app);
