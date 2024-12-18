import {HTTPException} from "hono/http-exception";
import {createJwtToken, hashText} from "../lib/utils";
import {UserRepository} from "../repositories/user";

export class AuthService {
  private readonly userRepository: UserRepository;
  private readonly jwtSecret: string;

  constructor(db: D1Database, jwtSecret: string) {
    this.userRepository = new UserRepository(db);
    this.jwtSecret = jwtSecret;
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new HTTPException(404, {message: `User not found for email = ${email}`});
    }

    const hashedPassword = hashText(password, user.salt);

    if (hashedPassword !== user.password) {
      throw new HTTPException(401, {message: 'Invalid credential'});
    }

    return createJwtToken({id: user.id, email: user.email}, this.jwtSecret);
  }
}
