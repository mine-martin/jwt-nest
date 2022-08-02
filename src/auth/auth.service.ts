import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth.credential.dto';
import { User } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, username, password } = authCredentialsDto;

    const user = this.userRepository.create({
      email,
      username,
      password
    })

    // console.log(user)
    await this.userRepository.save(user)

  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { email, username, password } = authCredentialsDto;

    const user = await this.userRepository.findOne({ where: { email, username } })

    // console.log(user)
    if (!user) {
      throw new UnauthorizedException('Please check your login credentials')
    }
    return { user }


  }


}
