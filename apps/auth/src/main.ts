import { microserviceBootstrap } from '@libs/comm';
import { AppModule } from './app/app.module';

async function bootstrap() {
  await microserviceBootstrap(AppModule);
}

bootstrap();
