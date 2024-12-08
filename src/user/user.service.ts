import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Brackets, Not, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create_user.dto';
import * as argon2 from 'argon2';
import { UserRole } from '../constants/contants';
import { GlobalActionDto } from './dto/global-action.dto';
import { ChangeUserProfileDto } from './dto/change-user-profile.dto';
import { CourseUser } from 'src/course/entity/course-user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeUserRoleDto } from './dto/change-user-role.dto';
import { BlockUserDto } from './dto/block-user.dto';
import { StatusUserEnum } from './enum/user-status.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(CourseUser)
    private readonly courseUserRepository: Repository<CourseUser>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll() {
    return await this.userRepository.find({
      where: { role: Not(UserRole.SUPER_ADMIN) },
      order: { id: 'ASC' },
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
      throw new BadRequestException(`Пользователя с ID ${id} не найден!`);
    }

    return user;
  }

  async getUserByToken(token: string) {
    const decodedToken = await this.jwtService.decode(token.split(' ')[1]);

    if (!decodedToken) {
      throw new UnauthorizedException('Invalid Token!');
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

  async searchUserByNameOrEmail(query: string) {
    const queryParts = query.split(' ').filter(Boolean); // Разбиваем строку на части по пробелам и удаляем пустые строки

    return await this.userRepository
      .createQueryBuilder('user')
      .where(
        new Brackets((qb) => {
          queryParts.forEach((part) => {
            qb.andWhere(
              new Brackets((subQb) => {
                subQb
                  .where('user.email ILIKE :part', { part: `%${part}%` })
                  .orWhere('user.first_name ILIKE :part', { part: `%${part}%` })
                  .orWhere('user.second_name ILIKE :part', {
                    part: `%${part}%`,
                  })
                  .orWhere('user.last_name ILIKE :part', { part: `%${part}%` });
              }),
            );
          });
        }),
      )
      .andWhere('user.role != :role', { role: UserRole.SUPER_ADMIN })
      .getMany();
  }

  async setGlobalAction(body: GlobalActionDto) {
    await this.userRepository.update(body.usersIds, { status: body.action });
  }

  async getUserProfileInfo(user: User) {
    const userCourses = await this.courseUserRepository.find({
      where: {
        user: { id: user.id },
      },
    });

    return {
      id: user.id,
      first_name: user.first_name,
      second_name: user.second_name,
      last_name: user.last_name,
      image: user.profile_url,
      email: user.email,
      phone: user.phone,
      city: user.city,
      birth_day: user.birth_day,
      about_me: user.about_me,
      pagination_size: user.pagination_size,
      table_size: user.table_size,
      show_footer_table: user.show_footer_table,
      footerContent: user.footerContent,
      userCourses: userCourses.map((courseUser) => {
        return {
          id: courseUser.id,
          courseId: courseUser.course.id,
          enrolledAt: courseUser.enrolledAt,
          progress: courseUser.progress,
          name: courseUser.course.name,
          image: courseUser.course.image,
          small_description: courseUser.course.small_description,
        };
      }),
    };
  }

  async updateProfile(body: ChangeUserProfileDto, user: User) {
    const currentUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!currentUser) {
      throw new BadRequestException(`Пользователь с ID ${user.id} не найден!`);
    }

    await this.userRepository.update(user.id, body);
  }

  async uploadAvatar(image: string, user: User) {
    const currentUser = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if (!currentUser) {
      throw new BadRequestException(`Пользователь с ID ${user.id} не найден!`);
    }

    await this.userRepository.update(user.id, { profile_url: image });
  }

  async changePassword(body: ChangePasswordDto, user: User) {
    const currentUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
    });

    const passwordIsMatch = await argon2.verify(
      currentUser.password,
      body.currentPassword,
    );

    if (!passwordIsMatch) {
      throw new BadRequestException(
        'Текущий пароль не верный,попробуйте еще раз!',
      );
    }

    if (body.currentPassword === body.newPassword) {
      throw new BadRequestException(
        'Новый пароль совпадает с текущим паролем, используйте другой!',
      );
    }

    await this.userRepository.update(currentUser.id, {
      password: await argon2.hash(body.newPassword),
    });
  }

  async changeUserRole(body: ChangeUserRoleDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: body.userId,
      },
    });

    if (!user) {
      throw new BadRequestException(
        `Пользователь с ID ${body.userId} не найден`,
      );
    }

    await this.userRepository.update(body.userId, { role: body.role });
  }

  async blockUser(body: BlockUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: body.userId,
      },
    });

    if (!user) {
      throw new BadRequestException(
        `Пользователь с ID ${body.userId} не найден`,
      );
    }

    await this.userRepository.update(body.userId, { status: body.status });

    return {
      message:
        body.status === StatusUserEnum.ACTIVATED
          ? 'Пользователь успешно разблокирован!'
          : 'Пользователь успешно заблокирован!',
    };
  }
}
