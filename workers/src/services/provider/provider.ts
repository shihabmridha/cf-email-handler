import {ProviderRepository} from "../../repositories/provider";
import {ProviderDto} from "@/shared/dtos/provider";
import {Mapper} from "../../lib/mapper";
import {ProviderEntity} from "../../entities/provider";

export class ProviderService {
  private readonly providerRepository: ProviderRepository;

  constructor(db: D1Database) {
    this.providerRepository = new ProviderRepository(db);
  }

  async getAll(): Promise<ProviderDto[]> {
    const providers = await this.providerRepository.getAll();
    return providers.map(e => {
      const dto = Mapper.entityToDto(ProviderDto, e);
      dto.api = JSON.parse(e.api ?? '{}');
      dto.smtp = JSON.parse(e.smtp ?? '{}');

      return dto;
    });
  }

  async create(provider: ProviderDto) {
    const entity = Mapper.dtoToEntity(ProviderEntity, provider);
    const newEntity = await this.providerRepository.create(entity);

    return Mapper.entityToDto(ProviderDto, newEntity);
  }

  async update(id: number, provider: ProviderDto) {
    const entity = Mapper.dtoToEntity(ProviderEntity, provider);
    const updatedEntity = await this.providerRepository.update(id, entity);

    return Mapper.entityToDto(ProviderDto, updatedEntity);
  }

  async delete(id: number): Promise<boolean> {
    return this.providerRepository.delete(id);
  }
}
