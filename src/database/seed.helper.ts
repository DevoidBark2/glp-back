import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "./database.config";
import { ACHIEVEMENTS_LIST } from "./achievements.seed";
const dataSource = new DataSource(config);

async function runSeeder() {
    try {
        await dataSource.initialize();
        // await ACHIEVEMENTS_LIST(dataSource); // Вызываем seedAchievements
    } catch (error) {
        console.error("❌ Ошибка при сидировании:", error);
    } finally {
        await dataSource.destroy();
    }
}

runSeeder();
