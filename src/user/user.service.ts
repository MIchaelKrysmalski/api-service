import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
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

    async setCurrentRefreshToken(refreshToken: string, userId: number) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersRepository.update(userId, {
            currentHashedRefreshToken
        });
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
        const user = await this.getById(userId);

        const isRefreshTokenMatching = await bcrypt.compare(
            refreshToken,
            user.currentHashedRefreshToken
        );

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
