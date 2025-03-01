import {BaseEntity} from "./base";

export class EmailRouteEntity extends BaseEntity {
  userId: number = 0;
  email: string = "";
  destination: string = "";
  enabled: boolean = true;
}
