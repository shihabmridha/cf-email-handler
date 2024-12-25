import {BaseDto} from "./base";

export class UserDto extends BaseDto {
  email: string = '';
  isAdmin: boolean = false;
}
