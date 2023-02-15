import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserService } from './user.service';
import { LoginResponseDto, UserDto } from '@libs/models';
import { plainToInstance } from 'class-transformer';
import { RefreshToken, TENANT } from '@libs/db';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DateUtils } from '@libs/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private userService: UserService,
    //@InjectRepository(RefreshToken, TENANT) private refreshTokenRepo: Repository<RefreshToken>
    ) { }

  async login(user:LoginResponseDto) {
    const payload = {user: user.user};
    const accessToken = this.jwtService.sign(payload);
    // const refreshToken = this.jwtService.sign(payload, {secret: 'farmconnectRefresh', expiresIn: '1d'});
    // const expiresIn = DateUtils.add(new Date(), 1, 'd').toDate();
    // this.refreshTokenRepo.save({token: accessToken, refreshToken, expiresIn});

    return { ...user, accessToken };
  }
 /*
  async login(data) {
    const loginResponse = await this.validateUser(data.userId, data.password);
    if (!loginResponse.user) {
      throw new UnauthorizedException();
    }
    const payload = {user: loginResponse.user};
    return {...loginResponse, accessToken: this.jwtService.sign(payload, {privateKey: "mykey", expiresIn: '2h'})}
  }
  */

  async profile(data) {
    // const accessToken = data.body.accessToken;
    const accessToken = data.headers.authorization.replace('Bearer ');
    const verified = this.jwtService.verify(accessToken);
    if (!verified) {
      throw new UnauthorizedException();
    }

    return verified;
  }

  async validateUser(username: string, pass: string): Promise<LoginResponseDto> {
    const user = await this.userService.findOne({userId: username});
    if (user && await compare(pass, user.password)) {
      const userDto = plainToInstance(UserDto, user, {excludeExtraneousValues: true});
      return {user: userDto};
    }
    return {user: null};
  }

  async refreshToken(data) {
    await this.profile(data);
    const user = await this.login(data);
    const accessToken = data.headers.authorization.replace('Bearer ');
    console.log(data, user);
    // this.refreshTokenRepo.delete({token: accessToken});
  }
}
