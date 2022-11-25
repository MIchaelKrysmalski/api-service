
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request) => {
                return request?.cookies?.Authentication;
            }]),
            secretOrKey: jwtConstants.secret
        });
    }

    async validate(payload: TokenPayload) {
        return this.userService.getById(payload.userId);
    }
}