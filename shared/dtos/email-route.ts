import {BaseDto} from "./base";

export class EmailRouteDto extends BaseDto {
  userId: number = 0;
  email: string = '';
  destination: string = '';
  enabled: boolean = true;
}
