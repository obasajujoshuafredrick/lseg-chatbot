import React, { useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
// import logo from './logo.svg';
import "./App.css";
import { machine } from "./state.ts";
import { useMachine } from "@xstate/react";
import ChatIcon from "@mui/icons-material/Chat";
import { ChatMessageBox, ReplyMessageBox } from "./MessageBox.tsx";

type eventType = "STOCK_EXCHANGES" | "STOCK_EXCHANGE_STOCKS";

function App() {
  const [state, send] = useMachine(machine);

  const [options, setOptions] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:7272/sse");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as { type: string; data: any };

        // Log the received message to ensure we are receiving the correct data
        console.log("Received SSE message:", data);

        if (data.type === "STOCK_EXCHANGES") {
          send({ type: "RECEIVED_EXCHANGES", exchanges: data.data });
        } else if (data.type === "STOCK_EXCHANGE_STOCKS") {
          send({ type: "RECEIVED_STOCKS", stocks: data.data });
        } else {
          console.warn("Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("Error parsing SSE message:", error);
      }
    };
    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    console.log(state.value);
  }, [state]);

  function  handleSelectExchange(code: string, exchange: string) {
    send({ type: "SELECT_EXCHANGE", exchange, code });
  }

  function handleSelectStock(code: string, stock: string) {
    const foundStock = state.context.stocks.find((s) => code === s.code);

    send({ type: "SELECT_STOCK", code, stock, price: foundStock!.price });
  }

  function handleCompleted(key: string, value: string) {
    send({ type: "FLOW_COMPLETED", key, value });
  }

  return (
    <div className="App">
      <Box
        height="2rem"
        bgcolor={"blue"}
        color={"white"}
        display={"flex"}
        alignItems={"center"}
        gap={"20px"}
        padding="20px"
      >
        <ChatIcon /> <Box fontWeight={"bold"}>LSEG Chatbot</Box>
      </Box>

      <Container
        style={{
          width: "80%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "2rem",
          overflow: "sc",
        }}
      >
        <ChatMessageBox
          header="Hello! Welcome to LSEG, I'm here to help you"
          content={[]}
        ></ChatMessageBox>
        {state.context.messages.map((message, index) => {
          return message.from === "bot" ? (
            <ChatMessageBox
              key={index}
              handleSelect={handleSelectExchange}
              header={message.text}
              content={message.options!.map((option) => ({
                key: option.key,
                value: option.value,
              }))}
            ></ChatMessageBox>
          ) : (
            <ReplyMessageBox message={message.text}></ReplyMessageBox>
          );
        })}

        {state.matches("waitingForExchange") && (
          <ChatMessageBox
            handleSelect={handleSelectExchange}
            header="Please select a Stock Exchange"
            content={state.context.exchanges.map(
              (ex: { code: string; exchange: string }) => ({
                key: ex.code,
                value: ex.exchange,
              })
            )}
          ></ChatMessageBox>
        )}

        {state.matches("stocksReceived") && (
          <ChatMessageBox
            handleSelect={handleSelectStock}
            header="Please select a Stock"
            content={state.context.stocks.map((stock) => ({
              key: stock.code,
              value: stock.stockName,
            }))}
          ></ChatMessageBox>
        )}
        {state.matches("completed") && (
          <ChatMessageBox
            handleSelect={handleCompleted}
            header={`Stock Price of ${state.context.selectedStock.stock} is ${state.context.selectedStock.price}. Please select an option`}
            content={[
              { key: "MM", value: "Main Menu" },
              { key: "GB", value: "Go Back" },
            ]}
          ></ChatMessageBox>
        )}
      </Container>
    </div>
  );
}

export default App;
