import { Repository } from "typeorm";
import { User } from "./auth.entity";
import { AuthCredentialsDto } from "./dto/auth.credential.dto";


export class UsersRepository extends Repository<User>{
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, username, password } = authCredentialsDto;

    const user = this.create({
      email,
      username,
      password
    })
  }
}