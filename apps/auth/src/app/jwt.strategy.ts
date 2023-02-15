import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { plainToInstance } from 'class-transformer';
import { FarmDto } from '@libs/models';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  static tokenExtractor(data) {
    const authorization = data.headers.authorization;
    return authorization ? authorization.replace('Bearer ', ''): null;
  }

  constructor(private readonly jwtService: JwtService, private moduleRef: ModuleRef) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.tokenExtractor]),
      ignoreExpiration: false,
      secretOrKey: "farmconnectAuth",
      passReqToCallback: true
    });
  }

  async validate(req: Request, payload: any) {
    const jwtPayload = { user: payload.user };
    const contextId = ContextIdFactory.getByRequest(req);
    const userService = await this.moduleRef.resolve(UserService, contextId).catch(e=> {
      Logger.error(e);
    });

    if (!userService) throw new Error('Failed to login for internal server error.');
    const farm = await userService.findFarm(payload.user.idx);
    const farmDto = plainToInstance(FarmDto, farm, {excludeExtraneousValues: true});

    return {
      user: payload.user,
      farm: farmDto,
      accessToken: this.jwtService.sign(jwtPayload)
    };
  }
}
