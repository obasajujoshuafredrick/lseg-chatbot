import { Datasource } from "../types";
import fsPromises from "fs/promises";
import path from "path";
import { StockData } from "./types";

export class LocalDataSource implements Datasource {
  private stockData: StockData[];
  private constructor(stockData: StockData[]) {
    this.stockData = stockData;
  }

  static async getSource(): Promise<Datasource> {
    const data = await fsPromises.readFile(
      path.join(__dirname, "stock-data.json"),
      "utf-8"
    );

    const stockData = JSON.parse(data) as StockData[];

    const source = new LocalDataSource(stockData);

    return source;
  }

  getStockExchanges() {
    return this.stockData.map((sd) => ({
      code: sd.code,
      exchange: sd.stockExchange,
    }));
  }
  getStocks(code: string) {
    const exchange = this.stockData.find((st) => st.code === code);

    return exchange?.topStocks || [];
  }
}
