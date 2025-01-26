import { Box } from "@mui/material";
import React from "react";

export function ChatMessageBox({
  header,
  content,
  handleSelect,
}: {
  header: string;
  content: { key: string; value: string }[];
  handleSelect?: (key: string, value: string) => void;
}) {
  return (
    <Box marginRight={"auto"} width={"50%"}>
      <Box
        color="black"
        bgcolor={"lightblue"}
        borderRadius={"4px"}
        padding="12px 90px"
      >
        {header}
      </Box>
      {content.map((c) => (
        <Box
          key={c.key}
          sx={{
            cursor: "pointer",
            color: "black",
            backgroundColor: "white",
            borderRadius: "4px",
            padding: "12px 90px",
            marginRight: "auto",
            border: "1px solid lightblue",
          }}
          onClick={() => handleSelect?.(c.key, c.value)}
        >
          {c.value}
        </Box>
      ))}
    </Box>
  );
}

export function ReplyMessageBox({ message }: { message: string }) {
  return (
    <Box
      color="black"
      bgcolor={"lightgray"}
      borderRadius={"4px"}
      padding="12px 90px"
      marginLeft={"auto"}
      maxWidth={"50%"}
    >
      {message}
    </Box>
  );
}
