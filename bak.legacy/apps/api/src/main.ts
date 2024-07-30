import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
//import { WsAdapter } from '@nestjs/platform-ws';
// import { SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import { CommonConfigService, LogWrapper } from '@libs/config';
import { AllExceptionFilter } from './app/filters/all-exception.filter';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const logWrapper = new LogWrapper();
  const app = await NestFactory.create(AppModule, {logger: logWrapper});

  const httpAdapterHost  = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionFilter(httpAdapterHost));

  const config = app.get(CommonConfigService);
  const port = +process.env.PORT || +config.config.get("LOCAL_API_PORT", 8100);

  /*
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Edge api')
    .setDescription("API Description")
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  */

  app.enableCors({ origin: '*' });
  // app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(port, () => {
    Logger.log('Listening at http://0.0.0.0:' + port);
  });
}

bootstrap();
