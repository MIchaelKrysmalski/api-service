import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dtos/register-user.dto';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    public async register(registrationData: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registrationData.password,8);
        try {
            const createdUser = await this.userService.createNewUser({
                ...registrationData,
                password: hashedPassword,
            });
            const { password, ...result } = createdUser;
            return result;
        } catch (error) {
            if (error) {
                console.log(error);
                throw new HttpException(
                    'User with that email already exists',
                    HttpStatus.BAD_REQUEST,
                );
            }
            throw new HttpException(
                'Something went wrong',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public async getAuthenticatedUser(email: string, plainTextPassword: string) {
        try {
            const user = await this.userService.getByEmail(email);
            await this.verifyPassword(plainTextPassword, user.password);
            user.password = undefined;
            return user;
        } catch (error) {
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    public getCookieWithJwtToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.ATEXPIRESSIN}s`;
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    private async verifyPassword(
        plainTextPassword: string,
        hashedPassword: string,
    ) {
        const isPasswordMatching = await bcrypt.compare(
            plainTextPassword,
            hashedPassword,
        );
        if (!isPasswordMatching) {
            throw new HttpException(
                'Wrong credentials provided',
                HttpStatus.BAD_REQUEST,
            );
        }
    }
    public getCookieWithJwtAccessToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: `${process.env.ATEXPIRESSIN}s`,
        });
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${process.env.ATEXPIRESSIN}`;
    }
    public getCookieWithJwtRefreshToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: `${process.env.RFEXPIRESSIN}s`,
        });
        const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${process.env.RFEXPIRESSIN}`;
        return {
            cookie,
            token,
        };
    }
    public getCookiesForLogOut() {
        return [
            'Authentication=; HttpOnly; Path=/; Max-Age=0',
            'Refresh=; HttpOnly; Path=/; Max-Age=0',
        ];
    }
    // (...)
}
