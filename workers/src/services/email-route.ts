import { HTTPException } from 'hono/http-exception';
import { EmailRouteDto } from '@/dtos/email-route';
import { EmailClass } from '@/enums/email-class';
import { Mapper } from '../lib/mapper';
import { EmailRouteEntity } from '../entities/email-route';
import { Configuration } from '../config';
import { IEmailRouteRepository } from '../interfaces/repositories/email-route';

export class EmailRouteService {
  private readonly _emailRouteRepository: IEmailRouteRepository;
  private readonly _config: Configuration;

  constructor(config: Configuration, emailRouteRepository: IEmailRouteRepository) {
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

    if (!dto.type) {
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

    if (!dto.type) {
      throw new HTTPException(400, { message: 'Type is required' });
    }

    const entity = Mapper.dtoToEntity(EmailRouteEntity, dto);

    await this._emailRouteRepository.update(id, entity);
  }

  async delete(id: number): Promise<void> {
    await this._emailRouteRepository.delete(id);
  }

  async getDestination(email: string, type: EmailClass): Promise<string | null> {
    const routes = await this._emailRouteRepository.getByEmail(email);
    if (!routes?.length) {
      console.log('No route entity found, using default email:', this._config.emailForwardTo);
      return this._config.emailForwardTo;
    }

    const matchingRoute = routes.find(r => r.type === type && !r.drop);
    if (matchingRoute) return matchingRoute.destination;

    const unknownRoute = routes.find(r => r.type === EmailClass.UNKNOWN && !r.drop);
    return unknownRoute?.destination || null;
  }

  async incrementReceived(email: string): Promise<void> {
    await this._emailRouteRepository.incrementReceived(email);
  }

  async incrementSent(email: string): Promise<void> {
    await this._emailRouteRepository.incrementSent(email);
  }
}
