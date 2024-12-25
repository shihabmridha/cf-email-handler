import {Exclude, Expose} from "class-transformer";

export class BaseEntity {
  @Expose()
  @Exclude({toClassOnly: true})
  id: number = 0;

  @Expose()
  @Exclude({toClassOnly: true})
  createdAt: string = '';

  @Expose()
  @Exclude({toClassOnly: true})
  updatedAt: string = '';
}
