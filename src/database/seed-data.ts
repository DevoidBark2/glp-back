import { Achievement } from 'src/achievements/entities/achievement.entity';
import { DataSource } from 'typeorm';

export async function seedData(dataSource: DataSource): Promise<void> {
    const achievementsRepository = dataSource.getRepository(Achievement);
}
