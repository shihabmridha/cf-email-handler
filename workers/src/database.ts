import { IDatabase } from "./interfaces/database";

export class Database implements IDatabase {
  private readonly dbInstance: D1Database;

  constructor(db: D1Database) {
    this.dbInstance = db;
  }

  async connect(): Promise<void> {
    await Promise.resolve('No connection needed for D1');
  }

  async disconnect(): Promise<void> {
    await Promise.resolve('No disconnection needed for D1');
  }

  instance<T>(): T {
    return this.dbInstance as T;
  }
}
