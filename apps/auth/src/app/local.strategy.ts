import { Injectable, NotFoundException } from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private moduleRef: ModuleRef) {
    super({
      usernameField: 'userId',
      passwordField: 'password',
      passReqToCallback: true
    });
  }

 async validate(req: Request, username: string, password: string): Promise<any> {
    // AuthService 는 request scope인데, 이 클래스는 global이므로 직접 injection이 불가능하다
    const contextId = ContextIdFactory.getByRequest(req);
    this.moduleRef.registerRequestByContextId(req, contextId);
    try {
      const authService = await this.moduleRef.resolve(AuthService, contextId);
      if (!authService) throw new Error('Failed to login for internal server error.');
      const loginResponse = await authService.validateUser(username, password);
      if (!loginResponse.user) {
        throw new NotFoundException();
      }

      return loginResponse;
    }catch (e) {
      throw new Error(e);
    }
  }
}
