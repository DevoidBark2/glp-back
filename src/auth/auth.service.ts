import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entity/user.entity';
import { RegisterUserDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingsEntity } from '../settings/entity/settings.entity';
import { BasicResponse } from '../types/BasicResponse';
import { LoginUserDto } from './dto/login.dto';
import { UserRole } from '../constants/contants';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(SettingsEntity)
    private readonly settingsEntityRepository: Repository<SettingsEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(user: RegisterUserDto): Promise<BasicResponse> {
    const userExists = await this.userService.findOne(user.email);

    if (userExists) {
      throw new BadRequestException(
        'Пользователь с таким email уже существует!',
      );
    }

    user.password = await argon2.hash(user.password);

    const otpCode = Math.floor(Math.random() * 10 ** 6)
      .toString()
      .padStart(6, '0');

    await this.userRepository.save({
      ...user,
      otp_code: otpCode,
      role: UserRole.STUDENT,
    });

    return {
      success: true,
      message:
        'Ваш аккаунт успешно создан! На вашу почту было отправлено письмо с кодом.',
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new BadRequestException('Email или пароль не верные!');
    }
    const passwordIsMatch = await argon2.verify(user.password, password);

    if (passwordIsMatch) {
      return user;
    }
    throw new BadRequestException('Email или пароль не верные!');
  }

  async login(user: LoginUserDto) {
    console.log(user);
    const userData = await this.userService.findOne(user.email);

    // const userSettings = await this.settingsEntityRepository.findOne({
    //   where: { user: userData },
    // });
    //
    // if (!userSettings) {
    //   await this.settingsEntityRepository.save({ user: userData });
    // }

    return {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      user_name:
        userData.second_name + userData.first_name + userData.last_name,
      token: this.jwtService.sign({
        id: userData.id,
        email: user.email,
        role: userData.role,
      }),
    };
  }

  async verifyToken(token: string) {
    const decodedToken = await this.jwtService.decode(token);
    if (!decodedToken) {
      return;
    }

    return await this.userRepository.findOne({
      where: { id: decodedToken.id },
    });
  }
}
