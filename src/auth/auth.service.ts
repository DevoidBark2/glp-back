import {BadRequestException, Injectable} from '@nestjs/common';
import {UserService} from "../user/user.service";
import * as argon2 from "argon2"
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/entity/user.entity";
import {RegisterUserDto} from "./dto/register.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Roles} from "../constants/contants";
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    async registerUser(user: RegisterUserDto){
        const userExists = await this.userService.findOne(user.email);

        if(userExists){
            throw new BadRequestException("Пользователь с таким email уже существует!")
        }

        user.password = await argon2.hash(user.password)

        const otpCode = Math.floor(Math.random() * 10**6).toString().padStart(6, '0');

        await this.userRepository.save({...user,otp_code: otpCode,role: Roles.STUDENT});

        return {
            success: true,
            message: "Ваш аккаунт успешно создан! На вашу почту было отправлено письмо с кодом."
        }
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findOne(email);
        if(!user){
            throw new BadRequestException("Email или пароль не верные!")
        }
        const passwordIsMatch = await argon2.verify(user.password, password);

        if (passwordIsMatch) {
            return user;
        }
        throw new BadRequestException("Email или пароль не верные!")
    }

    async login(user: { email:string }) {
        const userData = await this.userService.findOne(user.email);
        return {
            id: userData.id,
            email: userData.email,
            role: userData.role,
            user_name: userData.second_name + userData.first_name + userData.last_name,
            token: this.jwtService.sign({id:userData.id,email:user.email,role:userData.role})
        }
    }
}
