/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger, LoggerService, LogLevel } from "@nestjs/common";
import { configure, getLogger } from "log4js";
import * as path from 'path';
import 'source-map-support/register';
import { CommonConfigService } from ".";

export class LogWrapper implements LoggerService {
  private static readonly logger = getLogger();

  constructor(moduleName?: string) {
    LogWrapper.logger.setParseCallStackFunction(this.parseCallStack);
    const fileName = path.join(CommonConfigService.getRoot(), "logs", (moduleName || CommonConfigService.getAppName()) + ".log");
    this.setLog4jOption(fileName, 'info'); // default loglevel
  }

  log(message: any, ...optionalParams: any[]) {
    LogWrapper.logger.info(message);
  }
  info(message: any, ...optionalParams: any[]) {
    LogWrapper.logger.info(message);
  }
  error(message: any, ...optionalParams: any[]) {
    LogWrapper.logger.error(message, ...optionalParams);
  }
  warn(message: any, ...optionalParams: any[]) {
    LogWrapper.logger.warn(message);
  }
  debug?(message: any, ...optionalParams: any[]) {
    LogWrapper.logger.debug(message);
  }
  verbose?(message: any, ...optionalParams: any[]) {
    LogWrapper.logger.trace(message);
  }
  setLogLevels?(levels: LogLevel[]) {
    //
  }

  static setLogLevel(level: string) {
    LogWrapper.logger.level = level;
    Logger.log("Log level: " + LogWrapper.logger.level);
  }

  setLog4jOption(fileName: string, level: string) {
    const filePattern = '%d{yyyy-MM-dd hh:mm:ss.SSS} %-5p [%f{2}:%l] %m';
    const outPattern = '%d{yyyy-MM-dd hh:mm:ss.SSS} %[%-5p%] [%f{2}:%l] %m';
    configure({
      appenders: {
        file: { type: "file", filename: fileName, maxLogSize: 104857600, backups: 7, keepFileExt: true, 
          layout: { type: 'pattern', pattern: filePattern }},
        stdout: { type: "stdout", layout: { type: 'pattern', pattern: outPattern }}
      },
      categories: { default: { appenders: ["stdout", "file"], level: level, enableCallStack: true }}
    });
  }

  parseCallStack(data, skipIdx = 4) {
    const stackReg = /at (?:(.+)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/;
    const stacklines = data.stack.split("\n").slice(skipIdx);
    const lineMatch = stackReg.exec(stacklines[3]);
    if (lineMatch && lineMatch.length === 6) {
      return {
        functionName: lineMatch[1],
        fileName: lineMatch[2],
        lineNumber: parseInt(lineMatch[3], 10),
        columnNumber: parseInt(lineMatch[4], 10),
        callStack: stacklines.join("\n")
      };
    }
    return null;
  }
}