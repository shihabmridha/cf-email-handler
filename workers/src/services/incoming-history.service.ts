import { IncomingHistoryDto } from '@/dtos/incoming-history.dto';
import { IncomingHistoryRepository } from '@/repositories/incoming-history.repository';
import { IncomingHistoryEntity } from '@/entities/incoming-history';
import { Mapper } from '@/lib/mapper';

export class IncomingHistoryService {
  constructor(private readonly repository: IncomingHistoryRepository) { }

  async create(data: IncomingHistoryDto): Promise<void> {
    const entity = Mapper.dtoToEntity(IncomingHistoryEntity, data);
    await this.repository.create(entity);
  }

  async getByPage(page: number): Promise<IncomingHistoryDto[]> {
    const entities = await this.repository.getByPage(page);
    return entities.map(e => Mapper.entityToDto(IncomingHistoryDto, e));
  }
}
