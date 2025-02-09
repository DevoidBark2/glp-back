import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeedService } from "./seed.service";
import { ThreeModelCategory } from "src/three-model/entity/category.entity";
import { ThreeModelItem } from "src/three-model/entity/item.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ThreeModelCategory, ThreeModelItem])],
    providers: [SeedService],
    exports: [SeedService],
})
export class SeedModule { }
