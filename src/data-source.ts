import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { Profile } from './profile/profile.entity'; // Укажите путь к вашим сущностям

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Profile],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

export default dataSource;
