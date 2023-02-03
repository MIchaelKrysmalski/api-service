import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AccessTokenGuard } from './auth/accessToken.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}
  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
  @UseGuards(AccessTokenGuard
    )
  @Get('protected')
  getProtected() {
    return 'Hello';
  }
}
