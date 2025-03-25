import { HTTPException } from "hono/http-exception";
import { ProviderConfigDto } from "@/dtos/provider";
import { ProviderType } from "@/enums/provider";
import { Mapper } from "../../lib/mapper";
import { ProviderConfigEntity } from "../../entities/provider-config";
import { IProviderConfigRepository } from '../../interfaces/repositories/provider-config';

export class ProviderConfigService {
  private readonly _providerRepository: IProviderConfigRepository<ProviderConfigEntity>;

  constructor(providerConfigRepository: IProviderConfigRepository<ProviderConfigEntity>) {
    this._providerRepository = providerConfigRepository;
  }

  async getAll(): Promise<ProviderConfigDto[]> {
    const providers = await this._providerRepository.getAll();
    return providers.map(e => {
      const dto = Mapper.entityToDto(ProviderConfigDto, e);
      dto.api = e.api ? JSON.parse(e.api) : null;
      dto.smtp = e.smtp ? JSON.parse(e.smtp) : null;

      return dto;
    });
  }

  async getById(id: number): Promise<ProviderConfigDto | null> {
    const provider = await this._providerRepository.getById(id);
    if (!provider) {
      return null;
    }

    const dto = Mapper.entityToDto(ProviderConfigDto, provider);
    dto.api = provider.api ? JSON.parse(provider.api) : null;
    dto.smtp = provider.smtp ? JSON.parse(provider.smtp) : null;

    return dto;
  }

  async create(provider: ProviderConfigDto) {
    if (provider.userId === 0) {
      throw new HTTPException(400, { message: 'User ID is required' });
    }

    if (!provider.name) {
      throw new HTTPException(400, { message: 'Provider name is required' });
    }

    if (provider.type === ProviderType.UNKNOWN) {
      throw new HTTPException(400, { message: 'Provider type is required' });
    }

    if (!provider.api && !provider.smtp) {
      throw new HTTPException(400, { message: 'Either API or SMTP configuration is required' });
    }

    const entity = Mapper.dtoToEntity(ProviderConfigEntity, provider);
    const newEntity = await this._providerRepository.create(entity);

    return Mapper.entityToDto(ProviderConfigDto, newEntity);
  }

  async update(id: number, provider: ProviderConfigDto) {
    const entity = Mapper.dtoToEntity(ProviderConfigEntity, provider);
    const updatedEntity = await this._providerRepository.update(id, entity);

    return Mapper.entityToDto(ProviderConfigDto, updatedEntity);
  }

  async delete(id: number): Promise<boolean> {
    return this._providerRepository.delete(id);
  }
}
