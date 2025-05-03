import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { Role, User } from '@app/common/models';
import { Logger } from 'nestjs-pino';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly logger: Logger,
  ) {}
  sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersRepository.create(
        new User({
          ...createUserDto,
          password: await bcrypt.hash(createUserDto.password, 10),
          roles: createUserDto.roles?.map((roleDto) => new Role(roleDto)),
        }),
      );
      return this.sanitizeUser(user);
    } catch (error) {
      if (/duplicate entry/gi.test(error.message)) {
        return {
          message: 'Kami telah mengirimkan email jika email tersebut valid.',
        };
      }
      throw new InternalServerErrorException();
    }
  }

  async getUser(getUserDto: GetUserDto) {
    const user = await this.usersRepository.findOne(getUserDto, {
      roles: true,
    });
    return this.sanitizeUser(user);
  }

  async remove(id: number) {
    await this.usersRepository.findOneAndDelete({ id });
    // return this.sanitizeUser(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email }, { roles: true });
    this.logger.log(user);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return this.sanitizeUser(user);
  }
}
