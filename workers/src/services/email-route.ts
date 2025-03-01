import {EmailRouteDto} from "@/shared/dtos/email-route";
import { EmailRouteRepository } from "../repositories/email-route";
import { Mapper } from "../lib/mapper";
import { EmailRouteEntity } from "../entities/email-route";

export class EmailRoute {
  private readonly _emailRouteRepository: EmailRouteRepository;
  constructor(db: D1Database) {
    this._emailRouteRepository = new EmailRouteRepository(db);
  }

  async create(dto: EmailRouteDto): Promise<void> {
    const entity = Mapper.dtoToEntity(EmailRouteEntity, dto);
    await this._emailRouteRepository.create(entity);
  }

  async getAll(): Promise<EmailRouteDto[]> {
    const entities = await this._emailRouteRepository.getAll();
    return entities.map(e => Mapper.entityToDto(EmailRouteDto, e));
  }

  async update(id: string, dto: EmailRouteDto): Promise<void> {
    const entity = Mapper.dtoToEntity(EmailRouteEntity, dto);
    await this._emailRouteRepository.update(parseInt(id), entity);
  }

  async delete(id: string): Promise<void> {
    await this._emailRouteRepository.delete(parseInt(id));
  }

  async getDestination(email: string): Promise<string | null> {
    const routeEntity = await this._emailRouteRepository.getByEmail(email);
    if (!routeEntity) {
      return null;
    }

    return routeEntity.destination;
  }
}
