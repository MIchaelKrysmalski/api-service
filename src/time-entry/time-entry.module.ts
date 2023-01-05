import { Module } from '@nestjs/common';
import { TimeEntryService } from './time-entry.service';
import { TimeEntryController } from './time-entry.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeEntry } from './entities/timeEntry.entity';
import { UserModule } from 'src/user/user.module';
import { ProjectService } from 'src/Projects/project.service';
import { ProjectModule } from 'src/Projects/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TimeEntry]),
    UserModule,
    ProjectModule
  ],
  providers: [TimeEntryService],
  controllers: [TimeEntryController],
  exports: [TimeEntryService],
})
export class TimeEntryModule {}
