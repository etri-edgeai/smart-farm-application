import { Entity, Column } from 'typeorm';
import { SdBase } from './sd-base.entity';

@Entity({ name: 'sd_culture_medium' })
export class SdCultureMedium extends SdBase {
}
