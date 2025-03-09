export interface IBaseRepository<T> {
  getAll(): Promise<T[]>;
}
