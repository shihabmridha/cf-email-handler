import {DraftRepository} from "../repositories/draft";
import {DraftDto} from "@/shared/dtos/draft";
import {DraftEntity} from "../entities/draft";
import {plainToInstance} from "class-transformer";
import {transformToClass} from "../lib/utils";

export class DraftService {
  private readonly draftRepository: DraftRepository;
  constructor(db: D1Database) {
    this.draftRepository = new DraftRepository(db);
  }

  async getAll(): Promise<DraftDto[]> {
    const entities = await this.draftRepository.getAll();
    return plainToInstance(DraftDto, entities);
  }

  async create(dto: DraftDto): Promise<void> {
    const entity = transformToClass(DraftEntity, dto);
    console.log(entity);
    await this.draftRepository.create(entity);
  }

  async update(id: string, dto: DraftDto): Promise<void> {

  }
}
