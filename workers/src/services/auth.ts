import { Buffer } from "node:buffer";
import { createHmac } from "node:crypto";
import { HTTPException } from "hono/http-exception";
import { hashText } from "../lib/utils";
import { LoginDto } from "@/dtos/auth";
import { Configuration } from "../config";
import { IUserRepository } from '../interfaces/repositories/user';

export class AuthService {
  private readonly _userRepository: IUserRepository;
  private readonly jwtSecret: string;

  constructor(userRepository: IUserRepository, config: Configuration) {
    this._userRepository = userRepository;
    this.jwtSecret = config.jwtSecret;
  }

  // Replace characters according to base64url specifications
  private base64Url(input: string) {
    return input.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  private createJwtToken(payload: object) {
    if (!payload) {
      throw new Error('Empty payload');
    }

    const exp = Math.floor(Date.now() / 1000) + (60 * 60);
    const jwtHeader = JSON.stringify({ alg: 'HS256', typ: 'JWT', exp });
    const jwtPayload = JSON.stringify(payload);

    const encodedHeaders = this.base64Url(Buffer.from(jwtHeader, 'utf8').toString('base64'));
    const encodedPayload = this.base64Url(Buffer.from(jwtPayload, 'utf8').toString('base64'));

    const signature = createHmac('sha256', this.jwtSecret)
      .update(`${encodedHeaders}.${encodedPayload}`)
      .digest()
      .toString('base64');

    const encodedSignature = this.base64Url(signature);

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
