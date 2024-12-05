import { DataSource } from 'typeorm';
import { User } from './user/user.entity'; // Укажите путь к вашим сущностям

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'nestjs_db',
  entities: [User], // Все ваши сущности
  migrations: ['src/migrations/*.ts'], // Путь к миграциям
  synchronize: false, // Выключаем автоматическую синхронизацию
});

export default dataSource;
