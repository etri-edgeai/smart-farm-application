import { CreateInternalEnvOldDto, CreateCultureMediumOldDto, CreateExternalEnvOldDto } from ".";

export class SensorRequest {
  idx: string;
  type: string;
  body: {
    internalEnv?: CreateInternalEnvOldDto;
    externalEnv?: CreateExternalEnvOldDto;
    cultureMedium?: CreateCultureMediumOldDto;
    serialNumber?: string;
    use_serial_number?: boolean;
  } = {};
}