import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy, ExtractJwt } from "passport-jwt";
import { User } from "./auth.entity";
import { Repository } from "typeorm";
import { JwtPayload } from "./jwtpayload.interface";
import { PassportStrategy } from "@nestjs/passport";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super({
      secretOrKey: 'myTopSecret10',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { email, username } = payload;
    const user: User = await this.userRepository.findOne({ where: { email, username } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}