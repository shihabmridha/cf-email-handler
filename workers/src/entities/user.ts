import {BaseEntity} from "./base";

export interface UserEntity extends BaseEntity {
  email: string;
  password: string;
  salt: string;
  isAdmin: boolean;
}
