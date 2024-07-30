import { Injectable } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CommonConfigService } from '@libs/config';

@Injectable()
export class CommOptionsService {
  constructor(private config: CommonConfigService) {}

  getClientOptions(isApi = false): any {
    const options = isApi ? this.config.apiRedis : this.config.redis;
    return {
      transport: Transport.REDIS,
      options: options
    };
  }

  getClientProxy(isApi = false) {
    return ClientProxyFactory.create(
      this.getClientOptions(isApi)
    );
  }
}
