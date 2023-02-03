import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dtos/register-user.dto';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async register(registrationData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 8);
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

  public async login(email: string, password: string) {
    const user = await this.userService.getByEmail(email);
    if (!user) throw new BadRequestException('User does not exist');
    const correctPassword = bcrypt.compare(password, user.password);
    if (!correctPassword)
      throw new BadRequestException('Password is incorrect');
    const tokens = await this.getTokens(user.id, user.email, user.isAdmin);

    const hashedRefreshToken = await this.userService.setCurrentRefreshToken(
      tokens.refreshToken,
      user.id,
    );
    return {
      ...(await this.userService.getById(user.id)),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
  async logout(userId: number) {
    return this.userService.removeRefreshToken(userId);
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.userService.getById(userId);
    if (!user || !user.currentHashedRefreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await bcrypt.compare(
        refreshToken,
        user.currentHashedRefreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user.id, user.email, user.isAdmin);
    const hashedRefreshToken = await this.userService.setCurrentRefreshToken(
      tokens.refreshToken,
      user.id,
    );
    return {
      ...(await this.userService.getById(user.id)),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
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
  async getTokens(userId: number, email: string, isAdmin: boolean) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          isAdmin,
        },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          isAdmin,
        },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
  // (...)
}
