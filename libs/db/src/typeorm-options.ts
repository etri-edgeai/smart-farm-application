import { CommonConfigService } from "@libs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { COLLECT, COMMON } from "./constants";

export const typeormFactory = (config: CommonConfigService, name?: string) => {
  let dbConfig = config.db;
  let database = name;
  if (name == 'default') {
    database = null;
  }

  switch (name) {
    case COMMON: database = 'common'; break;
    case COLLECT: database = 'collect'; break;
  }

  const connOptions: TypeOrmModuleOptions  = {
    name: name || "default",
    type: dbConfig.type,
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: database || dbConfig.database,
    autoLoadEntities: true,
    keepConnectionAlive: true,
    logging: config.typeormLogEnabled,
    // logging: true,
    // timezone: 'Z',
    retryAttempts: 9999, // typeormmodule을 사용하는게 아니면 적용되지 않는다
    cache: config.getTypeOrmCacheOption() // redis

    //entities: [__dirname + '/**/*.entity{.ts,.js}'],
  };

  return connOptions;
};

export const typeormOptions: TypeOrmModuleAsyncOptions = {
  useFactory: typeormFactory,
  inject: [CommonConfigService]
};

export const typeormCollectOptions: TypeOrmModuleAsyncOptions = {
  name: COLLECT,
  useFactory: typeormFactory,
  inject: [CommonConfigService, {token: COLLECT, optional: true}]
};
