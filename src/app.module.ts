import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { TimeEntryModule } from './time-entry/time-entry.module';
import { PdfModule } from './pdf/pdf.module';
import { MailModule } from './mail/mail.module';
import { TimeEntry } from './time-entry/entities/timeEntry.entity';
import { Project } from './Projects/entities/project.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true,
    }),
    
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'dbuser',
      password: 'password',
      database: 'timeScheduler',
      entities: [User, TimeEntry, Project],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    TimeEntryModule,
    PdfModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
