import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';

@Module({
  imports: [
    UserModule, 
    PassportModule.register({
      session: true,
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: `${process.env.ATEXPIRESSIN}s` },
    }),],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
