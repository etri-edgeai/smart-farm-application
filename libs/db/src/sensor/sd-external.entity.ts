import { Entity, Column } from 'typeorm';
import { SdBase } from './sd-base.entity';

@Entity({ name: 'sd_external' })
export class SdExternal extends SdBase {
}
