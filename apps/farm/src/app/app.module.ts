import { TypeOrmModule } from '@nestjs/typeorm';
import { CommModule } from '@libs/comm';
import { Module } from '@nestjs/common';
import { TENANT, TenantModule, TENANT_ENTITIES } from '@libs/db';

import { AppController } from './app.controller';
import { FarmService } from './farm.service';
import { SensingService } from './sensing.service';
import { WateringService } from './watering.service';
import { DeviceService } from './device.service';
import { GrowthService } from './growth.service';
import { UserService } from './user.service';
import { EquipmentService } from './equipment.service';
import { CultureMediumService } from './culture-medium.service';
import { CropBreedService } from './crop-breed.service';

@Module({
  imports: [
    CommModule,
    TenantModule,
    TypeOrmModule.forFeature(TENANT_ENTITIES, TENANT),
  ],
  controllers: [
    AppController
  ],
  providers: [
    DeviceService,
    FarmService,
    SensingService,
    WateringService,
    GrowthService,
    CropBreedService,
    UserService,
    EquipmentService,
    CultureMediumService
  ],
})
export class AppModule { }
