import { BaseEntity } from "../../entities/base";

export interface IBaseRepository<T extends BaseEntity> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T | null>;
}
