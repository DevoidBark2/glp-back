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
import { DEFAULT_SETTINGS_FOR_NEW_USER, UserRole } from '../constants/contants';
import { GeneralSettingsEntity } from 'src/general-settings/entity/general-settings.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(SettingsEntity)
    private readonly settingsEntityRepository: Repository<SettingsEntity>,
    @InjectRepository(GeneralSettingsEntity)
    private readonly generalSettingsEntityRepository: Repository<GeneralSettingsEntity>,
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

    
    const generalSettings = await this.generalSettingsEntityRepository.find();

    const newUser = await this.userRepository.save({
      ...user,
      otp_code: otpCode,
      role: generalSettings ? generalSettings[0].default_user_role : UserRole.STUDENT,
    });

    // Set setting for new user
    const settingForNewUser = this.settingsEntityRepository.create({
      vertex_color: DEFAULT_SETTINGS_FOR_NEW_USER.VERTEX_COLOR,
      edge_color: DEFAULT_SETTINGS_FOR_NEW_USER.EDGE_COLOR,
      type_vertex: DEFAULT_SETTINGS_FOR_NEW_USER.TYPE_VERTEX,
      border_vertex: DEFAULT_SETTINGS_FOR_NEW_USER.BORDER_VERTEX,
      enabled_grid: DEFAULT_SETTINGS_FOR_NEW_USER.ENABLED_GRID,
      background_color: DEFAULT_SETTINGS_FOR_NEW_USER.BACKGROUND_COLOR,
      user: newUser,
    });

    await this.settingsEntityRepository.save(settingForNewUser);

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

    if (!passwordIsMatch) {
      throw new BadRequestException('Email или пароль не верные!');
    }

    return user;
  }

  async login(user: LoginUserDto) {
    const userData = await this.userService.findOne(user.email);
    await this.validateUser(user.email, user.password);

    // const userSettings = await this.settingsEntityRepository.findOne({
    //   where: { user: userData },
    // });
    //
    // if (!userSettings) {
    //   await this.settingsEntityRepository.save({ user: userData });
    // }
    const token = this.jwtService.sign({
      id: userData.id,
      email: user.email,
      role: userData.role,
    });

    return {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      user_name: `${userData.second_name} ${userData.first_name} ${userData.last_name}`,
      token: token,
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
