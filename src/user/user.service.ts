import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create_user.dto';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'first_name', 'second_name', 'last_name', 'role', 'email'],
      relations: {
        courses: true,
        posts: true,
      },
    });
  }
  async findOne(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }
  async getUserData(token: string) {
    const userFromToken = await this.jwtService.decode(token);

    const user = await this.findOne(userFromToken.email);

    if (!user) {
      throw new BadRequestException(
        'Ошибка при получении данных пользователя!',
      );
    }

    return this.userRepository.findOne({
      where: userFromToken.id,
      select: [
        'id',
        'first_name',
        'second_name',
        'last_name',
        'birth_day',
        'city',
        'university',
      ],
    });
  }

  async findOneById(id: number) {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserByToken(token: string) {
    const decodedToken = await this.jwtService.decode(token);

    if (!decodedToken) {
      throw new BadRequestException('Invalid Token!');
    }
    return await this.userRepository.findOne({
      where: {
        id: decodedToken.id,
      },
    });
  }

  async createUser(body: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: body.email,
      },
    });

    if (existUser) {
      throw `Пользователь с email: ${body.email} уже существует!`;
    }

    body.password = await argon2.hash(body.password);
    const newUser = this.userRepository.create(body);
    await this.userRepository.save(newUser);

    delete newUser.password;
    return newUser;
  }

  async delete(id: number) {
    const deletedUser = await this.userRepository.findOne({ where: { id } });

    if (!deletedUser) {
      throw `Пользователя с ID ${id} не существует!`;
    }

    await this.userRepository.delete(id);
  }
}
