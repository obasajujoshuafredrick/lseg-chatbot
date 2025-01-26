# Real-Time SSE Chat Application with XState

This project is a **real-time chat application** powered by **Node.js, Express, SSE, React, and XState**. It showcases a seamless integration of Server-Sent Events (SSE) for real-time updates and XState for robust state management on the frontend.

---

## Features

- **Real-Time Updates**: Uses Server-Sent Events (SSE) to stream data from the backend to the frontend.
- **State Management**: Utilizes XState for predictable and structured state management in the client.
- **Dynamic Data Handling**: React and TypeScript handle user interactions and UI updates.
- **Backend Efficiency**: Node.js and Express handle SSE connections and events efficiently with an in-memory event broker.
- **Type Safety**: Full TypeScript support for both backend and frontend.
- **Extensible Architecture**: Easy-to-scale architecture using a broker for inter-service communication.

---

## Tech Stack

### Backend

- **Node.js**
- **Express**
- **TypeScript**
- **Node.js EventEmitter** (as an in-memory event broker)
- **SSE** (Server-Sent Events)

### Frontend

- **React**
- **TypeScript**
- **XState** (state management)
- **SSE Listener** (for real-time communication)

---

## Setup Instructions

### Prerequisites

- Node.js (>= 18.x)
- yarn

### Backend Setup

1. Clone the repository:

```bash
   git clone git@github.com:obasajujoshuafredrick/lseg-chatbot.git
   cd server
```

2. Install Dependencies

   ```npm
   npm install
   ```
3. Run the backend Server

   ```
   npm run dev

   the server should be running on http://localhost:7272
   ```


### Frontend Setup 

1. Navigate to the frontend directory

```cd client```

2. Install dependencies

```npm install```

3. Start the development server

```npm start```


### Project Setup

**Backend**

```
server/
├── datasource/              # Handles data fetching and storage logic
│   ├── local.ts             # Data source implementation (local JSON)
│   ├── stock-data.json      # Static JSON file containing stock exchange and stock data
│   └── types.ts             # Type definitions related to the data source (e.g., Exchange, Stock)
│
├── controllers.ts   
├── events.ts                 # Event-related utilities
├── types.ts                   # Shared type definitions
├── index.ts                 # Entry point for the backend server
├── tsconfig.json            # TypeScript configuration
├── package.json             # Project dependencies and scripts
└── yarn.lock                # Lock file for dependencies
```




**Frontend**

Client structure is a basic create react app structure with some additional files

```
state.ts
MessageBox.tsx
```

The state contains the logic for the state machine 

MessageBox contains the two component to display both bot and user messages.

## Future Improvement

### 1. Scalability

The current implementation uses an in-memory `EventEmitter` for event brokering. While this is efficient for small-scale applications, it is not suitable for high-traffic scenarios or when multiple instances of the backend are deployed. To improve scalability:

- **Replace EventEmitter with a Distributed Broker**:

  - Use a message broker like **Redis**, **RabbitMQ**, or **Kafka** to manage events across distributed systems.
  - Redis Pub/Sub can handle real-time message passing efficiently and is simple to set up.
- **Horizontal Scaling**:

  - Ensure the backend is stateless so that it can be scaled horizontally using load balancers.
  - Utilize the distributed broker to synchronize event delivery across instances.

### 2. Authentication

To secure the SSE connection and ensure only authorized clients can access the service:

- **JWT Authentication**:
  - Require clients to include a valid JSON Web Token (JWT) in the request headers.
  - Validate the token on every SSE connection request.
