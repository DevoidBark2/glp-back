import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    return await this.userRepository.find({
      select: ['id', 'first_name', 'second_name', 'last_name', 'role'],
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

    console.log(decodedToken);
    return await this.userRepository.findOne({
      where: {
        id: decodedToken.id,
      },
    });
  }
}
