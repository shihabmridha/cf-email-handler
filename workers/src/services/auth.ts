import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import { hashText } from "../lib/utils";
import { LoginDto } from "@/dtos/auth";
import { Configuration } from "../config";
import { IUserRepository } from '../interfaces/repositories/user';

export type JwtPayload = {
  id: number;
  email: string;
  exp: number;
};

export class AuthService {
  private readonly _userRepository: IUserRepository;
  private readonly jwtSecret: string;

  constructor(userRepository: IUserRepository, config: Configuration) {
    this._userRepository = userRepository;
    this.jwtSecret = config.jwtSecret;
  }

  private async createJwtToken(payload: JwtPayload) {
    if (!payload) {
      throw new Error('Empty payload');
    }

    const token = await sign(payload, this.jwtSecret);

    return token;
  }

  async login(dto: LoginDto) {
    const user = await this._userRepository.findByEmail(dto.email);
    if (!user) {
      throw new HTTPException(404, { message: `User not found for email = ${dto.email}` });
    }

    const hashedPassword = hashText(dto.password, user.salt);

    if (hashedPassword !== user.password) {
      throw new HTTPException(401, { message: 'Invalid credential' });
    }

    const payload = {
      id: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
    };

    return this.createJwtToken(payload);
  }
}
