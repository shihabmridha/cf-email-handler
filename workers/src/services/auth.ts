import {HTTPException} from "hono/http-exception";
import {createJwtToken, hashText} from "../lib/utils";
import {UserRepository} from "../repositories/user";
import {LoginDto} from "../dtos/auth";

export class AuthService {
  private readonly userRepository: UserRepository;
  private readonly jwtSecret: string;

  constructor(db: D1Database, jwtSecret: string) {
    this.userRepository = new UserRepository(db);
    this.jwtSecret = jwtSecret;
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

    return createJwtToken({id: user.id, email: user.email}, this.jwtSecret);
  }
}
