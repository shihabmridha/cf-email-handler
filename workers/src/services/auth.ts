import {HTTPException} from "hono/http-exception";
import {base64Url, createHmacString, hashText} from "../lib/utils";
import {UserRepository} from "../repositories/user";
import {LoginDto} from "@/shared/dtos/auth";
import {Buffer} from "node:buffer";

export class AuthService {
  private readonly userRepository: UserRepository;
  private readonly jwtSecret: string;

  constructor(db: D1Database, jwtSecret: string) {
    this.userRepository = new UserRepository(db);
    this.jwtSecret = jwtSecret;
  }

  private createJwtToken(payload: object, secret: string) {
    if (!payload) {
      throw new Error('Empty payload');
    }

    const jwtHeader = JSON.stringify({ alg: 'HS256', typ: 'JWT' });
    const encodedHeaders = base64Url(Buffer.from(jwtHeader, 'utf8'));
    const encodedPayload = base64Url(Buffer.from(JSON.stringify(payload), 'utf8'));

    const signature = createHmacString(`${encodedHeaders}.${encodedPayload}`, secret);
    const encodedSignature = base64Url(Buffer.from(signature, 'utf8'));

    return `${encodedHeaders}.${encodedPayload}.${encodedSignature}`;
  }

  async login(dto: LoginDto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new HTTPException(404, {message: `User not found for email = ${dto.email}`});
    }

    const hashedPassword = hashText(dto.password, user.salt);

    if (hashedPassword !== user.password) {
      throw new HTTPException(401, {message: 'Invalid credential'});
    }

    return this.createJwtToken({id: user.id, email: user.email}, this.jwtSecret);
  }
}
