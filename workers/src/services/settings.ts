import { SettingsDto } from '@/dtos/settings';
import { SettingsRepository } from '@/repositories/settings';
import { SettingsEntity } from '@/entities/settings';
import { Mapper } from '@/lib/mapper';

export class SettingsService {
  constructor(private readonly repository: SettingsRepository) { }

  async getAll(): Promise<SettingsDto[]> {
    const entities = await this.repository.getAll();
    return entities.map(e => Mapper.entityToDto(SettingsDto, e));
  }

  async getByKey(key: string): Promise<SettingsDto | null> {
    const entity = await this.repository.getByKey(key);
    return entity ? Mapper.entityToDto(SettingsDto, entity) : null;
  }

  async upsert(data: SettingsDto): Promise<void> {
    const entity = Mapper.dtoToEntity(SettingsEntity, data);
    const existing = await this.repository.getByKey(entity.key);

    if (existing) {
      await this.repository.update(entity.key, entity);
    } else {
      await this.repository.create(entity);
    }
  }

  async delete(key: string): Promise<void> {
    await this.repository.delete(key);
  }
}
