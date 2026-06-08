import { HTTPException } from 'hono/http-exception';
import { EmailRouteDto } from '@/dtos/email-route';
import { EmailClass } from '@/enums/email-class';
import { Mapper } from '@/lib/mapper';
import { EmailRouteEntity } from '@/entities/email-route';
import { IEmailRouteRepository } from '@/interfaces/repositories/email-route';
import { SettingKeys } from '@/enums/settings-key';
import { ISettingsRepository } from '@/interfaces/repositories/settings';

const VALID_EMAIL_CLASSES = Object.values(EmailClass);

export interface RouteDestinationResult {
  destination: string | null;
  matchedRoute: EmailRouteEntity | null;
}

export class EmailRouteService {
  private readonly _emailRouteRepository: IEmailRouteRepository;
  private readonly _settingsRepository: ISettingsRepository;

  constructor(emailRouteRepository: IEmailRouteRepository, settingsRepository: ISettingsRepository) {
    this._emailRouteRepository = emailRouteRepository;
    this._settingsRepository = settingsRepository;
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

    if (!VALID_EMAIL_CLASSES.includes(dto.type as EmailClass)) {
      throw new HTTPException(400, { message: `Invalid email type. Must be one of: ${VALID_EMAIL_CLASSES.join(', ')}` });
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

    if (!VALID_EMAIL_CLASSES.includes(dto.type as EmailClass)) {
      throw new HTTPException(400, { message: `Invalid email type. Must be one of: ${VALID_EMAIL_CLASSES.join(', ')}` });
    }

    const entity = Mapper.dtoToEntity(EmailRouteEntity, dto);

    await this._emailRouteRepository.update(id, entity);
  }

  async delete(id: number): Promise<void> {
    await this._emailRouteRepository.delete(id);
  }

  async getDestination(email: string, type: EmailClass): Promise<RouteDestinationResult> {
    const routes = await this._emailRouteRepository.getByEmail(email);

    const routeToUse = routes.find(r => r.type === type && r.enabled)
      || routes.find(r => r.type === EmailClass.UNKNOWN && r.enabled);

    if (routeToUse?.drop) {
      console.log(`Route for ${email} with type ${type} is marked for drop`);
      return { destination: null, matchedRoute: routeToUse };
    }

    if (routeToUse?.destination) {
      return { destination: routeToUse.destination, matchedRoute: routeToUse };
    }

    const forwardTo = await this._settingsRepository.getByKey(SettingKeys.EMAIL_FORWARD_TO);

    if (!forwardTo?.value) {
      console.warn('No matching route found and no default forward email configured');
    } else {
      console.log('No matching route found, using default email:', forwardTo.value);
    }

    return { destination: forwardTo?.value ?? null, matchedRoute: null };
  }

  async incrementReceived(email: string, emailClass: EmailClass): Promise<void> {
    await this._emailRouteRepository.incrementReceived(email, emailClass);
  }

  async incrementSent(email: string, emailClass: EmailClass): Promise<void> {
    await this._emailRouteRepository.incrementSent(email, emailClass);
  }

  async incrementSentByEmail(email: string): Promise<void> {
    await this._emailRouteRepository.incrementSentByEmail(email);
  }
}
