import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from './constants';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-token',
) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    
                    return request?.cookies?.Refresh;
                },
            ]),
            secretOrKey: jwtConstants.secret,
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: TokenPayload) {
        console.log("yeet")
        console.log(request.body);
        const refreshToken = request.body.refreshToken;
        return this.userService.getUserIfRefreshTokenMatches(
            refreshToken,
            payload.userId,
        );
    }
}
