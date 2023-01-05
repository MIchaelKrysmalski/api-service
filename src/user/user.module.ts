import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { TimeEntryModule } from 'src/time-entry/time-entry.module';
import { TimeEntry } from 'src/time-entry/entities/timeEntry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, TimeEntry]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
