import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigModule.forRoot()],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
