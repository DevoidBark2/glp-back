import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create_user.dto';
import * as argon2 from 'argon2';
import { UserRole } from '../constants/contants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    return await this.userRepository.find({
      where: { role: Not(UserRole.SUPER_ADMIN) },
    });
  }

  async findOne(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        courses: true,
        posts: true,
      },
    });

    if (!user) {
      throw new BadRequestException(`User with ID ${id} not found!`);
    }

    return user;
  }

  async getUserByToken(token: string) {
    const decodedToken = await this.jwtService.decode(token);

    console.log('Decoded Token', decodedToken);
    if (!decodedToken) {
      throw new BadRequestException('Invalid Token!');
    }
    return await this.userRepository.findOne({
      where: {
        id: decodedToken.id,
      },
    });
  }

  async create(newUser: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: newUser.email,
      },
    });

    if (existUser) {
      throw `Пользователь с email: ${newUser.email} уже существует!`;
    }

    newUser.password = await argon2.hash(newUser.password);
    await this.userRepository.save(newUser);

    return newUser;
  }

  async delete(id: number) {
    const deletedUser = await this.userRepository.findOne({ where: { id } });

    if (!deletedUser) {
      throw `Пользователя с ID ${id} не существует!`;
    }

    await this.userRepository.delete(id);
  }

  async update(id: number, updatedUser: CreateUserDto) {
    return await this.userRepository.update(id, updatedUser);
  }
}
