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
import { GeneralSettingsService } from 'src/general-settings/general-settings.service';
import { ComplexityPasswordEnum } from 'src/general-settings/enum/complexity-password.enum';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly generalSettingsService: GeneralSettingsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(SettingsEntity)
    private readonly settingsEntityRepository: Repository<SettingsEntity>,
    @InjectRepository(GeneralSettingsEntity)
    private readonly generalSettingsEntityRepository: Repository<GeneralSettingsEntity>,
    private readonly jwtService: JwtService,
  ) { }

  // Метод для точного соответствия требованиям каждого уровня
  private checkPasswordComplexity(password: string, requiredComplexity: ComplexityPasswordEnum, minPasswordLength: number): void {
    // Сообщения по уровням сложности
    const complexityMessages = {
      [ComplexityPasswordEnum.LOW]: `Пароль должен содержать минимум ${minPasswordLength} символов.`,
      [ComplexityPasswordEnum.MEDIUM]: `Пароль должен быть не менее ${minPasswordLength} символов и содержать как минимум одну заглавную букву, одну строчную букву и одну цифру.`,
      [ComplexityPasswordEnum.HIGH]: `Пароль должен быть не менее ${minPasswordLength} символов и содержать заглавные и строчные буквы, цифры и хотя бы один специальный символ.`,
      [ComplexityPasswordEnum.VERY_HIGH]: `Пароль должен быть не менее ${minPasswordLength} символов и содержать заглавные и строчные буквы, цифры и несколько специальных символов для повышенной безопасности.`
    };

    // Проверка для каждого уровня
    let isValid = false;
    switch (requiredComplexity) {
      case ComplexityPasswordEnum.VERY_HIGH:
        isValid = /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password) && password.length >= minPasswordLength;
        break;
      case ComplexityPasswordEnum.HIGH:
        isValid = /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password) && password.length >= minPasswordLength;
        break;
      case ComplexityPasswordEnum.MEDIUM:
        isValid = /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && password.length >= minPasswordLength;
        break;
      case ComplexityPasswordEnum.LOW:
        isValid = password.length >= minPasswordLength;
        break;
    }

    if (!isValid) {
      throw new BadRequestException(complexityMessages[requiredComplexity]);
    }
  }

  async registerUser(user: RegisterUserDto) {
    const userExists = await this.userService.findOne(user.email);

    if (userExists) {
      throw new BadRequestException('Пользователь с таким email уже существует!');
    }

    // Получаем настройки сложности и длины пароля из БД
    const generalSettings = await this.generalSettingsEntityRepository.find();
    const minPasswordLength = generalSettings[0].min_password_length;
    const requiredComplexity = generalSettings[0].password_complexity as ComplexityPasswordEnum;

    // Проверка сложности пароля
    this.checkPasswordComplexity(user.password, requiredComplexity, minPasswordLength);

    // Хеширование пароля перед сохранением
    user.password = await argon2.hash(user.password);

    // Создание пользователя с настройками по умолчанию
    const newUser = await this.userRepository.save({
      ...user,
      role: generalSettings ? generalSettings[0].default_user_role : UserRole.STUDENT,
      verify_email: generalSettings[0].auto_confirm_register ? new Date() : null
    });

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
      message: !generalSettings[0].auto_confirm_register
        ? 'Ваш аккаунт успешно создан! Мы отправили письмо с кодом подтверждения на вашу почту.'
        : 'Вы успешно зарегистрировались!',
    };
  }
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new BadRequestException('Email или пароль не верные, попробуйте еще раз!');
    }

    const generalSettings = await this.generalSettingsEntityRepository.find();
    const lockPeriodMinutes = generalSettings[0]?.lockout_duration || 30;
    const maxLoginAttempts = generalSettings[0]?.max_login_attempts || 5;

    await this.checkUserLock(user);

    const passwordIsMatch = await argon2.verify(user.password, password);

    if (!passwordIsMatch) {
      const newLoginAttempts = Number(user.login_attempts) + 1;
      let lockUntil = user.lock_until;

      if (newLoginAttempts >= maxLoginAttempts) {
        lockUntil = Date.now() + lockPeriodMinutes * 60 * 1000;
      }

      await this.userRepository.update(user.id, {
        login_attempts: newLoginAttempts,
        lock_until: lockUntil,
      });

      throw new BadRequestException('Email или пароль не верные, попробуйте еще раз!');
    }

    await this.userRepository.update(user.id, { login_attempts: 0, lock_until: null });
    return user;
  }

  async checkUserLock(user: User): Promise<void> {
    const currentTime = Date.now();

    if (user.lock_until && user.lock_until > currentTime) {
      const unlockDate = new Date(Number(user.lock_until));
      const unlockTime = unlockDate.toLocaleString('ru-RU', {
        day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
      });
      throw new BadRequestException(`Ваш аккаунт временно заблокирован. Разблокировка: ${unlockTime}`);
    }

    if (user.lock_until && user.lock_until <= currentTime) {
      await this.userRepository.update(user.id, { login_attempts: 0, lock_until: null });
    }
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
      pagination_size: userData.pagination_size,
      table_size: userData.table_size,
      show_footer_table: userData.show_footer_table,
      footerContent: userData.footerContent
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
