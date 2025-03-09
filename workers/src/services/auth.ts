import { Buffer } from "node:buffer";
import { createHmac } from "node:crypto";
import { HTTPException } from "hono/http-exception";
import { base64Url, hashText } from "../lib/utils";
import { LoginDto } from "@/shared/dtos/auth";
import { Configuration } from "../config";
import { UserEntity } from '../entities/user';
import { IUserRepository } from '../interfaces/repositories/user';

export class AuthService {
  private readonly _userRepository: IUserRepository<UserEntity>;
  private readonly jwtSecret: string;

  constructor(userRepository: IUserRepository<UserEntity>, config: Configuration) {
    this._userRepository = userRepository;
    this.jwtSecret = config.jwtSecret;
  }

  private createJwtToken(payload: object) {
    if (!payload) {
      throw new Error('Empty payload');
    }

    const exp = Math.floor(Date.now() / 1000) + (60 * 60);
    const jwtHeader = JSON.stringify({ alg: 'HS256', typ: 'JWT', exp });
    const jwtPayload = JSON.stringify(payload);
    const encodedHeaders = base64Url(Buffer.from(jwtHeader, 'utf8'));
    const encodedPayload = base64Url(Buffer.from(jwtPayload, 'utf8'));

    const signature = createHmac('sha256', this.jwtSecret)
      .update(`${encodedHeaders}.${encodedPayload}`)
      .digest();

    const encodedSignature = base64Url(signature);

    return `${encodedHeaders}.${encodedPayload}.${encodedSignature}`;
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

    return this.createJwtToken({ id: user.id, email: user.email });
  }
}
