import { Injectable, InternalServerErrorException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth.credential.dto';
import { User } from './auth.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwtpayload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) { }


  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, username, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt()//generate salt
    const hashedPassword = await bcrypt.hash(password, salt)//hashed our password

    const user = this.userRepository.create({
      email,
      username,
      password: hashedPassword
    })

    try {
      await this.userRepository.save(user)
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or Email already exists')
      }
      throw new InternalServerErrorException()
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const { email, username, password } = authCredentialsDto;

    const user = await this.userRepository.findOne({ where: { email, username } })

    // console.log(user)
    if (user && (bcrypt.compare(password, user.password))) {
      //return 'Success'
      const payload: JwtPayload = { username, email }
      const accessToken: string = await this.jwtService.sign(payload)

      return { accessToken }
    } else {
      throw new UnauthorizedException('Plase check your credentials')
    }


  }


}
