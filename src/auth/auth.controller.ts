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
import { UserService } from 'src/user/user.service';
import JwtRefreshGuard from './jwt-refresh.guard';
import { AccessTokenGuard } from './accessToken.guard';
import { RefreshTokenGuard } from './refreshToken.guard';

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
    @Post('login')
    async logIn(@Req() request: RequestWithUser) {
        return this.authService.login(request.body.email, request.body.password)
    }

    @ApiCreatedResponse({ description: 'Logout Succesfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @UseGuards(AccessTokenGuard)
    @Post('logout')
    @HttpCode(200)
    async logOut(@Req() req: any) {
        this.authService.logout(req.user['sub']);
    }

    @ApiCreatedResponse({ description: 'Auth Succesfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' }) 
    @UseGuards(AccessTokenGuard)
    @Get()
    authenticate(@Req() request: RequestWithUser) {
        const user = request.user;
        user.password = undefined;
        return user;
    }

    @ApiCreatedResponse({ description: 'Refresh Succesfully' })
    @ApiUnprocessableEntityResponse({ description: 'Bad Request' })
    @ApiForbiddenResponse({ description: 'Unauthorized Request' }) 
    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    async refresh(@Req() request: any) {
        console.log(request.user);
        return await this.authService.refresh(request.user.sub,request.user.refreshToken)
    }
}
