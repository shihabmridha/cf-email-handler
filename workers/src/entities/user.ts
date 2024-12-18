export interface UserEntity {
  id: string;
  email: string;
  password: string;
  salt: string;
  isAdmin: boolean;
}
