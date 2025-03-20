import { DraftRepository } from "../repositories/draft";
import { DraftDto } from "@/dtos/draft";
import { DraftEntity } from "../entities/draft";
import { Mapper } from "../lib/mapper";
import { IDraftRepository } from '../interfaces/repositories/draft';

export class DraftService {
  private readonly _draftRepository: IDraftRepository<DraftEntity>;

  constructor(draftRepository: IDraftRepository<DraftEntity>) {
    this._draftRepository = draftRepository;
  }

  async getAll(): Promise<DraftDto[]> {
    const entities = await this._draftRepository.getAll();
    return entities.map(e => {
      const dto = Mapper.entityToDto(DraftDto, e);
      dto.recipients = e.recipients ? JSON.parse(e.recipients) : null;

      return dto;
    });
  }

  async create(dto: DraftDto): Promise<DraftDto> {
    const entity = Mapper.dtoToEntity(DraftEntity, dto);
    const newEntity = await this._draftRepository.create(entity);
    return Mapper.entityToDto(DraftDto, newEntity);
  }

  async update(id: string, dto: DraftDto): Promise<DraftDto> {
    const entity = Mapper.dtoToEntity(DraftEntity, dto);
    const updatedEntity = await this._draftRepository.update(parseInt(id), entity);

    return Mapper.entityToDto(DraftDto, updatedEntity);
  }

  async delete(id: number): Promise<boolean> {
    return this._draftRepository.delete(id);
  }
}
