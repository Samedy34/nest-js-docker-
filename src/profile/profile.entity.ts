import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'varchar', length: 255, nullable: true })
  vkLink: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  igLink: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  dikidiLink: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tg: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  whatsApp: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;
}
