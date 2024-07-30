import { LogWrapper } from "@libs/config";
import { NestFactory } from "@nestjs/core";
import { CommOptionsService } from "./comm-options.service";

export async function microserviceBootstrap(appModule: any, connectToApiSever = false) {
  const logWrapper = new LogWrapper();
  const app = await NestFactory.create(appModule, {logger: logWrapper});

  const commOptionsService = app.get(CommOptionsService);
  app.connectMicroservice(commOptionsService.getClientOptions(connectToApiSever));
  await app.startAllMicroservices();
  await app.init(); // for calling lifecycles, schedules

  return app;
}