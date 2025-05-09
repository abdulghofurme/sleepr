import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { GetUserDto } from './dto/get-user.dto';
import { User } from '@app/common/entities';
import { Logger } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}
  sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      return this.prismaService.user.create({
        data: {
          ...createUserDto,
          password: await bcrypt.hash(createUserDto.password, 10),
          roles: {
            connectOrCreate: (createUserDto.roles || [])?.map((role) => ({
              where: { name: role.name },
              create: { name: role.name },
            })),
          },
        },
        omit: { password: true },
        include: { roles: true },
      });
    } catch (error) {
      console.log(error);
      // if (/duplicate entry/gi.test(error.message)) {
      //   return {
      //     message: 'Kami telah mengirimkan email jika email tersebut valid.',
      //   };
      // }
      throw new InternalServerErrorException();
    }
  }

  async getUser(getUserDto: GetUserDto) {
    return this.prismaService.user.findFirstOrThrow({
      where: { id: getUserDto.id },
      omit: { password: true },
      include: { roles: true },
    });
  }

  async remove(id: number) {
    return this.prismaService.user.delete({
      where: { id },
      omit: { password: true },
      include: { roles: true },
    });
  }

  async validateUser(email: string, password: string) {
    const user = await this.prismaService.user.findFirst({
      where: { email },
      include: { roles: true },
    });
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return this.sanitizeUser(user as User);
  }
}
