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
import { ApiCreatedResponse, ApiForbiddenResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
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
        return this.authService.register(registrationData);
    }

    @HttpCode(200)
    @ApiCreatedResponse({ description: 'Login Succesfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' }) 
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async logIn(@Req() request: RequestWithUser) {
        const { user } = request;
        const accessToken = this.authService.getCookieWithJwtAccessToken(user.id);
        const refreshToken = this.authService.getCookieWithJwtRefreshToken(user.id);
        const hashedRefreshToken = await this.userService.setCurrentRefreshToken(refreshToken.token, user.id);

        request.res.setHeader('Set-Cookie', [accessToken, refreshToken.cookie]);
        return { 
            ...user,
            currentHashedRefreshToken: hashedRefreshToken,
            accessToken: accessToken,

        };
    }

    @ApiCreatedResponse({ description: 'Logout Succesfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' }) 
    @UseGuards(JwtAuthGuard)
    @Post('logout')
    @HttpCode(200)
    async logOut(@Req() request: RequestWithUser) {
        await this.userService.removeRefreshToken(request.user.id);
        request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
    }

    @ApiCreatedResponse({ description: 'Auth Succesfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' }) 
    @UseGuards(JwtAuthGuard)
    @Get()
    authenticate(@Req() request: RequestWithUser) {
        const user = request.user;
        user.password = undefined;
        return user;
    }

    @ApiCreatedResponse({ description: 'Refresh Succesfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' }) 
    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    refresh(@Req() request: RequestWithUser) {
        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
            request.user.id,
        );

        request.res.setHeader('Set-Cookie', accessTokenCookie);
        
        return {
            ...request.user,
            accessTokenCookie,
        };
    }
}
