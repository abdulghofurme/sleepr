import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { UserDocument } from './models/user.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  sanitizeUser(user: UserDocument): Omit<UserDocument, 'password'> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.usersRepository.create({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      });
      return this.sanitizeUser(user);
    } catch (error) {
      if (error.code === 11000) {
        return {
          message: 'Kami telah mengirimkan email jika email tersebut valid.',
        };
      }
      throw new InternalServerErrorException();
    }
  }

  async getUser(getUserDto: GetUserDto) {
    const user = await this.usersRepository.findOne(getUserDto);
    return this.sanitizeUser(user);
  }

  async remove(_id: string) {
    const user = await this.usersRepository.findOneAndDelete({ _id });
    return this.sanitizeUser(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return this.sanitizeUser(user);
  }
}
