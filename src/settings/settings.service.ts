import { Injectable } from '@nestjs/common';
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entity/user.entity";
import {SettingsEntity} from "./entity/settings.entity";
import {JwtService} from "@nestjs/jwt";
import {ChangeUserSettingsDto} from "./dto/change_user_settings.dto";

@Injectable()
export class SettingsService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(SettingsEntity) private readonly settingsEntityRepository: Repository<SettingsEntity>,
        private readonly jwtService: JwtService
    ) {}

    async getUserSettings(token){
        const decodedToken = await this.jwtService.decode(token)

        const user = await this.userRepository.findOne({where:{id: decodedToken.id}})

        return await this.settingsEntityRepository.findOne({
            where: {
                user: user
            }
        })
    }

    async changeUserSettings(token:string,changeUserSettings:ChangeUserSettingsDto){
        const decodedToken = await this.jwtService.decode(token)

        const user = await this.userRepository.findOne({where:{id: decodedToken.id}})

        await this.settingsEntityRepository.update(changeUserSettings.id,changeUserSettings)
    }
}
