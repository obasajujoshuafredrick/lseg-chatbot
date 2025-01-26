import { Stock } from "./datasource/types";

export type EventType = "EXCHANGE";

export const validEvents: EventType[] = ["EXCHANGE"];

// Broker interface that can be implemented by several brokering options.
export interface Broker {
  sendMessage(eventType: EventType, message: any): void;
  receiveMessage(
    eventType: EventType,
    cb: (message: any, error: any) => void
  ): void;
  removeListener(
    eventType: EventType,
    listener: (message: any, error: any) => void
  ): void;
}

/**
 *Represents a data source  for retrieve stock market information
 */
export interface Datasource {
  /**
   * @returns string[]
   */
  getStockExchanges(): { code: string; exchange: string }[];

  /**
   * @param  {string} code - This indentifies which exchange
   * @returns Stock[]
   */
  getStocks(code: string): Stock[];
}
