export interface IBaseRepository<T> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T | null>;
}
