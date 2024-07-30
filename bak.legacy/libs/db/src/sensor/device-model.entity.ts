import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Device } from './device.entity';

@Entity()
export class DeviceModel {
  @PrimaryColumn({ name: "MODEL_CD" })
  idx: number;

  @Column({ name: "MODEL_NM" })
  name: string;

  @Column({ name: "SENSOR_NM" })
  sensorNm: string;

  @OneToMany(() => Device, device => device.model)
  devices: Device[]
}
