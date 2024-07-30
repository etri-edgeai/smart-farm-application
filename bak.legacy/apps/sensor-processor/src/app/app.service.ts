import { CommonConfigService } from '@libs/config';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService, private config: CommonConfigService) { }
}