import { Request, Response } from "express";
import { Broker, Datasource } from "./types";

// Write Data to the SSE Stream
function writeData(res: Response, data: any) {
  res.write(`data: ${JSON.stringify(data)} \n\n`);
}



// Controller to handle the POST /select endpoint
export const handleSelectOption =
  (broker: Broker) => (req: Request, res: Response) => {
    const { code } = req.body as { code: string };

    if (!code) {
      res.status(400).json({ message: "code is required" });
      return;
    }

    broker.sendMessage("EXCHANGE", { code });

    res.send("OK");
  };

  // Controller to handle the SSE Connection GET /SSE Endpoint
export const handleSSE =
  (broker: Broker, datasource: Datasource) => (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let isListenerSet = false;

    // Event listener function
    const brokerListener = (message: any, err: any) => {
      if (err) {
        console.error("Error receiving message:", err);
        return;
      }
      console.log("Received exchange event", message);

      const stocks = datasource.getStocks(message.code);
      writeData(res, { type: "STOCK_EXCHANGE_STOCKS", data: stocks });
    };

    req.on("close", () => {
      res.end();

      if (isListenerSet) {
        broker.removeListener("EXCHANGE", brokerListener);
      }
    });

    const data = datasource.getStockExchanges();

    writeData(res, { type: "STOCK_EXCHANGES", data });

    if (!isListenerSet) {
      broker.receiveMessage("EXCHANGE", brokerListener);
      isListenerSet = true;
    }
  };
