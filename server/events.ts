import { EventEmitter } from "events";
import { Broker } from "./types";


// Broker Class that extends EventEmitter that provides the send and receive message functionality
export class MyBroker extends EventEmitter implements Broker {
  private static instance: Broker;

  private constructor() {
    super();

    this.setMaxListeners(10);
  }
  // Handles the Emit message 
  sendMessage(eventType: string, message: any): void {
    this.emit(eventType, message);
  }

  // Handles receive message 
  receiveMessage(
    eventType: string,
    cb: (message: any, error: any) => void
  ): void {
    this.on(eventType, cb);
  }

  // To provide single instance of the broker
  static getInstance(): Broker {
    if (typeof MyBroker.instance === "undefined") {
      MyBroker.instance = new MyBroker();
    }

    return MyBroker.instance;
  }


}
