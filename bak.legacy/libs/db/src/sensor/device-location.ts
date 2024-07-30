import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'device_extrn_wth_st', synchronize: false })
export class DeviceLocation {
  @PrimaryGeneratedColumn({ name: 'DEVICE_IDX', comment: '외부기상대번호' })
  deviceIdx?: number;

  @Column({ name: 'EWS_TYPE', comment: '외부기상대 종류|W:기상청,S:외부기상대센서' })
  type?: 'W' | 'S';

  @Column({ name: 'EWS_SHARE_FLAG', comment: '외부기상대 공유 유무' })
  isShared?: boolean;

  @Column({ name: 'EWS_ADDRESS', comment: '설치 주소' })
  address?: string;

  @Column({ name: 'EWS_LATITUDE', type: 'double', comment: '설치 위도' })
  latitude?: number;
  @Column({ name: 'EWS_LONGITUDE', type: 'double', comment: '설치 경도' })
  longitude?: number;

  @Column({ name: 'EWS_WTH_ST_GRID_X', comment: '기상대 격자 X 좌표' })
  gridX?: number;
  @Column({ name: 'EWS_WTH_ST_GRID_Y', comment: '기상대 격자 Y 좌표' })
  gridY?: number;
}
