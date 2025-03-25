import { HTTPException } from 'hono/http-exception';
import { EmailRouteDto } from '@/dtos/email-route';
import { EmailType } from '@/enums/email-type';
import { Mapper } from '../lib/mapper';
import { EmailRouteEntity } from '../entities/email-route';
import { Configuration } from '../config';
import { IEmailRouteRepository } from '../interfaces/repositories/email-route';

export class EmailRouteService {
  private readonly _emailRouteRepository: IEmailRouteRepository<EmailRouteEntity>;
  private readonly _config: Configuration;

  constructor(config: Configuration, emailRouteRepository: IEmailRouteRepository<EmailRouteEntity>) {
    this._config = config;
    this._emailRouteRepository = emailRouteRepository;
  }

  async getAll(): Promise<EmailRouteDto[]> {
    const entities = await this._emailRouteRepository.getAll();
    return entities.map(e => Mapper.entityToDto(EmailRouteDto, e));
  }

  async create(dto: EmailRouteDto): Promise<void> {
    if (!dto.userId) {
      throw new HTTPException(400, { message: 'User ID is required' });
    }

    if (dto.email === '' || dto.destination === '') {
      throw new HTTPException(400, { message: 'Email and Destination is required' });
    }

    if (!dto.type || dto.type === EmailType.UNKNOWN) {
      throw new HTTPException(400, { message: 'Type is required' });
    }

    dto.enabled = true;

    const entity = Mapper.dtoToEntity(EmailRouteEntity, dto);
    await this._emailRouteRepository.create(entity);
  }

  async update(id: number, dto: EmailRouteDto): Promise<void> {
    if (!dto.userId) {
      throw new HTTPException(400, { message: 'User ID is required' });
    }

    if (dto.email === '' || dto.destination === '') {
      throw new HTTPException(400, { message: 'Email and Destination is required' });
    }

    if (dto.type === EmailType.UNKNOWN) {
      throw new HTTPException(400, { message: 'Type is required' });
    }

    const entity = Mapper.dtoToEntity(EmailRouteEntity, dto);
    await this._emailRouteRepository.update(id, entity);
  }

  async delete(id: number): Promise<void> {
    await this._emailRouteRepository.delete(id);
  }

  async getDestination(email: string, type: EmailType): Promise<string> {
    const routeEntity = await this._emailRouteRepository.getByEmailAndType(email, type);
    if (!routeEntity) {
      return this._config.emailForwardTo;
    }

    return routeEntity.destination;
  }
}
