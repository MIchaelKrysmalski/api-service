import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ResetPasswordCallbackDto } from './dtos/reset-password-callback.dto';
import { TimeEntry } from 'src/time-entry/entities/timeEntry.entity';
import { TimeEntryService } from 'src/time-entry/time-entry.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,

        @InjectRepository(TimeEntry)
        private timeEntryRepository: Repository<TimeEntry>
    ) { }

    async getById(id: number) {
        const user = await this.usersRepository.findOne({
            where: {
                id: id
            }
        });
        if (user) {
            return user;
        }
        throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }

    async getByEmail(email: string) {
        const user = await this.usersRepository.findOne({
            where: {
                email: email
            }
        });
        if (user) {
            return user;
        }
        throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }

    async resetPassword(id: number,resetPasswordCallbackDto: ResetPasswordCallbackDto) {
        const user = await this.usersRepository.findOne({
            where: {
                id: id
            }
        })
        const hashedPassword = await bcrypt.hash(resetPasswordCallbackDto.newPassword, 10);
        
        if(user) {
            user.password = hashedPassword;
            return this.usersRepository.save(user);
        }
    }

    async getAllUsers() {
        return this.usersRepository.find();
    }

    async createNewUser(userData: CreateUserDto) {
        /* 
        const isPasswordMatching = await bcrypt.compare(passwordInPlaintext, hashedPassword);
        console.log(isPasswordMatching); // true
        */

        const newUser = await this.usersRepository.save({
            email: userData.email,
            firstname: userData.firstname,
            lastname: userData.lastname,
            password: userData.password,
            isAdmin: false
        });
        console.log(newUser);
        return newUser;
    }
    async addTimeEntry(timeentry: TimeEntry, userId: number) {
        const user = await this.getById(userId);
        if(timeentry)
        user.timeEntries.push(timeentry)
        return this.usersRepository.save(user);
    }
    async removeTimeEntry(userId: number, timeEntryId: number) {
        const user = await this.getById(userId);
        if(user) {
            user.timeEntries =  user.timeEntries.filter( timeentry => timeentry.id !== timeEntryId );
            await this.timeEntryRepository.delete(timeEntryId);
        }
        return this.usersRepository.save(user);
    }

    async setCurrentRefreshToken(refreshToken: string, userId: number) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        console.log("current", currentHashedRefreshToken);
        await this.usersRepository.update(userId, {
            currentHashedRefreshToken: currentHashedRefreshToken
        });
        return currentHashedRefreshToken;
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
        const user = await this.getById(userId);
        console.log(refreshToken);
        console.log(user.currentHashedRefreshToken);
        const isRefreshTokenMatching = refreshToken === user.currentHashedRefreshToken;
            console.log(isRefreshTokenMatching);
        if (isRefreshTokenMatching) {
            return user;
        }
    }

    async removeRefreshToken(userId: number) {
        return this.usersRepository.update(userId, {
            currentHashedRefreshToken: null
        });
    }
}
