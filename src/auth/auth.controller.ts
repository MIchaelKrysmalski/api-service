import {
    Controller,
    Post,
    UseGuards,
    Request,
    Response,
    Body,
    HttpCode,
    Req,
    Res,
    Get,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register-user.dto';
import { LocalAuthGuard } from './local-auth.guard';
import RequestWithUser from './requestWithUser.interface';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import JwtRefreshGuard from './jwt-refresh.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) { }

    @Post('register')
    async register(@Body() registrationData: RegisterDto) {
        return await this.authService.register(registrationData);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('log-in')
    async logIn(@Req() request: RequestWithUser) {
        const { user } = request;
        const accessToken = this.authService.getCookieWithJwtAccessToken(user.id);
        const refreshToken = this.authService.getCookieWithJwtRefreshToken(user.id);

        await this.userService.setCurrentRefreshToken(refreshToken.token, user.id);

        request.res.setHeader('Set-Cookie', [accessToken, refreshToken.cookie]);
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Post('log-out')
    @HttpCode(200)
    async logOut(@Req() request: RequestWithUser) {
        await this.userService.removeRefreshToken(request.user.id);
        request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    authenticate(@Req() request: RequestWithUser) {
        const user = request.user;
        user.password = undefined;
        return user;
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(@Req() request: RequestWithUser) {
        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
            request.user.id,
        );

        request.res.setHeader('Set-Cookie', accessTokenCookie);
        return request.user;
    }
}
