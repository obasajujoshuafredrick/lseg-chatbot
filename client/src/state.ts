import { assign, fromPromise, setup } from "xstate";

interface ChatbotContext {
  selectedStock: { code: string; stock: string; price: number };
  selectedExchange: string;
  exchanges: { code: string; exchange: string }[];
  stocks: { code: string; stockName: string; price: number }[];
  messages: {
    from: "bot" | "user";
    text: string;
    options?: { key: string; value: string }[];
  }[];
}

type ChatbotEvent =
  | {
      type: "RECEIVED_EXCHANGES";
      exchanges: { code: string; exchange: string }[];
    }
  | {
      type: "SELECT_EXCHANGE";
      code: string;
      exchange: string;
    }
  | {
      type: "SELECT_STOCK";

      code: string;
      stock: string;
      price: number;
    }
  | {
      type: "RECEIVED_STOCKS";
      stocks: { code: string; stockName: string; price: number }[];
    }
  | {
      type: "FLOW_COMPLETED";

      key: string;
      value: string;
    };

const defaultContext = {
  selectedStock: { code: "", stock: "", price: 0 },
  selectedExchange: "",
  exchanges: [],
  stocks: [],
  messages: [],
};

export const machine = setup({
  types: {
    context: {} as ChatbotContext,
    events: {} as ChatbotEvent,
  },
  actors: {
    fetchExchange: fromPromise(async ({ input }) => {
      const exchange = input as { code: string };
      const resp = await fetch("http://localhost:7272/select", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: exchange.code,
        }),
      });

      return;
    }),
  },
}).createMachine({
  id: "lseg-chatbot",
  initial: "waitingForExchange",
  context: defaultContext,

  states: {
    waitingForExchange: {
      on: {
        RECEIVED_EXCHANGES: {
          target: "exchangesReceived",
          actions: [
            assign({
              exchanges: (context) => context.event.exchanges,
            }),
          ],
        },
      },
    },

    exchangesReceived: {
      entry: assign({
        messages: (context) => {
          return [
            ...context.context.messages,
            {
              from: "bot",
              text: "Please Select a Stock Exchange",
              options: context.context.exchanges.map((ex) => ({
                key: ex.code,
                value: ex.exchange,
              })),
            },
          ];
        },
      }),
      on: {
        SELECT_EXCHANGE: {
          target: "fetchingExchange",
          actions: assign({
            selectedExchange: (context) => context.event.code,
            messages: ({ event, context }) => {
              return [
                ...context.messages,
                { from: "user", text: event.exchange },
              ];
            },
          }),
        },
      },
    },

    fetchingExchange: {
      invoke: {
        id: "fetchingExchange",
        src: "fetchExchange",
        input: (context) => {
          return {
            code: context.context.selectedExchange,
          };
        },

        onError: {},
      },

      on: {
        RECEIVED_STOCKS: {
          target: "stocksReceived",
          actions: [
            assign({
              stocks: (context) => context.event.stocks,
            }),
          ],
        },
      },
    },

    stocksReceived: {
      on: {
        SELECT_STOCK: {
          target: "completed",
          actions: assign({
            selectedStock: ({ event }) => ({
              code: event.code,
              stock: event.stock,
              price: event.price,
            }),
          }),
        },
      },
    },

    completed: {
      entry: assign({
        messages: (context) => {
          return [
            ...context.context.messages,
            {
              from: "bot",
              text: "Please select a Stock",
              options: context.context.stocks.map((st) => ({
                key: st.code,
                value: st.stockName,
              })),
            },
            { from: "user", text: context.context.selectedStock.stock },
          ];
        },
      }),
      on: {
        FLOW_COMPLETED: {
          target: "exchangesReceived",
          actions: assign({
            ...defaultContext,
            exchanges: (context) => context.context.exchanges,
          }),
        },
      },
    },
  },
});
