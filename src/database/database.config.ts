import { DataSourceOptions } from 'typeorm'

export const config: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DB_HOST || 'localhost',
	port: Number(process.env.DB_PORT) || 5432,
	username: process.env.DB_USER || 'postgres',
	password: process.env.DB_PASSWORD || 'password',
	database: process.env.DB_NAME || 'mydb',
	entities: ['src/**/*.entity{.ts,.js}'],
	synchronize: false, // Используй true, если хочешь, чтобы таблицы создавались автоматически
	migrations: ['src/migrations/*.ts']
}
