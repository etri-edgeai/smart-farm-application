import { Column, DataSource, Entity, PrimaryColumn } from 'typeorm';

/**
 * 테넌트 정보
 */
@Entity({ name: 'tenant' })
export class Tenant {
  @PrimaryColumn({ comment: '코드' })
  code: string
  @Column({ comment: 'db명'})
  dbName: string;
  @Column({ comment: '기본 위도'})
  latitude?: number;
  @Column({ comment: '기본 경도'})
  longitude?: number;
  @Column({ comment: '설명'})
  description?: string;

  static async getTenantByCode(commonDs: DataSource, siteCode: string) {
    const tenantRepo = commonDs.getRepository(Tenant);
    const tenant = await tenantRepo.findOneBy({code: siteCode});
    return tenant;
  }

  static getDefaultTenants() {
    const t = new Tenant();
    t.dbName = 'default';
    return [t];
  }
}
