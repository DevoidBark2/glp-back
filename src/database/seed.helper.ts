import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "./database.config";
import { ACHIEVEMENTS_LIST } from "./achievements.seed";
const dataSource = new DataSource(config);

async function runSeeder() {
    try {
        console.log("🔄 Подключение к БД...");
        await dataSource.initialize();

        console.log("🌱 Начало сидирования данных...");
        // await ACHIEVEMENTS_LIST(dataSource); // Вызываем seedAchievements

        console.log("✅ Данные успешно добавлены!");
    } catch (error) {
        console.error("❌ Ошибка при сидировании:", error);
    } finally {
        await dataSource.destroy();
    }
}

runSeeder();
