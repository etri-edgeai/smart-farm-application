import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { LogWrapper } from './log-wrapper';
import { VERSION } from './version';

export interface DbConfig {
  type: any;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  retryAttempts?: number;
  retryDelay?: number;
}

@Injectable()
export class CommonConfigService {
  multiTenancyEnabled: boolean; // false
  root: string; // running path
  logLevel: string;
  typeormLogEnabled: boolean;
  apiUrl: string; // global cloud api url. default: https://api.farmcloud.kr
  localApiPort: number; // local api server port. default: 8100

  db: DbConfig;
  redis: RedisConfig;
  apiRedis: RedisConfig;

  commonResourceDir: string;

  // TODO: multitenant가 아닐 경우에만 고도화 전 임시로 사용함
  siteCode: string;
  lat: number;
  lng: number;

  constructor(public config: ConfigService) {
    this.logLevel = this.config.get("LOG_LEVEL", "info");
    LogWrapper.setLogLevel(this.logLevel);

    this.multiTenancyEnabled = this.config.get("MULTI_TENANCY_ENABLED", "false") == "true";
    this.root = CommonConfigService.getRoot();
    this.apiUrl = this.config.get("API_URL", "https://api.farmcloud.kr");
    this.localApiPort = +this.config.get("LOCAL_API_PORT", 8100);
    this.typeormLogEnabled = this.config.get("TYPEORM_LOG_ENABLED", false);
    this.typeormLogEnabled = this.typeormLogEnabled && this.config.get("TYPEORM_LOG_ENABLED", false) != "false";
    this.commonResourceDir = this.config.get("COMMON_RESOURCE_DIR", '/data');

    this.siteCode = this.config.get("SITE_CODE");
    this.lat = +this.config.get("LAT", 37.5263625);
    this.lng = +this.config.get("LNG", 126.9404481);

    CommonConfigService.startupMessages();

    this.db = {
      type: this.config.get("DB_TYPE", "mysql"),
      host: this.config.get("DB_HOST"),
      port: this.config.get("DB_PORT"),
      username: this.config.get("DB_USER"),
      password: this.config.get("DB_PASSWORD"),
      database: this.config.get("DB_DATABASE")
    };

    // common.conf에 여러 db config을 설정하고 DB_CODE값이 있을 경우 그 설정을 사용한다
    const dbCode = this.config.get<string>("DB_CODE", "").toUpperCase();
    if (dbCode && dbCode != "") {
      this.db = {
        type: this.config.get(dbCode + "_"+ "DB_TYPE", this.db.type),
        host: this.config.get(dbCode + "_"+ "DB_HOST", this.db.host),
        port: this.config.get(dbCode + "_"+ "DB_PORT", this.db.port),
        username: this.config.get(dbCode + "_"+ "DB_USER", this.db.username),
        password: this.config.get(dbCode + "_"+ "DB_PASSWORD", this.db.password),
        database: this.config.get(dbCode + "_"+ "DB_DATABASE", this.db.database)
      }
    }

    this.redis = {
      host: this.config.get("REDIS_HOST", "localhost"),
      port: +this.config.get("REDIS_PORT", 6379),
      password: this.config.get("REDIS_PASS", ".fc12#$"),
      retryAttempts: 100,
      retryDelay: 2000
    };

    this.apiRedis = {
      host: this.config.get("API_REDIS_HOST", "api.farmcloud.kr"),
      port: +this.config.get("API_REDIS_PORT", 6379),
      password: this.config.get("API_REDIS_PASS", ".fc12#$"),
      retryAttempts: 100,
      retryDelay: 2000
    }
  }

  static startupMessages() {
    const version = CommonConfigService.getVersion();
    Logger.log("=================== Version: " + version + " ===================");
    Logger.log("Common config file: " + CommonConfigService.getConfigFile());

    const appConfigFilePath = CommonConfigService.getAppConfigFile();
    if (fs.existsSync(appConfigFilePath)) {
      Logger.log("App config file: " + CommonConfigService.getAppConfigFile());
    }
  }

  static getAppName() {
    const appName = __dirname.substring(__dirname.lastIndexOf(path.sep) + 1);
    return appName;
  }

  static getRoot() {
    const sep =  path.sep;
    let root = path.join(__dirname, "..");
    const pos = root.indexOf(sep + "dist");
    if (pos > 0) {  // debugging인 경우 devenv를 running root path로 지정한다
      root = path.join(root.substring(0, pos), "devenv");
    } else if (root.endsWith(sep + "config")) { // test등의 경우 이 파일(common-config.service.ts)이 __dirname으로 지정된다
      root = path.join(root, "..", "..", "devenv");
    }
    return root;
  }

  static getRawVersion() {
    return VERSION;
  }

  /**
   * 각 app의 배포 디렉토리에 revision 파일이 있으면 해당파일을 읽어서 버전을 구하고, 아니면 package.json의 version을 구한다.
   * revision은 jenkins에서 빌드할 때 build number를 붙여서 생성한다
   * @returns version
   */
  static getVersion() {
    const file = path.join(__dirname, 'revision');
    let revision = null;
    try {
      revision = fs.readFileSync(file);
    } catch (e) {
      // passthrough
    }
    return revision || VERSION;
  }

  static getConfigFile() {
    let PARAM_CONFIG_FILE = process.argv.slice(2)[0];
    // unit test 등으로 .conf 파일이 아니면 사용하지 않는다
    if (PARAM_CONFIG_FILE && !PARAM_CONFIG_FILE.endsWith(".conf")) {
      PARAM_CONFIG_FILE = null;
    }

    const file = PARAM_CONFIG_FILE ? PARAM_CONFIG_FILE : path.join(CommonConfigService.getRoot(), 'config', 'common.conf');
    return file;
  }

  static getAppConfigFile() {
    const file = path.join(CommonConfigService.getRoot(), 'config', CommonConfigService.getAppName() + '.conf')
    return file;
  }

  getTypeOrmCacheOption(): {type: any, options: any} {
    return {
      type: "ioredis",
      options: this.redis
    };
  }

  /**
   * 파일이름으로 json 내용을 불러 온다
   * @param fileName path를 제외한 config 폴더에 존재하는 파일 이름
   * @returns json object
   */
  loadJsonFile(fileName: string) {
    const file = path.join(this.root, 'config', fileName);
    const jsonFile = fs.readFileSync(file, 'utf8');
    return JSON.parse(jsonFile);
  }

  saveJsonFile(fileName: string, data: unknown) {
    const file = path.join(this.root, 'config', fileName);
    fs.writeFileSync(file, JSON.stringify(data));
  }
}
