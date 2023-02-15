import { Controller, UseFilters, UseGuards } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import { CommExceptionFilter } from '@libs/comm';
import { UserService } from './user.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

// passport를 쓰게되면 request scope의 문제로 서로 다른 db 를 두 번 connection 맺으면서 문제가 발생한다
// 수동으로 login, profile을 처리함

@UseFilters(new CommExceptionFilter())
@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }

  @UseGuards(LocalAuthGuard)
  @MessagePattern('auth.login')
  async login(req) { // req: passport에서 만든 request
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern('auth.profile')
  async profile(data) {
    return data.user;
  }
}
