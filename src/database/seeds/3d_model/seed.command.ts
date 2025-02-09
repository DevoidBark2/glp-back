import { Injectable } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { Command } from "nestjs-command";

@Injectable()
export class SeedCommand {
    constructor(private readonly seedService: SeedService) { }

    @Command({ command: "seed", describe: "Загрузка тестовых данных в БД" })
    async execute() {
        await this.seedService.seed();
    }
}
