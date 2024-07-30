import { CommModule } from '@libs/comm';
import { TenantModule, User, TENANT, Dong, Farm, UserFarm } from '@libs/db';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UserService } from './user.service';

@Module({
  imports: [
    CommModule,
    PassportModule,
    JwtModule.register({secret: 'farmconnectAuth', signOptions: { expiresIn: '30m' }}),
    TenantModule,
    TypeOrmModule.forFeature([User, Farm, Dong, UserFarm /*, RefreshToken */], TENANT),
  ],
  controllers: [AppController],
  providers: [UserService, AuthService, LocalStrategy, JwtStrategy],
})
export class AppModule {}
